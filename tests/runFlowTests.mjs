import { transform } from 'esbuild';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';

// Compile the small pure-data test graph without a platform-specific loader cache.
const directory = resolve('node_modules/.cache/savorai-tests');
await mkdir(directory, { recursive:true });
const files = [];
for (const folder of ['src/lib','src/data','tests']) for (const name of await readdir(folder)) if (name.endsWith('.ts')) files.push(`${folder}/${name}`);
for (const filename of files) {
  const source = await readFile(filename, 'utf8');
  const name = filename.split('/').at(-1).replace('.ts', '.mjs');
  const compiled = (await transform(source, { loader:'ts', target:'es2022', format:'esm' })).code
    .replace(/from ['"](?:\.\.\/|\.\/)(?:[^'"]*\/)?([^/'"]+)['"]/g, 'from "./$1.mjs"');
  await writeFile(resolve(directory, name), compiled);
}
execFile(process.execPath, ['--test', ...files.filter(filename=>filename.endsWith('.test.ts')).map(filename=>resolve(directory,filename.split('/').at(-1).replace('.ts','.mjs')))], { windowsHide:true }, (error, stdout, stderr) => {
  process.stdout.write(stdout); process.stderr.write(stderr);
  process.exitCode = error ? 1 : 0;
});
