// Apply once to the official 2026-09-11 Bird bundle; fail on upstream drift.
import { readFile, writeFile } from 'node:fs/promises';
const path = 'bird-game/bird/generated/compressed.js';
let source = await readFile(path, 'utf8');
const replacements = [
  ['var a={rtl:rk,trashcan:!0},b=T("toolbox");', 'var a={rtl:rk,trashcan:!0,zoom:{controls:false,wheel:false,startScale:0.8,maxScale:1.5,minScale:0.4,scaleSpeed:1.2}},b=T("toolbox");'],
  ['g.Ie=function(a,b){this.h=this.m.l;', 'g.Ie=function(a,b){window.BirdTouch.open(uh(this),function(v){Id(this,v)}.bind(this));return;this.h=this.m.l;'],
  ['g.Ie=function(a){Zj.j.Ie.call(this,a,Ta||Na||Oa);', 'g.Ie=function(a){window.BirdTouch.open(uh(this),function(v){Id(this,v)}.bind(this),true);return;Zj.j.Ie.call(this,a,Ta||Na||Oa);'],
];
for (const [before, after] of replacements) {
  if (source.includes(after)) continue;
  if (source.split(before).length !== 2) throw new Error('Upstream editor changed: review patch');
  source = source.replace(before, after);
}
await writeFile(path, source);
let html = await readFile('bird-game/bird.html', 'utf8');
if (!html.includes('touch-input.js')) html = html.replace('<script src="common/boot.js">', '<link rel="stylesheet" href="touch-input.css">\n  <script src="touch-input.js"></script>\n  <script src="common/boot.js">');
await writeFile('bird-game/bird.html', html);
let boot = await readFile('bird-game/common/boot.js', 'utf8');
boot = boot.replace(/window\['BlocklyGamesLanguages'\] = \[[\s\S]*?\];/, "window['BlocklyGamesLanguages'] = ['en', 'zh-hant'];");
boot = boot.replace('debug = !!sessionStorage.getItem(\'debug\');', 'debug = false; // This standalone build contains compiled assets only.');
await writeFile('bird-game/common/boot.js', boot);
console.log('Bird touch editors patched.');
