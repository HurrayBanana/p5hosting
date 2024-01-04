
  //storage for my textures
  let txsprite = null;
  let txtiles = null;
  let  bluetri;
  let  cyantri;
  let  limetri;
// ----------------
  let blinkyscore = 0;
  let clydescore = 0;

  let refclyde;
  let refblinky;
  /*************** SYSTEM VARIABLES *****************/
  /** holds delta time (frame time in seconds) */
  let delta;

  //width and height for screen area
  let wd = 600;
  let ht = 600;
  let backcol = 40;

    //can only load images if using liveserver
  function preload(){
    //Engine.init({layers:4,glowdivisor:8});
    //Engine.glow[0].drawingContext.globalCompositeOperation = "lighter";
    //Engine.spM.debug = true;
    ////loadImage("pacboard.png", (img)=>{txtiles = img;});
    //loadImage("pacsprites.png", (img)=>{txsprite = img;});
    // use these 2 lines instead if live server doesn't work
    loadImage("https://hurraybanana.github.io/p5hosting/img/pacboard.png", (img)=>{txtiles = img;});
    loadImage("https://hurraybanana.github.io/p5hosting/img/pacsprites.png", (img)=>{txsprite = img;});
  }
  
  function setup() {
    Engine.init({layers:4,glowdivisor:8,viewW:800,viewH:800});
    //Engine.glow[0].drawingContext.globalCompositeOperation = "lighter";
    Engine.spM.debug = true;
    gentex();
    refGrav = new GravSprite(-50,300);
    refclyde = new Clyde();
    refblinky = new Blinky(1000);
    new Blinky(1400);
    new Blinky(1800);
    new Blinky(2200);
    new Blinky(2600);
    MsgBus.sub(msgT.scored, acceptscore, null);
  }

  function gentex(){
    bluetri = getTintedCopy(Engine.txTriangle, [0,0,255]);
    cyantri = getTintedCopy(Engine.txTriangle, [0,255,255]);
    limetri = getTintedCopy(Engine.txTriangle, [0,255,0]);    
  }


  function getTintedCopy(texture, tintcolour, alpha){
    if (alpha == undefined){alpha = 1;}
    let tex = createGraphics(texture.width, texture.height);
    tex.background(tintcolour);
    tex.drawingContext.globalCompositeOperation = "destination-in";
    tex.drawingContext.globalAlpha = alpha;
    tex.image(texture,0,0);
    return tex;
}
  function acceptscore(data){
    if (data.player == "blinky")
      blinkyscore += data.score;
    else if (data.player == "clyde")
      clydescore += data.score;
  }

  /** perform general game logic and update engine */
  function logic() {
    delta = deltaTime / 1000;
    //Engine.update(0.0167);// use this to fix time whack if debugging so stepping slowly doesn't break everything
    try{
    Engine.update(delta);
    let b = 5;
    } catch (error){
      console.log(error);
    }
  }

  //do any pre-drawing before engine draws
  function draw(){
    logic();
    background(backcol);
    try{
    Engine.draw(delta);
    
    } catch (error){
      console.log(error);
    }
    postdraw();
  }

  //any additional drawing after engine work
  function postdraw(){
    push();
    fill(255,0,0,120);
    let p = refclyde.cliparea
    //rect(/*p.x,p.y,*/-100,-100,p.w,p.h);
    //noStroke();
    stroke(255,255);
    strokeWeight(10);
    //point(refGrav.x,refGrav.y);
    //text("BLINKY " + refblinky.top, 10,10);
    //text("CLYDE " + refclyde.energylevel, 10,30);
    //image(bluetri,100,100);
    //image(limetri,200,100);
    //image(cyantri,300,100);
    pop();
    document.title = frameRate();
  }
