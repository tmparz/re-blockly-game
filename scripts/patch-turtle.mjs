import { readFile, writeFile } from 'node:fs/promises';

const turtleCompressedPath = 'blockly-games/turtle/generated/compressed.js';
let source = await readFile(turtleCompressedPath, 'utf8');

// 1. 定義並注入 TurtleAngleField（使用安全無衝突的屬性與方法命名）
const fieldAngleImplementation = `
function TurtleAngleField(a,b,c){
  this.isAngleField=!0;
  this.clockwise=!1;
  this.angleOffset=0;
  this.angleWrap=360;
  this.angleRound=15;
  TurtleAngleField.l.constructor.call(this,a,b,c);
  this.angleSvg=this.angleGauge=this.angleLine=this.angleCircle=this.angleWrapper=null;
  this.angleClickListener=this.angleMouseMoveListener=this.angleContainerClickListener=null;
}
F(TurtleAngleField,Sn);
TurtleAngleField.prototype.If=0;
TurtleAngleField.M=function(a){return new TurtleAngleField(a.angle,void 0,a)};
var _tg=TurtleAngleField.prototype;
_tg.Lf=!0;
_tg.Yf=function(){
  TurtleAngleField.l.Yf.call(this);
  this.degreeSymbol=B(Cc,{},null);
  this.degreeSymbol.appendChild(document.createTextNode("\\u00b0"));
  this.ib.appendChild(this.degreeSymbol);
};
_tg.uh=function(){
  TurtleAngleField.l.uh.call(this);
  _turtleUpdateGauge(this);
};
_tg.Qd=function(a){
  TurtleAngleField.l.Qd.call(this,a);
  this.createAnglePicker();
  df.appendChild(this.angleWrapper);
  var borderCol=this.m.style.Xd||"#4a90e2";
  cf.style.backgroundColor=this.m.style.Wd||"#fff";
  cf.style.borderColor=borderCol;
  of(this,this.disposeAnglePicker.bind(this));
  _turtleUpdateGauge(this);
};
_tg.createAnglePicker=function(){
  var container=document.createElement("div");
  container.className="turtle-angle-container";
  container.style.display="flex";
  container.style.flexDirection="column";
  container.style.alignItems="center";
  container.style.padding="6px 8px";
  container.style.userSelect="none";

  var svg=B(Ac,{xmlns:"http://www.w3.org/2000/svg",version:"1.1",height:"100px",width:"100px"},container);
  svg.style.touchAction="none";
  svg.style.cursor="pointer";

  var circle=B(kc,{cx:50,cy:50,r:49,"class":"blocklyAngleCircle"},svg);
  this.angleCircle=circle;
  this.angleGauge=B(wc,{"class":"blocklyAngleGauge"},svg);
  this.angleLine=B(vc,{x1:50,y1:50,"class":"blocklyAngleLine"},svg);

  for(var c=0;c<360;c+=15){
    B(vc,{x1:99,y1:50,x2:99-(c%45==0?10:5),y2:50,"class":"blocklyAngleMarks",transform:"rotate("+c+",50,50)"},svg);
  }

  var buttonsDiv=document.createElement("div");
  buttonsDiv.className="turtle-angle-presets";
  buttonsDiv.style.display="grid";
  buttonsDiv.style.gridTemplateColumns="repeat(3, 1fr)";
  buttonsDiv.style.gap="4px";
  buttonsDiv.style.marginTop="8px";
  buttonsDiv.style.width="100%";

  var commonAngles=[1,45,72,90,120,144];
  var self=this;
  commonAngles.forEach(function(ang){
    var btn=document.createElement("button");
    btn.type="button";
    btn.textContent=ang+"\\u00b0";
    btn.style.padding="4px 2px";
    btn.style.fontSize="12px";
    btn.style.fontWeight="bold";
    btn.style.color="#333";
    btn.style.borderRadius="4px";
    btn.style.border="1px solid #bbb";
    btn.style.background="#f0f0f0";
    btn.style.cursor="pointer";
    btn.onmouseenter=function(){btn.style.background="#ddd"};
    btn.onmouseleave=function(){btn.style.background="#f0f0f0"};
    btn.onclick=function(e){
      e.stopPropagation();
      self.setAngle(ang);
    };
    buttonsDiv.appendChild(btn);
  });
  container.appendChild(buttonsDiv);

  this.angleContainerClickListener=r(svg,"click",this,this.onContainerClick);
  this.angleClickListener=r(circle,"click",this,this.onPickerPointerMove,!0,!0);
  this.angleMouseMoveListener=r(circle,"mousemove",this,this.onPickerPointerMove,!0,!0);

  circle.addEventListener("pointerdown",function(e){
    self.onPickerPointerMove(e);
    function onPointerMove(ev){self.onPickerPointerMove(ev)}
    function onPointerUp(){
      window.removeEventListener("pointermove",onPointerMove);
      window.removeEventListener("pointerup",onPointerUp);
    }
    window.addEventListener("pointermove",onPointerMove);
    window.addEventListener("pointerup",onPointerUp);
  });

  this.angleWrapper=container;
  this.angleSvg=svg;
};
_tg.setAngle=function(b){
  b=_turtleCheckAngle(this,b);
  if(b!=this.pa){
    this.Gd=!0;
    this.Di&&this.hc&&(this.hc.value=String(b));
    this.Na(b);
    _turtleUpdateGauge(this);
  }
};
_tg.disposeAnglePicker=function(){
  this.angleContainerClickListener&&(t(this.angleContainerClickListener),this.angleContainerClickListener=null);
  this.angleClickListener&&(t(this.angleClickListener),this.angleClickListener=null);
  this.angleMouseMoveListener&&(t(this.angleMouseMoveListener),this.angleMouseMoveListener=null);
  this.angleLine=this.angleGauge=this.angleCircle=this.angleSvg=null;
};
_tg.onContainerClick=function(){
  gf===this&&vf();
};
_tg.onPickerPointerMove=function(a){
  if(!this.angleGauge||!this.angleGauge.ownerSVGElement)return;
  var b=this.angleGauge.ownerSVGElement.getBoundingClientRect();
  var c=a.clientX-b.left-50;
  var d=a.clientY-b.top-50;
  var theta=Math.atan(-d/c);
  if(!isNaN(theta)){
    theta=theta*180/Math.PI;
    c<0?theta+=180:d>0&&(theta+=360);
    theta=this.clockwise?this.angleOffset+360-theta:360-(this.angleOffset-theta);
    var target=theta;
    if(Math.abs(target-72)<=4)target=72;
    else if(Math.abs(target-144)<=4)target=144;
    else if(target<=4||target>=356)target=1;
    else if(this.angleRound)target=Math.round(target/this.angleRound)*this.angleRound;
    this.setAngle(target);
  }
};
function _turtleUpdateGauge(a){
  if(a.angleGauge){
    var b=(Number(a.pa)+a.angleOffset)%360*Math.PI/180;
    var c=["M ",50,",",50];
    var d=50,e=50;
    if(!isNaN(b)){
      var f=Number(a.clockwise);
      var h=a.angleOffset*Math.PI/180;
      var k=Math.cos(h)*49;
      var l=Math.sin(h)*-49;
      f&&(b=2*h-b);
      d+=Math.cos(b)*49;
      e-=Math.sin(b)*49;
      b=Math.abs(Math.floor((b-h)/Math.PI)%2);
      f&&(b=1-b);
      c.push(" l ",k,",",l," A ",49,",",49," 0 ",b," ",f," ",d,",",e," z");
    }
    a.angleGauge.setAttribute("d",c.join(""));
    a.angleLine.setAttribute("x2",d);
    a.angleLine.setAttribute("y2",e);
  }
}
function _turtleCheckAngle(a,b){
  b=Number(b)||0;
  b%=360;
  b<0&&(b+=360);
  b>a.angleWrap&&(b-=360);
  return b;
}
_tg.fe=function(a){
  a=Number(a);
  return isNaN(a)||!isFinite(a)?null:_turtleCheckAngle(this,a);
};
_tg.au=function(a){
  TurtleAngleField.l.au.call(this,a);
  var b;
  a.keyCode===37?b=this.m.o?1:-1:a.keyCode===39?b=this.m.o?-1:1:a.keyCode===40?b=-1:a.keyCode===38&&(b=1);
  b&&(this.setAngle(Number(this.pa)+b*this.angleRound),a.preventDefault(),a.stopPropagation());
};
Re([
  ".blocklyAngleCircle { stroke: #444; stroke-width: 1; fill: #ddd; fill-opacity: .8; }",
  ".blocklyAngleMarks { stroke: #444; stroke-width: 1; }",
  ".blocklyAngleGauge { fill: #f88; fill-opacity: .8; pointer-events: none; }",
  ".blocklyAngleLine { stroke: #f00; stroke-width: 2; stroke-linecap: round; pointer-events: none; }"
]);
v(Pb,"field_angle",TurtleAngleField);
`;

// 如果之前已經注入過舊的 TurtleAngleField 區塊，先把它移除以更新為新版
if (source.includes('function TurtleAngleField(')) {
  const startIdx = source.indexOf('\nfunction TurtleAngleField(');
  const endMarker = 'v(Pb,"field_angle",TurtleAngleField);\n';
  const endIdx = source.indexOf(endMarker);
  if (startIdx !== -1 && endIdx !== -1) {
    source = source.slice(0, startIdx) + source.slice(endIdx + endMarker.length);
  }
}

const insertAfter = 'v(Pb,"field_input",Sn);';
if (!source.includes(insertAfter)) throw new Error('Cannot find field_input registration anchor in turtle compressed.js');
source = source.replace(insertAfter, insertAfter + fieldAngleImplementation);

// 2. 更新 turtle_turn_internal 定義
const dropdownTurn = '{type:"field_dropdown",name:"VALUE",options:[["1\\u00b0","1"],["45\\u00b0","45"],["72\\u00b0","72"],["90\\u00b0","90"],["120\\u00b0","120"],["144\\u00b0","144"]]}';
const angleTurn = '{type:"field_angle",name:"VALUE",angle:90}';

if (source.includes(dropdownTurn)) {
  source = source.replace(dropdownTurn, angleTurn);
}

// 3. 更新 Sn.prototype.Qd 的分流
const originalTouchIntercept = 'g.Qd=function(a,b){window.BlocklyTouchInput.open(this.Tb(),function(v){this.Na(v)}.bind(this));return;this.h=this.m.i;';
const bypassedTouchIntercept = 'g.Qd=function(a,b){if(this.isAngleField||(typeof TurtleAngleField!=="undefined"&&this instanceof TurtleAngleField)){this.h=this.m.i;a=b||!1;!a&&(Za||Ta||Ua)?Vn(this):(jh(this,this.m.o,this.Ou.bind(this)),this.hc=this.cp(),this.Di=!0,a||(this.hc.focus({preventScroll:!0}),this.hc.select()));return;}window.BlocklyTouchInput.open(this.Tb(),function(v){this.Na(v)}.bind(this));return;this.h=this.m.i;';

if (source.includes(originalTouchIntercept)) {
  source = source.replace(originalTouchIntercept, bypassedTouchIntercept);
}

// 4. 更新第 10 關 toolbox
const level10TurnOriginal = '<block type="turtle_move">\n    <value name="VALUE">\n      <shadow type="math_number">\n        <field name="NUM">10</field>\n      </shadow>\n    </value>\n  </block>\n  <block type="turtle_turn">';
const level10TurnPatched = '<block type="turtle_move_internal">\n    <field name="VALUE">100</field>\n  </block>\n  <block type="turtle_turn_internal">\n    <field name="VALUE">90</field>\n  </block>\n  <block type="turtle_move">\n    <value name="VALUE">\n      <shadow type="math_number">\n        <field name="NUM">10</field>\n      </shadow>\n    </value>\n  </block>\n  <block type="turtle_turn">';

if (source.includes(level10TurnOriginal)) {
  source = source.replace(level10TurnOriginal, level10TurnPatched);
}

await writeFile(turtleCompressedPath, source);
console.log('Turtle compressed.js successfully patched with collision-free FieldAngle!');
