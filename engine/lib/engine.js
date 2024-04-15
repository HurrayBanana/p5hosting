 
/******************************
 * engine.js by Hurray Banana 2023-2024
******************************/ 
/** current version number of the engine */
let engineversion = '1.23.0.1';
/** @classdesc provides global functionality for other engine components */
class Engine{
  /** set of colours primary, secondary, black and white @type {color[]} */
  static cols3bit = [
      [255,255,255],
      [255,0,0],
      [0,255,0],
      [0,0,255],
      [0,255,255],
      [255,255,0],
      [255,0,255],
      [0,0,0],
  ];
  /** length of cols3bit for modulus work @type {int} */
  static cols3bitlen = Engine.cols3bit.length;
  /** @type {bool} if true then engine version will be shown with debug output */
  static showversion = true;
  /** if true debug output will be shown @type {bool}*/
  static debug = false;
  /** colour to display debug information @type {color}*/
  static debugcolour = [255,255,255,255];
  //static debugpos;
  //static debugalign = Align.bottomLeft;
  //graphics layers here
  /** for tilemaps to be rendered before sprite layers @type {texture}*/
  static #backmap;
  /** the tilemap layer drawn before every other layer 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get backmap(){
      Engine.#backmap.operations = true;
      return Engine.#backmap;
  }
  /** after sprite 0 and 1 @type {texture}*/
  static #midmap;
  /** tilemaps to be rendered after sprite layers 0 and 1 but before layer 2 and 3 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get midmap(){Engine.#midmap.operations = true;return Engine.#midmap;}
  /** tilemaps to be rendered after all 4 sprite layers but before the hud layer
  * Can use to do fade out/in and swipes
   * be wary using with sprites as these are aligned top left
   * @type {texture}
  */
  static #frontmap;
  /** tilemaps to be rendered after all sprite layers 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get frontmap(){Engine.#frontmap.operations = true;return Engine.#frontmap;}
  /** tilemaps to be rendered after all other layers including the hud @type {texture}*/
  static #finalmap;
  /** Can use to do fade out/in and swipes which also cover the UI
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get finalmap(){Engine.#finalmap.operations = true;return Engine.#finalmap;}
  /**
   * holds each of the sprite layers these are drawn from 0 upwards,
   * the higher the layer number the later it is in the draw stack
   * use Engine.layer() to retrieve a reference to the layer when assigning to sprites, history and particles
   * You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
   * @type {texture[]}
   */
  static spl = [];
  /**
   * holds each of the sprite glow layers these are drawn from 0 upwards before their corresponding sprite layer number,
   * the higher the layer number the later it is in the draw stack.
   * glow layers are much lower resolution than the main drawing layers, which can be controlled when setting up the engine
   * with Engine.init()
   * 
   * use Engine.glowlayer() to retrieve a reference to the layer when assigning to sprites, history and particles
   * You can use this reference to also modify settings of the texture layer (taking it away from its default settings)
   * @example 
   * //the glow divisor is how many times smaller the glow layers are created. 
   * //when drawn they are blown up using bilinear filtering which gives us a cheap glow effect
   * Engine.init({glowdivisor:8,viewW:600,viewH:800,worldW:3000,worldH:2000});
   * @type {texture[]}
   */
  static glow = [];
  /** used for some testing stuff */
  static glowbuffer; //testing of persistance and fade
  /**
   * controls how many times smaller the glow layers are created. don't change this value you need to use Engine.init() to set this
   * @type {int}
   */
  static glowDiv = 8;
  /**
   * gets the hud layer (the final sprite layer) for drawing items on top of all other sprites
   * There are some tilemap layers that are drawn after this frontmap and finalmap
   */
  static get hud(){Engine.spl[Engine.spl.length-1].operations = true;return Engine.layer(Engine.spl.length-1)};
  /** reference to the sprite manager @type {Spritemanager} */
  static spM;
  /** reference to the particle manager @type {particleManager} */
  static particleM;
  /** reference to the tilemap manager @type {TilemapManager} */
  static tilemapM;
  /** holds an object value describing the width and height of the world render area 
   * object 
  */
  static #worldsize;// = vector2.zero;
  /** @returns {float} the width of the world area*/
  static get worldWidth(){return this.#worldsize.w};
  /** @returns {float} the height of the world area*/
  static get worldHeight(){return this.#worldsize.h;};
  /** @param {float} value sets the width of the world area*/
  static set worldWidth(value){this.#worldsize.w = value};
  /** @param {float} value sets the height of the world area*/
  static set worldHeight(value){this.#worldsize.h = value};
  /** 
   * @returns {Rectangle} gets a rectangle (0,0,width,height) representing the world size
   */
  static get worldarea(){return new Rectangle(0,0,this.#worldsize.w,this.#worldsize.h);}
  /** gets the world size (width and height), just access the w and h properties of the object
   * @returns {{w:int, h:int}}
   */
  static get worldsize(){return this.#worldsize;}
  /** use an object to set the size of the world
   * Engine.worldsize = {w:1000,h:1000};
   * or a vector2 value (something with w and h properties)
   * @param {vector2|{w:int, h:int}} value 
   */
  static set worldsize(value){this.worldWidth = value.w; this.worldHeight = value.h;};
  static viewWidth;
  static viewHeight;
  //static canvasArea;
  static viewports = [];
  static get mainview(){return Engine.viewports[0];}
  static get mainviewArea(){return Engine.viewports[0].area;}
  static zRange = 5000;
  static zHalf = this.zRange / 2;
  
  /**
   * @returns {vector3}
   */
  static get viewCentre(){return Engine.viewports[0].area.centre;}// Engine.viewWidth/2;}
  static get viewCentrex(){return Engine.viewports[0].area.centrex;}// Engine.viewWidth/2;}
  static get viewCentrey(){return Engine.viewports[0].area.centrey;}//Engine.viewHeight/2;}
  static get viewcount(){return Engine.viewports.length;}
  static #framecount;
  static #fps;
  static #elapsed;    
  /** initialises all the sub systems of the engine, call this from the preload function 
   * @param {{viewW:int,viewH:int,worldW:int,worldH:int,layers:int,glowdivisor:int,compositor:string}} settings all settings are optional, if none are set or nothing is passed then defaults (listed below will be used)
   * pass a settings object to change some of the defaults
   * @example     Engine.init({glowdivisor:8});
   * 
   * //settings object can have the following values
   * viewW:int //number of pixels wide the canvas/screen should be, default 600
   * viewH:int //number of pixels high the canvas/screen should be, default 600
   * worldW:int //number of pixels wide the world area should be, default 600
   * worldH:int //number of pixels high the world area should be, default 600
   * layers:int //number of layers including the HUD defaults to 5 (4 sprite layers and final HUD layer) - don't change it will break stuff - I need to generalise the renderer more first
   * glowdivisor:int //how much to shrink the glow layers by (these get scaled back up so we get a cheap blur)
   * compositor:string //the global compsition method on the glow layers, default is "lighter" @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
   * 
  */
  static init(settings){
      Engine.delta = 1/60;
      let numlayers = 5;//4 sprites and final HUD
      let glowdivisor = 8;
      let compositor = "lighter";//"screen";
      let vw = 600;
      let vh = 600;
      let ww = 600;
      let wh = 600;
      
      if (settings !== undefined){
          if (settings.layers !== undefined) numlayers = settings.layers;
          if (settings.glowdivisor !== undefined) glowdivisor = settings.glowdivisor;
          if (settings.compositor !== undefined) compositor = settings.compositor;
          if (settings.viewW !== undefined) vw = settings.viewW;
          if (settings.viewH !== undefined) vh = settings.viewH;
          ww = vw;
          wh = vh;
          if (settings.worldW !== undefined) ww = settings.worldW;
          if (settings.worldH !== undefined) wh = settings.worldH;
      }
      Engine.viewWidth = vw;
      Engine.viewHeight = vh;
      Engine.#worldsize = new vector2(ww, wh);
      Engine.glowDiv = glowdivisor;
      Engine.#createlayers(numlayers, compositor);
      Engine.#createview();
      Engine.tilemapM = new TilemapManager();
      Engine.particleM = new particleManager();
      Engine.spM = new Spritemanager(Engine.layer(Engine.spl.length-1));//hud
      Engine.eventM = new EventManager();
      Tex.createTextures();
      //this.debugpos.x = 10;
      //this.debugpos.y = vh - 10;
      Engine.#framecount = 0;
      Engine.#fps = 0;;
      Engine.#elapsed = 0;
      //Tex.waitloading();
  }
  /** do not use this it's internal only for now until I implement multiple viewports */
  static #createview(){
      //default viewport
      Engine.viewports.push(new View(new Rectangle(0,0,Engine.viewWidth, Engine.viewHeight),0,0)); //canvas area
  }
  /**retrieves a specific graphic layer for assigning to sprites and particles for drawing on and changing settings of
   * @param {int} number layer number (0-3)
   * @example 
   * //draw order is as follows:
   * backmap, glow(0),layer(0),glow(1),layer(1),midmap,glow(2),layer(2),glow(3),layer(3),frontmap,hud,finalmap
  */
  static layer(number){
      if (number >= 0 && number < Engine.spl.length){
          Engine.spl[number].operations = true;
          return Engine.spl[number];
      } else {
          Engine.spl[0].operations = true;
          return Engine.spl[0];
      }
  }
  /**retrieves a specific graphic layer for drawing on and changing settings of 
   * @param {int} number glow layer number (0-3), glow layers are drawn before their corresponding sprite layer
   * @example 
   * //draw order is as follows:
   * backmap, glow(0),layer(0),glow(1),layer(1),midmap,glow(2),layer(2),glow(3),layer(3),frontmap,hud,finalmap
  */
  static glowlayer(number){
      if (number >= 0 && number < Engine.glow.length){
          Engine.glow[number].operations = true;
          return Engine.glow[number];
      } else {
          Engine.glow[0].operations = true;
          return Engine.glow[0];
      }
  }
  
  /**retrieves the rectangle for a numbered viewport - 0 being the main canvas area 
   * @param {int} number view to retrieve (currently on 0)
   * @returns {View} the requested Viewport
  */
  static view(number){
    if (number === undefined) {
      return Engine.viewports[0];
    }
    else{
      if (number >= 0 && number < Engine.viewports.length){
          return Engine.viewports[number];
      } else 
      return Engine.viewports[0];
    }
  }
  /**
   * 
   * @returns {texture|canvas} a top left aligned canvas for tilemap rendering
   */
  static #getTilemapLayer(){
      let context = createGraphics(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
      context.noStroke();
      context.noSmooth();
      context.operations = false;
      context.pixelDensity(1);
      context.type = "t";
      return context;
  }
  /**
   * creates sprite and glow layers
   * @param {int} layercount number of sprite/particle layers and a hud
   * @param {string} compositor compositor to be used by glow layer
   */
  static #createlayers(layercount, compositor){
      let c = createCanvas(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
      c.drawingContext.alpha = false;
      window.pixelDensity(1);
      //createCanvas(Engine.viewWidth, Engine.viewHeight, WEBGL);
      //let l = createFramebuffer();
      Engine.#backmap = this.#getTilemapLayer();
      //Engine.__backmap.drawingContext.alpha = false;
      Engine.#midmap = this.#getTilemapLayer();
      Engine.#frontmap = this.#getTilemapLayer();
      Engine.#finalmap = this.#getTilemapLayer();
      Engine.spl = new Array(layercount);
      Engine.glow = new Array(layercount);
      for (let p = 0; p < layercount; p++){
          Engine.spl[p] = createGraphics(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
          Engine.spl[p].rectMode(CENTER);
          Engine.spl[p].imageMode(CENTER);
          Engine.spl[p].noStroke();
          Engine.spl[p].noSmooth();
          Engine.spl[p].operations = false;
          Engine.spl[p].wipe = true;
          Engine.spl[p].pixelDensity(1);
          Engine.spl[p].type = "s";

          //create a glow layer for each sprite layer
          Engine.glow[p] = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
          Engine.glow[p].drawingContext.globalCompositeOperation = compositor;//"screen";//compositor;
          Engine.glow[p].noStroke();
          Engine.glow[p].rectMode(CENTER);
          Engine.glow[p].imageMode(CENTER);
          Engine.glow[p].operations = false;
          Engine.glow[p].wipe = true;
          Engine.glow[p].pixelDensity(1);
          Engine.glow[p].scale(1/Engine.glowDiv);//sets scale for layer
          Engine.glow[p].type = "g";
      }
      //testing
      Engine.glowbuffer = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
      Engine.glowbuffer.drawingContext.globalCompositeOperation = "screen";
      Engine.glowbuffer.noStroke();
      Engine.glowbuffer.operations = false;
      Engine.glowbuffer.pixelDensity(1);
      Engine.glowbuffer.scale(1/Engine.glowDiv);
  }
  /** @type {float} holds the fraction of a second the current frame has taken
   * use this to get movement in pixels per second
   * @example
   * this.vx = 100 * Engine.delta; //move at 100 pixels over a second
  */
  static delta;
  static update(delta){
      Engine.delta = delta;
      Engine.#framecount++;
      Engine.#elapsed += delta;
      if (Engine.#elapsed >= 1){
          Engine.#elapsed -= 1;
          Engine.#fps = Engine.#framecount;
          Engine.#framecount = 0;
      }
      Engine.eventM.update();
      Engine.tilemapM.update();
      Engine.spM.update();
      Engine.particleM.update();
  }
  static #activelayers = "";
  static c = false;
  /**draws the various engine rendering sub systems */
  static draw(){
      //let tilelayers = "tilelayers ";
      //let spritelayers = " spritelayers ";
      //let glowlayers = " glowlayers ";
      Engine.tilemapM.draw();//delta);
      Engine.spM.draw();//delta);
      Engine.particleM.draw();//delta);
      //let w = -width/2;
      //let h = -height/2;
      //compositor
      if (this.#backmap.operations) {
          //image(Engine.__backmap, w, h);
          image(Engine.#backmap,0,0);
          this.#backmap.clear();
          //tilelayers += "[back]";
      }
      let p = 0;
      for (; p < 2; p++){
          if (Engine.glow[p].operations){
              image(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
              if (Engine.glow[p].wipe) Engine.glow[p].clear();
              //omage(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
              //Engine.glowbuffer.globalCompositeOperation = "difference";
              //Engine.glowbuffer.globalalpha = 0.5;
              //Engine.glowbuffer.image(Engine.glow[p],-25, -25, Engine.viewWidth+50, Engine.viewHeight+50);
              //Engine.glowbuffer.image(Engine.glow[p],0, 0, Engine.viewWidth+, Engine.viewHeight);
              //Engine.glow[p].clear();
              //write buffer
              //image(Engine.glowbuffer,0, 0, Engine.viewWidth, Engine.viewHeight);
              //if (Engine.c ) Engine.glow[p].clear();
              Engine.c = !Engine.c;
              //trying a self filter effect instead of clearing
              //Engine.glow[p].image(Engine.glow[p],//0,0,
                //  400,400, 810, 810);
                  //Engine.viewWidth*0.49/* -Engine.viewWidth*0.05*/, Engine.viewHeight*0.49/*-Engine.viewHeight*0.05*/, 
                  //Engine.viewWidth*1.1, Engine.viewHeight*1.1);
              //glowlayers += "[" + p + "]" ;
          }
          if (Engine.spl[p].operations){
              //image(Engine.spl[p], w, h);
              image(Engine.spl[p],0,0);
              //clear once drawn
              if (Engine.spl[p].wipe) Engine.spl[p].clear();
              //spritelayers += "[" + p + "]" ;
          }
      }
      if (this.#midmap.operations) {
          //image(Engine.__midmap, w, h);
          image(Engine.#midmap,0,0);
          this.#midmap.clear();
          //tilelayers += "[mid]";
      }
      for (; p < 4; p++){
          if (Engine.glow[p].operations){
              //image(Engine.glow[p], w, h, Engine.viewWidth, Engine.viewHeight);
              image(Engine.glow[p],0, 0, Engine.viewWidth, Engine.viewHeight);
              if (Engine.glow[p].wipe) Engine.glow[p].clear();
              //glowlayers += "[" + p + "]" ;
          }
          if (Engine.spl[p].operations){
              //image(Engine.spl[p], w, h);
              image(Engine.spl[p],0,0);
              //clear once drawn
              if (Engine.spl[p].wipe) Engine.spl[p].clear();
              //spritelayers += "[" + p + "]" ;
          }
      }
      if (this.#frontmap.operations) {
          //image(Engine.__frontmap, w, h);
          image(Engine.#frontmap,0,0);
          this.#frontmap.clear();
          //tilelayers += "[front]";
      }
      if (Engine.showversion) {Engine.version();}
      //draw hud
      if (Engine.spl[p].operations){
          //image(Engine.spl[p], w, h);
          image(Engine.spl[p],0,0);
          //clear once drawn
          if (Engine.spl[p].wipe) Engine.spl[p].clear();
          //spritelayers += "[hud]" ;
      }
      if (this.#finalmap.operations) {
          //image(Engine.__finalmap, w, h);
          image(Engine.#finalmap,0,0);
          this.#finalmap.clear();
          //tilelayers += "[final]";
      }
      if (Engine.debug){Engine.#debugout();}
      //Engine.#activelayers = tilelayers + " " + spritelayers + " " + glowlayers;
  }
  static #debugout(){
      let dm = []
      dm.push(this.particleM.debugdisplay);
      dm.push(this.spM.debugdisplay);
      let m = "view[" + (Engine.mainview.x|0) + "," + (Engine.mainview.y|0) + "]";
      m += " world[" + Engine.worldWidth + "," + Engine.worldHeight + "]";
      m += " viewrect[" + Engine.mainview.worldarea.l + "," + Engine.mainview.worldarea.t + "," + Engine.mainview.worldarea.r + "," + Engine.mainview.worldarea.b + "]";
      dm.push(m);
      dm.push(Engine.#activelayers)
      dm.push("fps[" + Engine.#fps + "]");
      dm.push(engineversion);
      window.push();
      window.textAlign(LEFT, BOTTOM);
      window.fill(Engine.debugcolour);
      window.noStroke();
      let dy = 0;
      dm.forEach(mess => {
          window.text(mess,10, Engine.mainview.area.h + dy );
          dy -= 20;
      });
      window.pop();
  }
  static version(){
      Engine.spl[3].push();
      Engine.spl[3].fill(255);
      Engine.spl[3].noStroke();
      Engine.spl[3].text(engineversion, 10,Engine.spl[3].height - 10);
      
      //Engine.spl[3].text(engineversion, 10,Engine.spl[3].height - 10);
      Engine.spl[3].pop();
  }
  /**internal support for executing callback routines (there are currently 4 differenet ones in Sprite alone) */
  static processCallback(handler, data){
      if (handler !== undefined && handler !== null) {return handler.callback.call(handler.instance, data);}    
  }
  /**
   * Generates a callback handler object to pass to a callback system
   * @param {function} handler 
   * @param {object} instance 
   * @returns {{callback:method|function, instance:object|null}}
   */
  static makeCallback(handler, instance){
      return {callback:handler, instance:instance};
  }
  /** performs a rip of a tilesheet, used by Tilemap.tilesfromTilesheet()
   * grabs a rectangluar sequence rawtiles from a texture, if wanting this for a tilemap use this.tilesfromTilesheet() inside your constructor instead
   * @param {Tile[]} tohere array of Tiles to add these rips to 
   * @param {image|texture} texture  image that contains the tiles we want
   * @param {{w:32,h:32}} tilesize width and height of each tile (have to be the same size)
   * @param {{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}} data explained in comments below
   * @example 
   * //takes 30 tiles from txtiles and places them into the mytiles array
   * //the tiles consist of 3 rows and 10 columns with a 2 pixel gap between each row and column
   * //each tiles is 32x32 pixels the rectangular sequence starts 10 pixels from left and 5 pixels from top corner of sprite sheet
   * Engine.riptiles(mytiles, txtiles, {w:32,h:32}, {rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2});
  */
  static riptiles(tohere, texture, tilesize, data){
      if (data === undefined){data = {};}
      if (data.rowstall === undefined) {data.rowstall = Math.floor(texture.height / tilesize.h);}
      if (data.colswide === undefined) {data.colswide = Math.floor(texture.width / tilesize.w);}
      if (data.left === undefined) {data.left = 0;}
      if (data.top === undefined) {data.top = 0;}
      if (data.xpad === undefined) {data.xpad = 0;}
      if (data.ypad === undefined) {data.ypad = 0;}
      for (let r = 0; r < data.rowstall; r++){
          for (let c = 0; c < data.colswide; c++){
              let t = new Tile(texture, new Rectangle(data.left + c * (tilesize.w + data.xpad), data.top + r * (tilesize.h + data.ypad), tilesize.w, tilesize.h));
              tohere.push(t);
          }
      }
  }
    /** performs a rip of a spritesheet to a format suitable for sprite animation frames, used by Sprite.frame.defineSpritesheet()
   * grabs a rectangluar sequence rawtiles from a texture
   * @param {Rawtile[]} tohere array of frames to add these rips to, use sprite.frame.defineSpritesheet() if you are doing this for a sprite
   * @param {image|texture} texture image that contains the frames we want
   * @param {{w:32,h:32}} tilesize width and height of each frame (have to be the same size)
   * @param {{rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2}} data explained in comments below
   * @example 
   * //takes 8 frames txsprite and adds them to the frames already defined for the sprite
   * //the frames consist of 1 row and 8 columns with a 2 pixel gap between each row and column
   * //each tiles is 32x32 pixels the rectangular sequence starts 2 pixels from left and 213 pixels from top corner of sprite sheet
   * this.frame.defineSpritesheet(txsprite, {w:32,h:32}, {rowstall:1,colswide:8,left:2,top:213,xpad:2,ypad:2});
  */
  static ripRawtiles(tohere, texture, tilesize, data){
      if (data === undefined){data = {};}
      if (data.rowstall === undefined) {data.rowstall = Math.floor(texture.height / tilesize.h);}
      if (data.colswide === undefined) {data.colswide = Math.floor(texture.width / tilesize.w);}
      if (data.left === undefined) {data.left = 0;}
      if (data.top === undefined) {data.top = 0;}
      if (data.xpad === undefined) {data.xpad = 0;}
      if (data.ypad === undefined) {data.ypad = 0;}
      for (let r = 0; r < data.rowstall; r++){
          for (let c = 0; c < data.colswide; c++){
              let t = new Rawtile(texture, new Rectangle(data.left + c * (tilesize.w + data.xpad), data.top + r * (tilesize.h + data.ypad), tilesize.w, tilesize.h));
              tohere.push(t);
          }
      }
  }    
}