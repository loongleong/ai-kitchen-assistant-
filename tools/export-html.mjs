import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

// Export the built app itself, including its real React state and callbacks.
// No DOM rewriting, mock screens or runtime server is needed by the exported file.
const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
const output = process.argv[2] ? resolve(process.argv[2]) : resolve(root, '../../outputs/SavorAI.html');
let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)];
if (scripts.length !== 1) throw new Error('Expected one bundled JavaScript entry. Build the app before exporting.');
let javascript = await readFile(resolve(dist, scripts[0][1].replace(/^\//, '')), 'utf8');
if (/\bimport\s*\(/.test(javascript)) throw new Error('The export needs a single JavaScript bundle; found a dynamic import.');

const images = {};
async function collectImages(directory) {
  for (const entry of await readdir(directory, { withFileTypes:true })) {
    const path = resolve(directory,entry.name);
    if (entry.isDirectory()) await collectImages(path);
    else if (entry.name.endsWith('.webp')) {
      const url = '/' + relative(dist,path).split(sep).join('/');
      images[url] = `data:image/webp;base64,${(await readFile(path)).toString('base64')}`;
    }
  }
}
await collectImages(resolve(dist,'images'));
let embeddedReferences = 0;
// Static migrated assets and dynamic recipe paths share the same embedded map.
javascript = javascript.replace(/(["'])\/images\/[^"']+\.webp\1/g, literal => {
  if (!images[literal.slice(1,-1)]) throw new Error(`Missing exported image: ${literal}`);
  embeddedReferences++;
  return `savoraiExportImage(${literal})`;
});
// Vite preserves these template literals, including the recipe and cooking-stage paths.
javascript = javascript.replace(/`\/images\/[^`]*`/g, expression => {
  embeddedReferences++;
  return `savoraiExportImage(${expression})`;
});
if (embeddedReferences === 0) throw new Error('No image references were embedded. Review the built asset format.');
javascript = `const savoraiExportImages=${JSON.stringify(images)};\nconst savoraiExportImage=path=>savoraiExportImages[path]||path;\n${javascript}`;
await transform(javascript, { loader:'js', target:'es2022' });
html = html.replace(scripts[0][0], '');
for (const stylesheet of [...html.matchAll(/<link\b[^>]*\bhref="(\/assets\/[^" ]+\.css)"[^>]*>/g)]) {
  let css = await readFile(resolve(dist, stylesheet[1].replace(/^\//, '')), 'utf8');
  css = css.replace(/url\((["']?)(\/images\/[^)"']+)\1\)/g, (_,quote,url)=>{
    if (!images[url]) throw new Error(`Missing CSS image: ${url}`);
    return `url("${images[url]}")`;
  });
  html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
}
html = html.replace('</body>', () => `<script type="module">${javascript.replace(/<\/script/gi, '<\\/script')}</script>\n</body>`);
await mkdir(resolve(output, '..'), { recursive:true });
await writeFile(output, html);
console.log(JSON.stringify({ output, images:Object.keys(images).length, embeddedReferences, validJavaScript:true, externalAppScripts:0, externalAppStylesheets:0, bytes:Buffer.byteLength(html), optionalNetwork:'Google Fonts; system font fallback works offline' }, null, 2));
