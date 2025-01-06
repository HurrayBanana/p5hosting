/*************** SYSTEM VARIABLES *****************/
let backcol = [10];
/*************** DEFINED KEYS *****************/
//keycodes from
//https://www.toptal.com/developers/keycode
let W = 87;
let S = 83;
let A = 65;
let D = 68;
let V = 86;
let P = 80;
let O = 79;
let B = 66;

/*************** MY TEXTURES *****************/
let txpengo;
let txpengotiles
let txtiles
let txsprites
/*************** GLOBAL VARIABLES *****************/
let gamecode;
let rng
let count = 1000
let freq = [0,0,0,0]


function setlabel(from, to, textbefore, textafter){
  textafter = (textafter === undefined) ? "" : textafter
  document.getElementById(to).innerHTML = textbefore + from.value + textafter
}

function preload(){
  Tex.loadToTexture("./images/tilesets.png", (img)=>{
    txtiles=img;});
  Tex.loadToTexture("./images/pengosprites.png", (img)=>{
    txsprites=img;});
  Tex.loadToTexture("./images/pengosprites2.png", (img)=>{
    txsprites=img;});
    

  Tex.loadToTexture("./images/pengo.png", (img)=>{
    txpengo=img;});
    Tex.loadToTexture("./images/image.png", (img)=>{
      txpengotiles=img;});
    rng = new PengoRandom(0x365a)
}
function setup() {
  Engine.init({viewW:1200,viewH:800,worldW:800,worldH:800,glowdivisor:8});
  gamecode = new Game();
}

/** perform general game logic and update engine */
function logic() {
  //Engine.update(0.0167);
  Engine.update(deltaTime / 1000);
  gamecode.update();
}
function cleanup(){
}
/**
 * main logic and drawing code
 * 
 */
function draw(){
  logic();
  background(backcol);
  Engine.draw();
  gamecode.draw();
  postdraw();
}

/** any additional drawing after engine work */
function postdraw(){
  push();
  pop();
}