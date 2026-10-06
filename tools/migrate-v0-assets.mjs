import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

// One-time local import of the supplied, approved artwork. No network or generated imagery.
const require = createRequire(import.meta.url);
const sharp = require(process.argv[3] || 'sharp');
const source = resolve(process.argv[2]);
const destination = resolve('public/images/savor');
await mkdir(destination, { recursive:true });
const inventory = [];
for (const name of ['basil-chicken','cooking','cuisines','kitchen-panorama','kitchen']) {
  const input = await readFile(resolve(source, `${name}.png`));
  const {width,height} = await sharp(input).metadata();
  const data = await sharp(input).webp({quality:86}).toBuffer();
  await writeFile(resolve(destination,`${name}.webp`),data);
  inventory.push({name,width,height,sourceBytes:input.length,bytes:data.length});
}
// Separate photographs avoid loading/cropping a complete sprite for every small card.
const grid = await readFile(resolve(source,'cuisines.png'));
const {width,height} = await sharp(grid).metadata();
const tileWidth = Math.floor(width / 3), tileHeight = Math.floor(height / 2);
for (const [index,name] of ['malaysian','chinese','japanese','korean','thai','italian'].entries()) {
  const data = await sharp(grid).extract({left:index%3*tileWidth,top:Math.floor(index/3)*tileHeight,width:tileWidth,height:tileHeight}).webp({quality:86}).toBuffer();
  await writeFile(resolve(destination,`cuisine-${name}.webp`),data);
  inventory.push({name:`cuisine-${name}`,width:tileWidth,height:tileHeight,bytes:data.length});
}
await writeFile(resolve(destination,'asset-inventory.json'),JSON.stringify(inventory,null,2));
console.log(JSON.stringify(inventory,null,2));
