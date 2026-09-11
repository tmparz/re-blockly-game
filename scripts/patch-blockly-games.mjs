import { readFile, writeFile } from 'node:fs/promises';

const games = [
  { name: 'turtle', number: ['g.Qd=function(a,b){this.h=this.m.i;', 'g.Qd=function(a,b){window.BlocklyTouchInput.open(this.Tb(),function(v){this.Na(v)}.bind(this));return;this.h=this.m.i;'] },
  { name: 'movie', number: ['g.Ge=function(a,b){this.h=this.m.i;', 'g.Ge=function(a,b){window.BlocklyTouchInput.open(this.Sb(),function(v){this.Ja(v)}.bind(this));return;this.h=this.m.i;'] },
  { name: 'music', number: ['g.od=function(a,b){this.h=this.m.i;', 'g.od=function(a,b){window.BlocklyTouchInput.open(this.fc(),function(v){this.Ta(this.cn(v))}.bind(this));return;this.h=this.m.i;'], pitch: ['g.od=function(){sn.prototype.od.call(this);', 'g.od=function(){window.BlocklyTouchInput.openPitch(this.Ya(),function(v){this.Ta(v)}.bind(this));return;sn.prototype.od.call(this);'], workspace: ['$n();document.body.innerHTML=bo();', '$n();window.blocklyGamesMusicWorkspace=bk;document.body.innerHTML=bo();'] },
  { name: 'pond/tutor', number: ['g.Jd=function(a,b){this.h=this.m.i;', 'g.Jd=function(a,b){window.BlocklyTouchInput.open(this.Ob(),function(v){gd(this,v)}.bind(this));return;this.h=this.m.i;'], angle: ['g.Jd=function(a){$n.l.Jd.call(this,a,yb||sb||tb);', 'g.Jd=function(a){window.BlocklyTouchInput.open(this.Ob(),function(v){gd(this,v)}.bind(this),true);return;$n.l.Jd.call(this,a,yb||sb||tb);'] },
  { name: 'pond/duck', number: ['g.Ld=function(a,b){this.h=this.m.i;', 'g.Ld=function(a,b){window.BlocklyTouchInput.open(this.Pb(),function(v){Ee(this,v)}.bind(this));return;this.h=this.m.i;'], angle: ['g.Ld=function(a){Wn.l.Ld.call(this,a,Wa||Qa||Ra);', 'g.Ld=function(a){window.BlocklyTouchInput.open(this.Pb(),function(v){Ee(this,v)}.bind(this),true);return;Wn.l.Ld.call(this,a,Wa||Qa||Ra);'] },
];

for (const game of games) {
  const path = `blockly-games/${game.name}/generated/compressed.js`;
  let source = await readFile(path, 'utf8');
  for (const [before, after] of [game.number, game.pitch, game.workspace, game.angle].filter(Boolean)) {
    if (source.includes(after)) continue;
    if (source.split(before).length !== 2) throw new Error(`${game.name}: upstream signature changed`);
    source = source.replace(before, after);
  }
  await writeFile(path, source);
  const htmlPath = `blockly-games/${game.name === 'pond/tutor' ? 'pond-tutor' : game.name === 'pond/duck' ? 'pond-duck' : game.name}.html`;
  let html = await readFile(htmlPath, 'utf8');
  if (!html.includes('touch-input.js')) html = html.replace('<script src="common/boot.js">', '<link rel="stylesheet" href="touch-input.css">\n  <script src="touch-input.js"></script>\n  <script src="common/boot.js">');
  await writeFile(htmlPath, html);
}

console.log(`Patched ${games.length} Blockly Games for touch numeric, angle, and note input.`);
