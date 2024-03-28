 
/******************************
 * engine.js by Hurray Banana 2023-2024
******************************/ 
/** current version number of the engine */
let engineversion = '1.22.2.3';
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
  static __backmap;
  /** the tilemap layer drawn before every other layer 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get backmap(){
      Engine.__backmap.operations = true;
      return Engine.__backmap;
  }
  /** after sprite 0 and 1 @type {texture}*/
  static __midmap;
  /** tilemaps to be rendered after sprite layers 0 and 1 but before layer 2 and 3 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get midmap(){Engine.__midmap.operations = true;return Engine.__midmap;}
  /** tilemaps to be rendered after all 4 sprite layers but before the hud layer
  * Can use to do fade out/in and swipes
   * be wary using with sprites as these are aligned top left
   * @type {texture}
  */
  static __frontmap;
  /** tilemaps to be rendered after all sprite layers 
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get frontmap(){Engine.__frontmap.operations = true;return Engine.__frontmap;}
  /** tilemaps to be rendered after all other layers including the hud @type {texture}*/
  static __finalmap;
  /** Can use to do fade out/in and swipes which also cover the UI
   * be wary using with sprites as these are aligned top left
   * @returns {texture}
  */
  static get finalmap(){Engine.__finalmap.operations = true;return Engine.__finalmap;}
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
  static __framecount;
  static __fps;
  static __elapsed;    
  /** initialises all the sub systems of the engine, call this from the preload function 
   * 
   * pass a settings object to change some of the defaults
   * @example     Engine.init({glowdivisor:8});
   * 
  */
  static init(settings){
      let numlayers = 5;//4 sprites and final HUD
      let glowdivisor = 8;
      let compositor = "lighter";
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
      Engine.createlayers(numlayers, compositor);
      Engine.createview();
      Engine.tilemapM = new TilemapManager();
      Engine.particleM = new particleManager();
      Engine.spM = new Spritemanager(Engine.layer(Engine.spl.length-1));//hud
      Engine.eventM = new EventManager();
      Tex.createTextures();
      //this.debugpos.x = 10;
      //this.debugpos.y = vh - 10;
      Engine.__framecount = 0;
      Engine.__fps = 0;;
      Engine.__elapsed = 0;
      //Tex.waitloading();
  }
  /** do not use this it's internal only for now until I implement multiple viewports */
  static createview(){
      //default viewport
      Engine.viewports.push(new View(new Rectangle(0,0,Engine.viewWidth, Engine.viewHeight),0,0)); //canvas area
  }
  /**retrieves a specific graphic layer for drawing on and changing settings of */
  static layer(number){
      if (number >= 0 && number < Engine.spl.length){
          Engine.spl[number].operations = true;
          return Engine.spl[number];
      } else {
          Engine.spl[0].operations = true;
          return Engine.spl[0];
      }
  }
  /**retrieves a specific graphic layer for drawing on and changing settings of */
  static glowlayer(number){
      if (number >= 0 && number < Engine.glow.length){
          Engine.glow[number].operations = true;
          return Engine.glow[number];
      } else {
          Engine.glow[0].operations = true;
          return Engine.glow[0];
      }
  }
  
  /**retrieves the rectangle for a numbered viewport - 0 being the main canvas area */
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
  static #getTilemapLayer(){
      let context = createGraphics(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
      context.noStroke();
      context.noSmooth();
      context.operations = false;
      context.pixelDensity(1);
      return context;
  }
  static createlayers(layercount, compositor){
      let c = createCanvas(Engine.viewWidth, Engine.viewHeight);//, WEBGL);
      c.drawingContext.alpha = false;
      window.pixelDensity(1);
      //createCanvas(Engine.viewWidth, Engine.viewHeight, WEBGL);
      //let l = createFramebuffer();
      Engine.__backmap = this.#getTilemapLayer();
      //Engine.__backmap.drawingContext.alpha = false;
      Engine.__midmap = this.#getTilemapLayer();
      Engine.__frontmap = this.#getTilemapLayer();
      Engine.__finalmap = this.#getTilemapLayer();
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
          //create a glow layer for each sprite layer
          Engine.glow[p] = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
          Engine.glow[p].drawingContext.globalCompositeOperation = "screen";//compositor;
          Engine.glow[p].noStroke();
          Engine.glow[p].rectMode(CENTER);
          Engine.glow[p].imageMode(CENTER);
          Engine.glow[p].operations = false;
          Engine.glow[p].wipe = true;
          Engine.glow[p].pixelDensity(1);
          Engine.glow[p].scale(1/Engine.glowDiv);//sets scale for layer
      }
      Engine.glowbuffer = createGraphics(Engine.viewWidth/Engine.glowDiv,Engine.viewHeight/Engine.glowDiv);
      Engine.glowbuffer.drawingContext.globalCompositeOperation = "screen";
      Engine.glowbuffer.noStroke();
      Engine.glowbuffer.operations = false;
      Engine.glowbuffer.pixelDensity(1);
      Engine.glowbuffer.scale(1/Engine.glowDiv);
  }
  /* updates the various engine sub systems call this once a frame */
  static delta;
  static update(delta){
      Engine.delta = delta;
      Engine.__framecount++;
      Engine.__elapsed += delta;
      if (Engine.__elapsed >= 1){
          Engine.__elapsed -= 1;
          Engine.__fps = Engine.__framecount;
          Engine.__framecount = 0;
      }
      Engine.eventM.update();
      Engine.tilemapM.update(/*delta*/);
      Engine.spM.update(/*delta*/);
      Engine.particleM.update(/*delta*/);
  }//createlayers
  static #activelayers = "";
  static c = false;
  /**draws the various engine rendering sub systems */
  static draw(/*delta*/){
      //let tilelayers = "tilelayers ";
      //let spritelayers = " spritelayers ";
      //let glowlayers = " glowlayers ";
      Engine.tilemapM.draw();//delta);
      Engine.spM.draw();//delta);
      Engine.particleM.draw();//delta);
      //let w = -width/2;
      //let h = -height/2;
      //compositor
      if (this.__backmap.operations) {
          //image(Engine.__backmap, w, h);
          image(Engine.__backmap,0,0);
          this.__backmap.clear();
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
      if (this.__midmap.operations) {
          //image(Engine.__midmap, w, h);
          image(Engine.__midmap,0,0);
          this.__midmap.clear();
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
      if (this.__frontmap.operations) {
          //image(Engine.__frontmap, w, h);
          image(Engine.__frontmap,0,0);
          this.__frontmap.clear();
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
      if (this.__finalmap.operations) {
          //image(Engine.__finalmap, w, h);
          image(Engine.__finalmap,0,0);
          this.__finalmap.clear();
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
      dm.push("fps[" + Engine.__fps + "]");
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
   * @returns
   */
  static makeCallback(handler, instance){
      return {callback:handler, instance:instance};
  }
  /** performs a rip of a tilesheet 
   * grabs a rectangluar sequence rawtiles from a texture
   * 
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
  /** performs a rip of a spritesheet 
   * grabs a rectangluar sequence rawtiles from a texture
   * 
   * @example 
   * //takes 30 tiles from txtiles and places them into the mytiles array
   * //the tiles consist of 3 rows and 10 columns with a 2 pixel gap between each row and column
   * //each tiles is 32x32 pixels the rectangular sequence starts 10 pixels from left and 5 pixels from top corner of sprite sheet
   * Engine.riptiles(mytiles, txtiles, {w:32,h:32}, {rowstall:3,colswide:10,left:10,top:5,xpad:2,ypad:2});
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