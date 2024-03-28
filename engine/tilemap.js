/******************************
 * tilemap.js by Hurray Banana 2023-2024
 ******************************/ 
class TilemapManager{
    #tilemaps;
    constructor(){
        this.#tilemaps = [];
    }
    add(tilemap){
        this.#tilemaps.push(tilemap);
    }
    update(){
        //TilemapManager.delta = delta;
        for (let p = 0; p < this.#tilemaps.length; p++){
            this.#tilemaps[p].update();
        }
        this.#bringoutthedead();        
    }
    draw(){
        for (let p = 0; p < this.#tilemaps.length; p++){
            this.#tilemaps[p].draw();
            //MsgBus.send(mymess.uimessage, {txt:this.#tilemaps[p].debugdisplay, x:10,y:150});
        }
    }
    #bringoutthedead(){
        let p = this.#tilemaps.length - 1;
        while (p >= 0){//} && p < this.#spritelist.length){
            if (this.#tilemaps[p].remove){
                this.#tilemaps[p].cleanup();
                this.#tilemaps.splice(p,1);
            } 
            p--;
        }
    }
    get debugdisplay(){
        return null;
    }
}
class Rawtile{
    tex;
    port;
    constructor(texture, portion){
        this.tex = texture;
        if (portion === undefined){
            portion = new Rectangle(0,0,texture.width, texture.height);
        }
        this.port = portion;
    }    
}
/** defines a single tile in a tilemap */
class Tile extends Rawtile{
    /** holds height of tile at left and right edges */
    hmap = null;
    vmap = null;
    get isflat(){return this.hmap[0] == this.hmap[this.port.w - 1];}
    get isSlope(){return !(this.hmap[0] == this.hmap[this.port.w - 1]);}
    
    /** gets the height of the tile from it's bottom edge based on the offset given
     * use when walking/running or falling
    */
    distancebottom(x){
        return this.port.h - this.hmap[x];
    }
    /** gets distance of tile from its top edge*/
    distancetop(x){
        return this.hmap[x];
    }
    /** gets distance from left edge of tile */
    distanceleft(y){
        return this.vmap[y];
    }
    distanceright(y){
        return this.port.w - this.vmap[y];
    }
    /** specifies the distance offset of the tile edges from the top of the tile
     * 
     */
    setHorizontalmap(l, r){
        if (r !== undefined){
            this.hmap = new Int32Array(this.port.w);
            let diff = (r - l) / this.port.w;
            for (let p = 0; p < this.hmap.length; p++){
                this.hmap[p] = Math.round(l + diff * p);
            }
        } else {
            this.hmap = new Int32Array(l.length);
            for (let p = 0; p < this.hmap.length; p++){
                this.hmap[p] = l[p];
            }
        }
    }
    setVerticalmap(t, b){
        if (b !== undefined){
            this.vmap = new Int32Array(this.port.h);
            let diff = (b - t) / this.port.h;
            for (let p = 0; p < this.hmap.length; p++){
                this.hmap[p] = Math.round(t + diff * p);
            }        
        } else {
            this.vmap = new Int32Array(t.length);
            for (let p = 0; p < this.hmap.length; p++){
                this.vmap[p] = t[p];
            }
        }    
    }
    constructor(texture, portion, hmap, vmap){
        super(texture, portion);
        if (hmap === undefined || hmap == null) {
            this.setHorizontalmap(0,0);//full tile
        } else {
            this.setHorizontalmap(hmap);
        }
        if (vmap === undefined || vmap == null) {
            this.setHorizontalmap(0,0);//full tile from left
        } else {
            this.setHorizontalmap(vmap);
        }
        

    }
    cleanup(){
        this.tex = null;
    }
}

class TileDirection{
    /** direction left */
    static LEFT = 0x1;
    /** direction up */
    static UP = 0x2;
    /** direction right */
    static RIGHT = 0x4;
    /** direction down */
    static DOWN = 0x8;
    /** no direction */
    static NONE = 0b0;
    static ALL_ORDINALS = [TileDirection.LEFT, TileDirection.RIGHT, TileDirection.UP, TileDirection.DOWN];
    static VERTICALS = [TileDirection.UP, TileDirection.DOWN];
    static HORIZONTALS = [TileDirection.LEFT, TileDirection.RIGHT];    
    static str = ["none","left","up",,"right",,,,"down"];
    static asStr(direction){
        return TileDirection.str[direction];
    }
    static strlist(di){
        let out = "";
        for (let p = 0; p < di.length; p++){
            out += TileDirection.asStr(di[p]) + ":";
        }
        return out;
    }
}
/** 
 * overaly methods for tile map
 */
class TilemapOverlay{
    static GRAPHIC = "graphic";
    static COLLISION = "collision";
    static COORDS = "coords";
    static ROW_COL = "row_col";
    static NONE = null;
}
/**  */
class Tilemap{
    static EMPTY = -1;
    
    remove = false;
    wrapx = false;
    wrapy = false;
    visible = true;
    view;
    clipview = false;
    scrollmultiplier = {x:1,y:1};
    /** holds an overlay method, default to TilemapOveraly.NONE
     * //only use for testing and debugging, resource heavy
     * @example
     *  //put row and column info on top of tile map
     *  this.overlay = TilemapOverlay.ROW_COL
     * 
     */
    overlay = TilemapOverlay.NONE;
    overlayCol = [255,255,255];
    /** if true locations outside the tile map are wrapped to opposite side
     * when performing collision checks
     */
    wrapTileInterrogation = true;

    constructor(){//tilesize){
        this.#tiles = [];
        this.textures = null;
        //default view, replace with something other than full viewport
        this.view = Engine.mainview;
        //if (tilesize !== undefined){
        //    this.#tilesize = tilesize;
        //} else {this.#tilesize = {w:32,h:32};}
        this.layer = Engine.backmap;
    }
    /**
     * @param {boolean} value
     */
    set wrap(value){this.wrapx = value;this.wrapy = value;}
    get wrap(){return this.wrapx && this.wrapy;}
    /** 2d arrayof offscreen textures for this tilemap */
    textures = null;
    //for now make maxtex a multiple of tilewidth and tileheight ??
    /**maximum size of offscreen textures - may make this configurable */
    #maxtex = 256;//512;//195;//256;//24 ;//1024;
    /**number of offscreen textures used horizontally */
    
    /** holds width and height of offscreen texture array
     * formally #txwide and #txhigh
    */
    #txdims = {w:0,h:0};
    //#txwide;
    /**nuber of offscreen textures used vertically */
    //#txhigh;
    /** holds the width and height of off screen textures*/
    #txSize =  {w:0,h:0};
    /** holds the scaled size of a texture used during rendering */
    #txSizeScaled = {w:0,h:0};
    /**holds the number of columns and rows per off screen texture*/
    #txcolsrows =  {w:0,h:0};

    #lastwide;
    #lasthigh;
    #lastdrawn; //debugging output
    get debugdisplay(){return "textures draw w:" + this.#lastdrawn.w + " h" + this.#lastdrawn.h;}
    //holds the visible width of the off screen textures
    #texturesFullWide;
    //holds the visible height of the off screen textures
    #texturesFullHigh;
    /** if true will limit generated location values to valid tile locations
     * if false you will need to verify valid location using validLocation
    */
    clamplocation = true;
    alpha = 1;
    alphamap = null;
    colourmap = null;
    collisionmap = null;
    /** scale to draw tilemap  defaults to size tiles defined*/
    #scale = vector2.one;
    #screenarea = Rectangle.zero;
    /** gets the render position of the tilemap*/
    get renderArea(){
        return this.#screenarea;
    }
    /**gets the scale for the tilemap w,h */
    get scale(){return this.#scale;}
    /** sets the scale for the tilemap w,h */
    set scale(value){
        this.#scale.w = value.w;
        this.#scale.h = value.h;
        
        this.#visibletilesize.w = this.#tilesize.w * this.#scale.w;
        this.#visibletilesize.h = this.#tilesize.h * this.#scale.h;
        this.#area.w = this.#visibletilesize.w * this.cols;//this.#tilesize.w * this.#scale.w * this.cols;
        this.#area.h = this.#visibletilesize.h * this.rows;//this.#tilesize.h * this.#scale.h * this.rows;
        this.#txSizeScaled.w = this.#txSize.w * value.w;
        this.#txSizeScaled.h = this.#txSize.h * value.h;

        this.#screenarea.w = this.#area.w;
        this.#screenarea.h = this.#area.h;
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;

        //this.#area.w = this.#tilesize.w * this.#scale.w * this.cols;
        //this.#area.h = this.#tilesize.h * this.#scale.h * this.rows;
    }
    get sw(){return this.#scale.w;}
    get sh(){return this.#scale.h;}
    set sw(value){
        this.#scale.w = value;
        this.#visibletilesize.w = this.#tilesize.w * this.#scale.w;
        this.#area.w = this.#visibletilesize.w * this.cols;//this.#tilesize.w * this.#scale.w * this.cols;
        this.#txSizeScaled.w = this.#txSize.w * value;
        this.#screenarea.w = this.#area.w;
    }
    set sh(value){
        this.#scale.h = value;
        this.#visibletilesize.h = this.#tilesize.h * this.#scale.h;
        this.#area.h = this.#visibletilesize.h * this.rows;//this.#tilesize.h * this.#scale.h * this.rows;
        this.#txSizeScaled.h = this.#txSize.h * value;
        this.#screenarea.h = this.#area.h;
    }
    #map = null;
    get map(){return this.#map;}
    /** set a graphic tile at a specific location in the map, make sure the tile number is valid and the location
     * @param {{x:int,y:int}} loc the x and y tile location to set
     * @param {{w:int,h:int}} size of region to set, tiles wide and high from the given location, can be ommited for a single tile
    */
    setMapGraphic(loc,tile, size){
        if (size === undefined){
            this.#map[loc.y][loc.x] = tile;
            this.#setgraphictilenew(loc, tile);
            //this.#setgraphictile(loc, tile);
        } else {
            let tx; let ty;
            for (let r = 0; r < size.h; r++){
                for (let c = 0; c < size.w; c++){
                    this.#map[ty = loc.y + r][tx = loc.x + c] = tile;
                    this.#setgraphictilenew({x:tx,y:ty}, tile);
                    //this.#setgraphictile({x:tx,y:ty}, tile);
                }
            }
        }
    }
    /**
     * applies an xor mask to a tile number in the graphic map (to setup toggles)
     * @param {{x:int,y:int}} loc the x and y tile location to xor
     * @param {int} xormask 
     * @param {{w:int,h:int}} size of region to xor, tiles wide and high from the given location, can be ommited for a single tile
     */
    xorMapGraphic(loc, xormask, size){
        if (size === undefined){
            this.#map[loc.y][loc.x] ^= xormask;
            this.#setgraphictilenew(loc, this.#map[loc.y][loc.x]);
        } else {
            let tx; let ty;
            for (let r = 0; r < size.h; r++){
                for (let c = 0; c < size.w; c++){
                    this.#map[ty = loc.y + r][tx = loc.x + c] ^= xormask;
                    this.#setgraphictilenew({x:tx,y:ty}, this.#map[ty = loc.y + r][tx = loc.x + c]);
                }
            }
        }        
    }
    /** removes tiles from the tile map at the given location (will make tile reference -1 - no tile/transparent)
     * if a size is specified a rectangular region is cleared {w:4,h:5} from that location
     * @param {{x:int,y:int}} loc the x and y tile location to clear
     * @param {{w:int,h:int}} size of region to clear, tiles wide and high from the given location, can be ommited for a single tile
     */
    clrMapGraphic(loc, size){
        if (size === undefined){
            this.#map[loc.y][loc.x] = -1;
            this.#clrGtilenew(this.#tiletoTXnew(loc));
            //this.#clrGtile(this.#tiletoTX(loc));
        } else {
            let tx; let ty;
            for (let r = 0; r < size.h; r++){
                for (let c = 0; c < size.w; c++){
                    //tx = loc.x + c; ty = loc.y + r;
                    this.#map[ty = loc.y + r][tx = loc.x + c] = -1;
                    this.#clrGtilenew(this.#tiletoTXnew({x:tx,y:ty}));
                    //this.#clrGtile(this.#tiletoTX({x:tx,y:ty}));
                }
            }
        }
    }
    /** holds raw area of the tilemap */
    #rawarea = Rectangle.one;
    /** holds scaled area of the tilemap */
    #area = Rectangle.one;
    get area(){return this.#area;}
    set area(value){
        this.#area = value;
        this.#releaseTextures();
        this.#setTexturesNew();
    }
    #tilesize = vector2.one;
    get tilesize(){return this.#tilesize;}
    set tilesize(value){
        this.#tilesize.x = value.w;
        this.#tilesize.y = value.h;
        this.#visibletilesize.w = this.#tilesize.w * this.#scale.w;
        this.#visibletilesize.h = this.#tilesize.h * this.#scale.h;
        this.#area.w = this.#tilesize.w * this.#scale.w * this.cols;
        this.#area.h = this.#tilesize.h * this.#scale.h * this.rows;
        this.#screenarea.w = this.#area.w;
        this.#screenarea.h = this.#area.h;
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;
    }
    #visibletilesize = vector2.one;
    get visibletilesize(){return this.#visibletilesize; } 
    #position = vector2.zero;
    get position(){return this.#position;}
    /** sets the position of the tilemap as a vector 2 value
     * if wrapx is true the x position will be wrapped within the area of the tilemap
     * if wrapy is true the y position will be wrapped within the area of the tilemap
     */
    set position(value){
        this.#position = value;
        if (this.wrapx){
            if (value.x < 0) {this.#position.x = this.area.w - (-value.x) % this.area.w;}
            else if (value.x > this.area.w){ this.#position.x = value.x % this.#area.w;}
        }
        if (this.wrapy){
            if (value.y < 0) {this.#position.y = this.area.h - (-value.y) % this.area.h;}
            else if (value.y > this.area.h){ this.#position.y = value.y % this.#area.h;}
        }
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;
    }
    /** sets the tilemap poisition so its hirizontal centre is at this position
     * @param {float} value
     */
    set centrex(value){this.#position.x = value - this.#area.w /2;
        this.#screenarea.x = this.#position.x;}
    /** sets the tilemap poisition so its vertical centre is at this position
     * @param {float} value
     */
    set centrey(value){this.#position.y = value - this.#area.h /2;
        this.#screenarea.y = this.#position.y;}
    
    get x(){return this.#position.x;}
    get y(){return this.#position.y;}
    /** sets the position of the tilemap as a vector 2 value
     * if wrapx is true the x position will be wrapped within the area of the tilemap
     */
    set x(value){
        this.#position.x = value;
        if (false){//this.wrapx){
            if (value< 0) {this.#position.x = this.area.w - (-value) % this.area.w;}
            else if (value > this.area.w){ this.#position.x = value % this.#area.w;}
        }
        this.#screenarea.x = this.#position.x;
    }
    /** sets the x position of the tilemap
     * if wrapy is true the y position will be wrapped within the area of the tilemap
     */
    set y(value){
        this.#position.y = value;
        if (this.wrapy){
            if (value < 0) {this.#position.y = this.#area.h - (-value) % this.#area.h;}
            else if (value > this.area.h){ this.#position.y = value % this.#area.h;}
        }
        this.#screenarea.y = this.#position.y;
    }
    rows = 0;
    cols = 0;
    #tiles = null;
    /** gets the tiles for the tilemap, do not add items directly */
    get tiles(){return this.#tiles;}
    tileindex = null;
    //specify a colour value to have the tilemap show edges of tiles
    gridlines = null;


    layer = null;
    /** if true then tilemap ignores any view movement */
    world = false;
    wipesystem = null;
    /** clears tiles from tilemap , row by row or column by column
     * @param {float} time  time is the total time for wipe to occur
     * @param {SlideMethod} wipedirection is a SlideMethod dissapear/appear treated the samed
    */
    wipe(time, wipedirection){
        let gap;
        switch (wipedirection){
            case SlideMethod.upAppear:case SlideMethod.upDissapear:
            case SlideMethod.downAppear:case SlideMethod.downDissapear:
                gap = time / this.rows;
                this.wipesystem = {ti:new Timer(),col:0,row:0,di:{c:0,r:1}};
                this.wipesystem.ti.interval(gap);
                if (wipedirection == SlideMethod.upAppear || wipedirection == SlideMethod.upDissapear){
                    this.wipesystem.row = this.rows - 1;
                    this.wipesystem.di.r = -1;
                }
                break;
            case SlideMethod.leftAppear:case SlideMethod.leftDissapear:
            case SlideMethod.rightAppear:case SlideMethod.rightDissapear:
                gap = time / this.cols;
                this.wipesystem = {ti:new Timer(),col:0,row:0,di:{c:1,r:0}};
                this.wipesystem.ti.interval(gap);
                if (wipedirection == SlideMethod.rightAppear || wipedirection == SlideMethod.rightDissapear){
                    this.wipesystem.col = this.cols - 1;
                    this.wipesystem.di.c = -1;
                }
                break;
                    
        }
    }
    #dowipe(/*delta*/){
        this.wipesystem.ti.update(/*delta*/);
        if (this.wipesystem.ti.elapsedReset){
            const w = this.wipesystem;
            //horizontal wipe
            if (w.di.r != 0){
                this.clrMapGraphic({x:w.col,y:w.row},{w:this.cols,h:1});
                w.row += w.di.r;
                if (w.row == this.rows || w.row == -1){
                  w.ti.cleanup();
                  w.ti = null;
                  this.wipesystem = null;
                }
            } else {//vertical wipes
                this.clrMapGraphic({x:w.col,y:w.row},{w:1,h:this.rows});
                w.col += w.di.c;
                if (w.col == this.cols || w.col == -1){
                  w.ti.cleanup();
                  w.ti = null;
                  this.wipesystem = null;
                }
            }
        }
    }
    cleanup(){
        this.alphamap = null;
        this.colourmap = null;
        this.collisionmap = null;
        this.layer = null;
        this.#map = null;
        this.area = null;
        this.#tilesize = null;
        this.position = null;
        this.#tiles=null;   
        this.#releaseTextures();
    }
    #releaseTextures() {
        for (let r = 0; r < this.#txdims.h/*this.#txhigh*/; r++){
            for (let c = 0; c < this.#txdims.w/*this.#txwide*/; c++){
                this.textures[r][c].tx.remove();
                this.textures[r][c].tx = null;
                this.textures[r][c] = null;
            }
        }
    }



    #biggestfactor(a, into){
        while (into % a != 0){
            a--;
        }
        return a;
    }

    //builds textures but makes size a multiple of base tilewidth ignoring mip mapping
    //possibilities in the future which is iok for tilemaps in general
    #setTexturesNew(){
        this.#txcolsrows.w = this.#biggestfactor(((this.#maxtex / this.#tilesize.w) | 0), this.cols);
        this.#txcolsrows.h = this.#biggestfactor(((this.#maxtex / this.#tilesize.h) | 0), this.rows);

        this.#txSize.w = this.#tilesize.w * this.#txcolsrows.w;
        this.#txSize.h = this.#tilesize.h * this.#txcolsrows.h;
        this.#txSizeScaled.w = this.#txSize.w;
        this.#txSizeScaled.h = this.#txSize.h;

        this.#txdims.w = this.cols / this.#txcolsrows.w; 
        this.#txdims.h = this.rows / this.#txcolsrows.h; 

        //this.#txwide = this.cols / this.#txcolsrows.w;//(this.cols * this.#tilesize.w ) / this.#txSize.w;
        //this.#txhigh = this.rows / this.#txcolsrows.h;//(this.rows * this.#tilesize.h ) / this.#txSize.h;
        
        this.textures = new Array(this.#txdims.h);//this.#txhigh);
        for (let p = 0; p < this.textures.length; p++){
            this.textures[p] = new Array(this.#txdims.w);//this.#txwide);
        }

        for (let r = 0; r < this.#txdims.h/*this.#txhigh*/; r++){
            for (let c = 0; c < this.#txdims.w/*this.#txwide*/; c++){
                this.textures[r][c] = {tx:this.#makeTexture(this.#txSize.w, this.#txSize.h),
                    w:this.#txSize.w,
                    h:this.#txSize.h
                };
            }
        }
        this.#drawlocalnew();
        let a = 6;
    }

    //new version
    #drawlocalnew(){
        if (this.#map != null){
            let rd;
            let tilenum;
            const w = this.#tilesize.w;
            const h =  this.#tilesize.h;
            for (let r = 0; r < this.rows; r++){
                for (let c = 0; c < this.cols; c++){
                    //check for no tile
                    if ((tilenum = this.#map[r][c]) != Tilemap.EMPTY){
                        let fr = this.#tiles[tilenum];
                        rd = this.#tiletoTXnew({x:c,y:r});
                        this.#setGtilenew(rd, fr);
                    }
                }
            }
        }        
    }
    #clrGtilenew(rd){
        const w = this.#tilesize.w;
        const h = this.#tilesize.h;
        rd.tx.push();
        rd.tx.fill(255,0,0,255);
        rd.tx.noStroke();
        rd.tx.drawingContext.globalCompositeOperation = "destination-out";
        rd.tx.rect(rd.x*w, rd.y*h, w, h);
        rd.tx.pop();
    }
    #setGtilenew(rd, fr){
        const w = this.#tilesize.w;
        const h = this.#tilesize.h;
        const x = rd.x * w;
        const y = rd.y * h;
        rd.tx.push();
        rd.tx.fill(255,0,0,255);
        rd.tx.noStroke();
        rd.tx.drawingContext.globalCompositeOperation = "destination-out";
        rd.tx.rect(x, y, w, h);
        rd.tx.pop();
        rd.tx.image(fr.tex, x, y, w, h,
            fr.port.x, fr.port.y, w, h);
    }
    //doesn't need to worry about partial laps, way way simpler
    #tiletoTXnew(loc){
        let rx = loc.x % this.#txcolsrows.w;
        let ry = loc.y % this.#txcolsrows.h;
        let tc = (loc.x / this.#txcolsrows.w) | 0;
        let tr = (loc.y / this.#txcolsrows.h) | 0;
        //x, y are top left corner to draw to in the texture
        return {tx:this.textures[tr][tc].tx,x:rx, y:ry};
    }
    // builds required number of textures for tilemap area
    //#setTextures(){
    //    this.#setTexturesNew();
    //    return;
    //    this.#txwide = Math.floor((this.#tilesize.w * this.cols) / this.#maxtex ) + 1;
    //    this.#txhigh = Math.floor((this.#tilesize.h * this.rows) / this.#maxtex ) + 1;
    //    //this.#txwide = Math.floor(this.#area.width / this.#maxtex ) + 1;
    //    //this.#txhigh = Math.floor(this.#area.height / this.#maxtex ) + 1;
    //    this.textures = new Array(this.#txhigh);
    //    for (let p = 0; p < this.textures.length; p++){
    //        this.textures[p] = new Array(this.#txwide);
    //    }
//
    //    this.#lastwide = (this.#tilesize.w * this.cols) - this.#maxtex * (this.#txwide - 1);
    //    this.#lasthigh = (this.#tilesize.h * this.rows) - this.#maxtex * (this.#txhigh - 1);
    //    this.#texturesFullWide = 0;
    //    this.#texturesFullHigh = 0;
    //    //this.#lastwide = this.#area.width - this.#maxtex * (this.#txwide - 1);
    //    //this.#lasthigh = this.#area.height - this.#maxtex * (this.#txhigh - 1);
    //    let txhigh;
    //    let txwide;
    //    for (let r = 0; r < this.#txhigh; r++){
    //        txhigh = (r == (this.#txhigh - 1)) ? roundtoPowerof2(this.#lasthigh) : this.#maxtex;
    //        for (let c = 0; c < this.#txwide; c++){
    //            txwide = (c == (this.#txwide - 1)) ? roundtoPowerof2(this.#lastwide) : this.#maxtex;
    //            this.textures[r][c] = {tx:this.#makeTexture(txwide, txhigh),
    //                w:(c == (this.#txwide - 1)) ? this.#lastwide : this.#maxtex,
    //                h:(r == (this.#txhigh - 1)) ? this.#lasthigh : this.#maxtex
    //            };
    //            this.#texturesFullWide += this.textures[r][c].w;
    //            this.#texturesFullHigh += this.textures[r][c].h;
    //        }
    //    }
    //    this.drawlocal();
    //}
    //need to validate loc before (check for clamp/wrap reject stupid stuff)
    //#setgraphictile(loc, tile){
    //    let rd;
    //    if (tile == Tilemap.EMPTY){
    //        //clear region ???
    //        rd = this.#tiletoTX(loc);
    //        this.#clrGtile(rd)
    //    } else {
    //        let fr = this.#tiles[tile];
    //        rd = this.#tiletoTX(loc);
    //        this.#setGtile(rd, fr)
    //    }
    //}
    #setgraphictilenew(loc, tile){
        let rd;
        if (tile == Tilemap.EMPTY){
            //clear region ???
            rd = this.#tiletoTXnew(loc);
            this.#clrGtilenew(rd)
        } else {
            let fr = this.#tiles[tile];
            rd = this.#tiletoTXnew(loc);
            this.#setGtilenew(rd, fr)
        }
    }

    //#clrGtile(rd){
    //    for (let p = 0; p < rd.length; p++){
    //        const r = rd[p];
    //        r.tx.push();
    //        r.tx.fill(255,0,0,255);
    //        r.tx.noStroke();
    //        r.tx.drawingContext.globalCompositeOperation = "destination-out";
    //        r.tx.rect(r.x, r.y, r.rw, r.rh);
    //        r.tx.pop();
    //        //r.tx.image(fr.tex, r.x, r.y, r.rw, r.rh,
    //        //    fr.port.x + r.px, fr.port.y + r.py, r.rw, r.rh//r.pw, r.ph
    //        //    );
    //    }
//
    //}
    //#setGtile(rd, fr){
    //    for (let p = 0; p < rd.length; p++){
    //        const r = rd[p];
    //        r.tx.push();
    //        r.tx.fill(255,0,0,255);
    //        r.tx.noStroke();
    //        r.tx.drawingContext.globalCompositeOperation = "destination-out";
    //        r.tx.rect(r.x, r.y, r.rw, r.rh);
    //        r.tx.pop();
    //        r.tx.image(fr.tex, r.x, r.y, r.rw, r.rh,
    //            fr.port.x + r.px, fr.port.y + r.py, r.rw, r.rh//r.pw, r.ph
    //            );
    //    }
//
    //}
    ////draw tilemap to local textures
    //drawlocal(){
    //    let rd;
    //    let tilenum;
    //    if (this.#map != null){
    //        const w = this.#tilesize.w;
    //        const h =  this.#tilesize.h;
    //        for (let r = 0; r < this.#map.length; r++){
    //            for (let c = 0; c < this.#map[0].length; c++){
    //                //check for no tile
    //                if ((tilenum = this.#map[r][c]) != Tilemap.EMPTY){
    //                    let fr = this.#tiles[tilenum];
    //                    rd = this.#tiletoTX({x:c,y:r});
    //                    this.#setGtile(rd, fr);
    //                }
    //            }
    //        }
    //    }
    //}
    /** returns an object referencing the active texture and offset tile location for the global render,
     * this may contain several elements if across multiple textures 
     * christ this all got complicated really quickly this might not be a good option*/
    #tiletoTX(loc){
        let rightoverflow = false;
        let ref  = [];
        let rx = loc.x * this.#tilesize.w;
        let ry = loc.y * this.#tilesize.h;
        let tc = Math.floor(rx / this.#maxtex);
        let tr = Math.floor(ry / this.#maxtex);
        let renderw;
        let renderh;
        rx -= this.#maxtex * tc;
        renderw = (rx + this.#tilesize.w > this.#maxtex) ? this.#maxtex - rx : this.#tilesize.w;
        ry -= this.#maxtex * tr;
        renderh = (ry + this.#tilesize.h > this.#maxtex) ? this.#maxtex - ry : this.#tilesize.h;
        //x, y are top left corner to draw to in the texture, rw, wh are width and height to draw
        // px, py are start offsets to apply to texture portion
        let tldata = {tx:this.textures[tr][tc].tx,x:rx, y:ry, rw:renderw,rh:renderh, px:0, py: 0};
        ref.push(tldata);
        //flow over to next texture across
        if (renderw < this.#tilesize.w) {
            ref.push({tx:this.textures[tr][tc+1].tx,x:0, y:ry, rw:this.#tilesize.w - renderw,rh:renderh, px:renderw , py:0});
            rightoverflow = true;
        }
        //check down and right
        if (renderh < this.#tilesize.h){
            ref.push({tx:this.textures[tr+1][tc].tx,x:rx, y:0, rw:renderw,rh:this.#tilesize.h-renderh, px:0, py:renderh});
            if (rightoverflow){
                ref.push({tx:this.textures[tr+1][tc+1].tx,x:0, y:0, rw:this.#tilesize.w - renderw,rh:this.#tilesize.h-renderh, px:renderw , py:renderh});
            }
        }
        return ref;
    }

    #makeTexture(w, h){
        let t = createGraphics(w, h);
        t.pixelDensity(1);
        t.clear();
        return t;
    }

    /**
     * Takes a tilemap and returns an image texture with transparency where no tile exists or the the given
     * 
     * @param {{region:Rectangle,transparentTile:int,scalex:int,scaley:int}} settings to control the size and data set for the generated graphic image
     * 
     * {Rectangle} region the start column (x) and start row (y) of the tilemap section to generate an image from
     * number of columns to examine (width) and number of rows to examine (height)
     * 
     * {int} transparentTile the tile number to be considered transparent (if ommitted 0 and -1 is assumed) 
     * note -1 is always considered transparent
     * 
     * {int} scalex number of pixels horizontally each tile should represent
     * 
     * {int} scaley number of pixels vertically each tile should represent
     * 
     */
    #tilemapToMonoImage(settings){//transparentTile, scale, region){
        //to come

    }
    /**
     * Attempts to centre the tilemap within the world area
     */
    centreInworld(){
        this.centrehere(Engine.worldarea);
    }
    /**
     * Attempts to centre the tilemap within the main view area
     */
    centreInmainview(){
        this.centrehere(Engine.mainviewArea);
    }
    /** centre's the tilemap in it's default view (if more than one) */
    centreinmyview(){
        this.centrehere(this.view.area);
    }
    //needs to take account of world coords - does it
    /** centres the tilemap around the rectangle given */
    centrehere(rect){
        this.#position.x = rect.w/2 - this.area.w/2;
        this.#position.y = rect.h/2 - this.area.h/2;
        this.#screenarea.x = this.#position.x;
        this.#screenarea.y = this.#position.y;
    }
    #verifymap = false;
    /**
     * if set to true then the map will be verified to ensure index match with tiles defined
     * set this before you attempt to either use setmap or before loading a map from a file
     * @returns {bool}
     */
    get verifymap() {return this.#verifymap;}
    set verifymap(value){this.#verifymap = value;}
    /**
     * 
     * @param {int[][]} map 2d array of tile indexes that represent tiles from the tileset, set tiles before specifiying the map. If an index is in the map you'll get texture and width errors during rendering. Run this.verifymap() to ensure you don't have this problem
     * @param {*} scale 
     */
    setmap(map, scale){
        if (map !== undefined){
            this.#map = map;
            this.rows = map.length;
            this.cols = map[0].length;
            if (this.verifymap) {this.#verifymaptiles()}
            this.area = new Rectangle(0, 0, this.cols * this.#tilesize.w * this.#scale.w, this.rows * this.#tilesize.h * this.#scale.h);
            this.sw = (scale === undefined) ? 1 : scale.w;
            this.sh = (scale === undefined) ? 1 : scale.h;
    
            //this.area = new Rectangle(0, 0, this.cols * this.#tilesize.w * this.#scale.w, this.rows * this.#tilesize.h * this.#scale.h);
        } else { console.log("Tilemap.setmap(no map defined");}
    }
    /** will process a sprite/tilesheet looking for define a list of tiles 
     * 
     * you must specify tilesize in object format {w:32,h:32}
     *     
     * If the tiles/sprites do not fill the texture then make sure you say 
     * how many rows and columns exist, if they are not specified as many whole (based on texture and tilesize) 
     * rows and columns found in the texturewill be converted
     * 
     * if the tiles/sprites have a gap/padding between them specify that using xpad and ypad (if not set they will be assumed to be 0 (no gaps between))
     * 
     * specify control data using an anonymous class @example {rowstall:0,colswide:0,xpad:0,ypad:0}
     * @param {image | texture} texture the texture containing your tiles
     * @param {{w:int,h:int}} tilesize an object with w and h properties containing the widht and height of the tiles (they are all the same)
     * @param {{rowstall:int,colswide:int,left:int,top:int,xpad:int,ypad:int}} data an object containing various properties
     * rowstall: how many rows of tiles to rip fro the texture
     * colswide: how many columns to rip
     * left: the left and edge to start reading pixel data from the texture
     * top: the top edge to start reading pixel data from the texture (left and top provide the top left hand corner fo the block of graphics)
     * xpad: how far apart horizontally are each tile columns in the texture
     * ypad: how far apart vertically are each of the tile rows in the texture
    */
    tilesFromTexture(texture, tilesize, data){
        Engine.riptiles(this.#tiles, texture, tilesize, data);
        this.#tilesize.x = tilesize.w;
        this.#tilesize.y = tilesize.h;
    }
    /** will process a sprite/tilesheet looking for define a list of tiles 
     * 
     * you must specify tilesize in object format {w:32,h:32}
     *     
     * If the tiles/sprites do not fill the texture then make sure you say 
     * how many rows and columns exist, if they are not specified as many whole (based on texture and tilesize) 
     * rows and columns found in the texturewill be converted
     * 
     * if the tiles/sprites have a gap/padding between them specify that using xpad and ypad (if not set they will be assumed to be 0 (no gaps between))
     * 
     * specify control data using an anonymous class @example {rowstall:0,colswide:0,xpad:0,ypad:0}
     * @param {image | texture} texture the texture containing your tiles
     * @param {{w:int,h:int}} tilesize an object with w and h properties containing the widht and height of the tiles (they are all the same)
     * @param {{rowstall:int,colswide:int,left:int,top:int,xpad:int,ypad:int}} data an object containing various properties
     * rowstall: how many rows of tiles to rip fro the texture
     * colswide: how many columns to rip
     * left: the left and edge to start reading pixel data from the texture
     * top: the top edge to start reading pixel data from the texture (left and top provide the top left hand corner fo the block of graphics)
     * xpad: how far apart horizontally are each tile columns in the texture
     * ypad: how far apart vertically are each of the tile rows in the texture
    */
    tilesfromTilesheet(texture, tilesize, data){
        Engine.riptiles(this.#tiles, texture, tilesize, data);
        this.#tilesize.x = tilesize.w;
        this.#tilesize.y = tilesize.h;
    }    
    /** clone a an existing tileset (making these tiles unique
     * @param {*} tileset 
    */
    tilesCloneFromTileset(tileset){
        for (let p = 0; p < tileset.length; p++){
            const t = tileset[p];
            let n = new Tile(t.tex, t.port.clone, t.hmap, t.vmap);
            this.#tiles.push(n);
        }
    }
    /** takes a complete texture/image and breaks int tiles building a tilemap 
    * to reference all the rectangluar regions, you must either set an area and tilesize if this is the first texture you are placing
    * @param {image | texture} texture 
    * @param {vector2} position: position to start tiling the texture too (if it goes out of the map then it will error)
    * @param {object{area:{w,h},tilesize:{w:h}}} areadata if specified then the area is based on these dimensions, if not then te texture is tiled at the position given
    * make sure the area can accomodate all the textures you wish to tile
   * @param {vector2} tilesize:vector2 width and height must be a factor of the texture width and height
   * @example
   *     this.tileTexture(txback00, {x:0,y:864}, {area:{w:12000,h:1536},tilesize:{w:16,h:16}});
   *     this.tileTexture(txback2000, {x:2000,y:864});
   *     this.tileTexture(txback4000, {x:4000,y:864});
   *     this.tileTexture(txback6000, {x:6000,y:432});
   *     this.tileTexture(txback8000, {x:8000,y:0});
   *     this.tileTexture(txback10000, {x:10000,y:0});
    * */
    tileTexture(texture, position, areadata){
        ///  NEED TO RE-THINK NEED TO GENERATE TEXTURES MANUALLY DON'T LET SETTING THE AREA DO IT
        if (areadata !== undefined){
            this.#createMap(areadata.area, areadata.tilesize);
            this.#area = new Rectangle(0, 0, this.cols * this.#tilesize.w * this.#scale.w, this.rows * this.#tilesize.h * this.#scale.h);
        }
        if (this.map == null) {console.log("no map defined in tileTexture, if this is the first texture set an area and tilesize");return;}
        //build the tile list, get what will be first tilenumber for filling the tilemap in in a minute
        let tilenum = this.#tiles.length;
        let cols = (texture.width / this.#tilesize.w) | 0;
        let rows = (texture.height / this.#tilesize.h) | 0;

        let data = {colswide:cols,rowstall:rows,left:0,top:0,xpad:0,ypad:0};
        Engine.riptiles(this.#tiles, texture, this.#tilesize, data);

        //build texture to tilemap (not worrying about duplicate tiles - if i do this in the future i'll need a custom ripper to fill map at same time)
        let loc = {x:position.x / this.#tilesize.w,y:position.y / this.#tilesize.h};
      
        let x = loc.x;
        for (let r = 0; r < rows; r++){
            for (let c = 0; c < cols; c++){
                this.#map[loc.y][x++] = tilenum++;
            }
            x = loc.x;
            loc.y++;
        }
        this.#releaseTextures();
        this.#setTexturesNew();//this.#setTextures();
    }
    
    /** builds an empty tilemap full of -1 tiles make sure tilesize is a factor of area */
    #createMap(area, tilesize){
        this.rows = (area.h / tilesize.h) | 0;
        this.cols = (area.w / tilesize.w) | 0;
        this.#tilesize.x = tilesize.w;
        this.#tilesize.y = tilesize.h;
        this.#map = new Array(this.rows);
        for (let r = 0; r < this.rows; r++) {
            this.#map[r] = new Array(this.cols);
            for (let c = 0; c < this.cols; c++){
                this.#map[r][c] = -1;
            }
        }
    }


    /** adds an existing tileset references to this tilemaps tiles */
    tilesAddFromTileset(tileset){
        for (let p = 0; p < tileset.length; p++){
            this.#tiles.push(tileset[p]);
        }
    }
    /** adds a single tile to the tile list 
     * @param {Image | texture} tex the texture that contains the image for the tile
     * @param {Rectangle} port the portion of the texture to use for the tile (ensure its the same width/height as other tiles). If ommitted then entire texture used be careful
    */
    tileadd(tex, port){
        if (tex === undefined) {
            console.log("texture undefined in tileadd");
        }
        port = (port === undefined) ? new Rectangle(0,0,tex.width, tex.height):port;
        this.#tiles.push(new Tile(tex, port));
        this.#tilesize.x = port.w;
        this.#tilesize.y = port.h;        
    }
    #create(texture, area, scale, autotile){

    }
    /** creates a tilemap ready to accomodate tiled textures, make sure the tilesize is a factor of the textures you will tile */
    defineArea(area, tilesize){
        this.#create(null, area, scale, false);
        this.area = area;
        this.#scale.w = scale.w;
        this.#scale.h = scale.h;
    }
    /** takes an entire image/texture and splits into tiles, calculating and defining only unquie tiles
     * not implmented yet
     */
    #definefromTexture(texture, tilesize, autotile){
        this.#create(texture, {w:texture.width,h:texture.height}, tilesize, autotile);
    }


    update(/*delta*/){
        if (this.wipesystem != null){this.#dowipe(/*delta*/);}
    }
        //wrapping test code
    //made complicated because of partial last texture rendering
    //going to not worry about mip maps and simplifying the off screen render to tile factored
    draw(){
        if (this.visible){
            /**viewport width */
            let vw = this.view.w;
            /**viewport height */
            let vh = this.view.h;
            /**number of offscreen textures that would fill view area */
            let vtw = 2 + (vw / this.#txSizeScaled.w) | 0; //precalc??
            let vth = 2 + (vh / this.#txSizeScaled.h) | 0; //precalc??
            //let vtw = 2 + (vw / sw) | 0; //precalc
            let sx = (this.world ? this.x - this.view.x * this.scrollmultiplier.x : this.x) | 0;
            let sy = (this.world ? this.y - this.view.y * this.scrollmultiplier.y : this.y) | 0;
            //if wrapping then I need to mod by texture area
            //calculate renderwidth and renderheight
            let diffw = vw - sx;
            let diffh = vh - sy;
            let rw = (0.9 + diffw / this.#txSizeScaled.w)|0;
            let rh = (0.9 + diffh / this.#txSizeScaled.h)|0;
            let extratiles;
            /** off screen texture column to start rendering from */
            let stc = 0;
            if (!this.wrapx) {
                //crop renderwidth
                rw = rw > this.#txdims.w? this.#txdims.w : rw;
                if (sx < 0){
                    let reducetiles = (-sx/this.#txSizeScaled.w)|0;
                    reducetiles = reducetiles > this.#txdims.w ? this.#txdims.w : reducetiles;
                    rw -= reducetiles;
                    stc += reducetiles;
                    sx += reducetiles * this.#txSizeScaled.w;
                }
            } else { //wrapping checks
                if (sx > 0){ //away from left edge
                    extratiles = 1 + (sx/this.#txSizeScaled.w)|0;
                    sx -= extratiles * this.#txSizeScaled.w;
                    rw += extratiles;
                    stc = this.#txdims.w - extratiles % this.#txdims.w;
                } 
                //crop number of off screen textures to limit of view area + 2 either side
                rw = vtw > rw ? vtw : rw;
            }

            /** off screen texture row to start rendering from */
            let str = 0;
            if (!this.wrapy) {
                //crop renderheight
                rh = rh > this.#txdims.h? this.#txdims.h : rh;
                if (sy < 0){
                    let reducetiles = (-sy/this.#txSizeScaled.h)|0;
                    reducetiles = reducetiles > this.#txdims.h ? this.#txdims.h : reducetiles;
                    rh -= reducetiles;
                    str += reducetiles;
                    sy += reducetiles * this.#txSizeScaled.h;
                }
            } else { //wrapping checks
                if (sy > 0){ //away from top edge
                    extratiles = 1 + (sy/this.#txSizeScaled.h)|0;
                    sy -= extratiles * this.#txSizeScaled.h;
                    rh += extratiles;
                    str = this.#txdims.h - extratiles % this.#txdims.h;
                } 
                //crop number of off screen textures to limit of view area + 2 either top or bottom
                rh = vth > rh ? vth : rh;
            }

            //MsgBus.send(mymess.uimessage,{txt:"s:" + sx + "," + sy + "  diff:" + diffw +","+diffh+ " render:" + rw + "," + rh + " textures ",x: 50,y: 50});
            //MsgBus.send(mymess.uimessage,{txt:"sy:" + sy + "  str:" + str + " rh:" + rh + " extra:" + extratiles,x: 50,y: 50});
            //nothing to render check could be done before row calculations
            if (rw <= 0) return;
            if (rh <= 0) return;
            //}
            //let y = sy;//could just use sy
            //let tr = str;//could just use str

            //crop test
            this.layer.clip(() => {
                const r = this.view.area;
                //this.layer.drawingContext.rect(r.x,r.y,r.w,r.h);
                this.layer.rect(r.x,r.y,r.w,r.h);
            });
            //let can = this.layer.getContext("2d");
            this.layer.push();
            this.layer.drawingContext.globalAlpha = this.alpha;
            //preserve start y and start row for overlay renders
            let tr = str;
            let y = sy;
            for (let r = 0; r < rh; r++){
                if (tr == this.#txdims.h) tr = 0;
                let tc = stc;
                let x = sx;
                for (let c = 0; c < rw; c++){
                    if (tc == this.#txdims.w) tc = 0;
                    //this.layer.drawingContext.drawImage(this.textures[str][tc++].tx, x, sy, this.#txSizeScaled.w, this.#txSizeScaled.h);
                    this.layer.image(this.textures[tr][tc++].tx, x, y, this.#txSizeScaled.w, this.#txSizeScaled.h);
                    x +=  this.#txSizeScaled.w;
                }
                y +=  this.#txSizeScaled.h;
                tr++;
            }

            // this is really slow
            if (this.overlay != TilemapOverlay.NONE){this.#drawover();}
            this.layer.pop();
        }
    }

    #drawover(){
        this.layer.fill(this.overlayCol);
        let x = this.x + this.visibletilesize.w/2 - 4;
        let y = this.y + this.visibletilesize.h/2 + 4;
        switch (this.overlay){
            case TilemapOverlay.COLLISION:
                if (this.collisionmap != null){
                    for (let r = 0; r < this.rows; r++){
                        for (let c = 0; c < this.cols; c++){
                        this.layer.text(this.collisionmap[r][c], x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                        }
                    }
                } break;
            case TilemapOverlay.GRAPHIC:
                if (this.collisionmap != null){
                    for (let r = 0; r < this.rows; r++){
                        for (let c = 0; c < this.cols; c++){
                        this.layer.text(this.#map[r][c], x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
                        }
                    }
                } break;
    
    //        case TilemapOverlay.ROW_COL:
    //            if (this.collisionmap != null){
    //                for (let r = 0; r < this.rows; r++){
    //                    for (let c = 0; c < this.cols; c++){
    //                    this.layer.text(c + ":" + r x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
    //                    }
    //                }
    //            } break;
    //        case TilemapOverlay.COORDS:
    //            if (this.collisionmap != null){
    //                for (let r = 0; r < this.rows; r++){
    //                    for (let c = 0; c < this.cols; c++){
    //                    this.layer.text(x + c * this.visibletilesize.w + ":" + y + r * this.visibletilesize.h, x + c * this.visibletilesize.w , y + r * this.visibletilesize.h);
    //                    }
    //                }
    //            } break;
            } 
    }

    /** uses a string map file that contains the information on map size and tile map values
    * size is determined automatically by the width of data and number of lines in map.
    * 
    * first string is a string containing the tile positions for the characters.
    * eg if the first string contained "abcd" this would convert
    * subsequent tile values from a to 0, b to 1, c to 2, and d to tile 3
    * any other character turned into a null tile -1
    * 
    * second string in file contains the width and height of the tiles in tilemap
    * 
    * @example 
    * ;file start - lines starting with ; are ignored
    * ;a - is border
    * ;b - is a breakable wall character
    * ;c - is player start position
    * ;x - ignored so empty tile is placed at this location
    * abcdefg
    * ;tile width 16 and 20 high
    * 16,20
    * aaaaaaa
    * axxbxxa
    * axxcxxa
    * axxbxxa
    * aaaaaaa
    * 
    * would create a tile map 5 rows and 7 columns, tile size 16 pixles wide and 20 pixels high with 7 different tiles
    * a border of tile 0 with tile 1 in a line down the centre, null tiles everywhere else
    *
    * <param name="filename">filename containing the map</param>
    * <returns>true if read correctly</returns>
    * <remarks></remarks>
    * */
    async loadmapFromStringfile(filename, callback, debug)
    {
        let loaded;
        //console.log(filename);
        const myRequest = new Request(filename);
        fetch(myRequest)
          .then((response) => response.text())
          .then((text) => {
            //loaded = text;
            if (debug) console.log(text);
            this.#processStringfile(text,callback);
          });
    }
    async loadmapFromCSVfile(filename, callback, debug)
    {
        let loaded;
        //console.log(filename);
        const myRequest = new Request(filename);
        try{
            fetch(myRequest)
              .then((response) => response.text())
              .then((text) => {
                //loaded = text;
                if (debug) console.log(text);
                this.#processCSVfile(text, callback);
              });
        } catch(e){
            console.log(e);
        }
    }
    #processStringfile(line, callback){
        let lines = line.split(/\r?\n|\r|\n/g);
        let scale;
        let mapdata= [];
        //skip all white space before processing
        for (let p = 0; p < lines.length; p++){
            let a = lines[p].trim().length;
            let b = lines[p][0] ;
            //if (mapdata[p].trim().length == 0 || mapdata[p][0] == ';'){
            if (!(a == 0 || b == ';')){
                mapdata.push(lines[p]);
            }
        }
        //grab tilelist and scale info
        this.tileindex = mapdata[0].slice(5);
        let dims =  mapdata[1].slice(5).split(',');
        scale={w:parseFloat(dims[0]),h:parseFloat(dims[1])};
        //process map layout data find widest row
        let width = 0;
        for (let p = 2; p < mapdata.length; p++){
            width = (mapdata[p].length > width) ? mapdata[p].length : width;
        }
        mapdata.splice(0,2);
        let map = new Array(mapdata.length);
        let c = 0;
        for (let r = 0; r < mapdata.length; r++){
            map[r] = new Array(width);
            const row = mapdata[r];
            for (let c = 0; c < width; c++){
                map[r][c] = (c < row.length) ? this.tileindex.indexOf(row[c]) : 0;
            }
        }
        this.setmap(map, scale);
        Engine.processCallback(callback);
    }
    #processCSVfile(line, callback){
        let lines = line.split(/\r?\n|\r|\n/g);
        let scale;
        let mapdata= [];
        //skip all white space before processing
        for (let p = 0; p < lines.length; p++){
            let a = lines[p].trim().length;
            let b = lines[p][0] ;
            //if (mapdata[p].trim().length == 0 || mapdata[p][0] == ';'){
            if (!(a == 0 || b == ';')){
                mapdata.push(lines[p]);
            }
        }

        let dims =  mapdata[0].slice(5).split(',');
        scale = {w:parseFloat(dims[0]),h:parseFloat(dims[1])};
        mapdata.splice(0,1);//2);        
        let map = new Array(mapdata.length);
        let widest = 0;
        for (let p = 0; p < mapdata.length; p++){
            const row = mapdata[p].split(',');
            widest = (row.length > widest) ? row.length : widest;
        }
        //width = isNaN(width) ? widest : width;

        let c = 0;
        for (let r = 0; r < mapdata.length; r++){
            map[r] = new Array(widest);
            map[r].fill(-1);
            const row = mapdata[r].split(',');
            let usewidth = (row.length < widest) ? row.length : widest;
            let n = 0;
            for (let c = 0; c < usewidth; c++){
                map[r][c] = parseInt(row[c]);
            }
        }
        this.setmap(map, scale);
        Engine.processCallback(callback);
    }
    async writeasCSV(filename){
        try{
        const handle = await window.showSaveFilePicker({suggestedName:filename});
        // create a FileSystemWritableFileStream to write to
        const writableStream = await handle.createWritable();
        let b = this.CSV;
        await writableStream.write(b);
        await writableStream.close();
        } catch(error){
            console.log(error.name, error.message);
        }
    }
    get CSV(){
        let lines = "";
        lines = ";maximum width";
        lines += "\nmaxw:" + this.cols;
        lines += "\n;tile dimensions";
        lines += "\nsize:" + this.#scale.w + "," + this.#scale.h;
        lines += "\n;map tile data";
        for (let r = 0; r < this.rows;r++){
            let s = "";
            for (let c = 0; c < this.cols; c++){
                if (c != 0) s += ",";
                s += this.#map[r][c].toString().padStart(3,"0");
            }
            lines += "\n" + s;
        }
        return lines;
    }
    showtiles(x, y, cols, rows, size, index, here){
        if (this.#tiles.length > 0){
            here = (here === undefined) ? window : here;
            //yes
            let t = 0;
            let r = 0;
            let c = 0; 
            let active = true;
            push();
            textAlign(CENTER, CENTER);
            fill(255);
            stroke(0);
            strokeWeight(2);
            while (t < this.#tiles.length && active){
                let fr = this.#tiles[t];
                here.image(fr.tex,
                    x + c * (size.w+size.padx), y + r * (size.h+size.pady), size.w, size.h,
                    fr.port.x, fr.port.y, fr.port.w, fr.port.h
                );
                if (index){
                    let tout = t + ((this.tileindex != null && t < this.tileindex.length) ? " [" + this.tileindex[t] + "] ":"");
                    here.text(tout,x + c * (size.w +size.padx) + size.w/2, y + r * (size.h+size.pady) + size.h/2);
                }
                t++;
                c++;
                if (c == cols){
                    c = 0; r++;
                    if (r == rows) { active = false;}
                }
            }
            pop();
        }
    }
    /** creates a set of sprites that can be clicked by user */
    showClickabletiles(x, y, cols, rows, size, here){
        if (this.#tiles.length > 0){
            here = (here === undefined) ? window : here;
            //yes
            let t = 0;
            let r = 0;
            let c = 0; 
            let active = true;
            let scale = size.w / this.#tilesize.w;
            while (t < this.#tiles.length && active){
                let fr = this.#tiles[t];
                new spriteTile(x + c * (size.w+size.padx), y + r * (size.h+size.pady), fr, t, here, scale);
                t++;
                c++;
                if (c == cols){
                    c = 0; r++;
                    if (r == rows) { active = false;}
                }
            }
        }
    }
    //positional methods
    /** takes a sprite and tile position setting the sprite at the centre of the tile location
     * @example this.mymap.setActorcentre(this, {x:10,y:11});
     * @param {Sprite*} actor 
     * @param {{x:int,y:int}} loc 
    */
    setActorcentre(actor, loc){
        return actor.centre = this.pixelcentre(loc);
    }
    /** takes a sprite and tile position setting the sprite horizontally at the centre of the tile location
     * @example this.mymap.setActorcentre(this, {x:10,y:11});
     * @param {Sprite*} actor 
     * @param {{x:int,y:int}} loc 
    */
    setActorcentreX(actor, loc){
        return actor.centrex = this.pixelcentre(loc).x;
    }
    /** takes a sprite and tile position setting the sprite vertically at the centre of the tile location
     * @example this.mymap.setActorcentre(this, {x:10,y:11});
     * @param {Sprite*} actor 
     * @param {{x:int,y:int}} loc 
    */
    setActorcentreY(actor, loc){
        return actor.centrey = this.pixelcentre(loc).y;
    }
    /** takes a pixel position and a tile location returns the distance from the top of the tile surface
     * loc is a tile location to interrogate
     * x can be a {x,y} object (vector2, vector3 or a annonymous object)
     * if pos is an x value then y is the y position
     * used by surface sensor techniques (for slopes and irregular tiles)
    */
    distanceFromtop(loc, x, y){
        let t = this.tilefromMap(loc);
        //this might need translating to tilesize stuff first
        let xoff = (x - (this.#position.x + this.#visibletilesize.w * loc.x)) | 0;//left edge offset
        let yoff = (y - (this.#position.y + this.#visibletilesize.h * loc.y)) | 0;//top edge offset
        //attempt refactoring for inverse scale
        xoff /= this.#scale.w;
        yoff /= this.#scale.h;
        //let xoff = (x - (this.position.x + this.#tilesize.w * loc.x)) | 0;//left edge offset
        //let yoff = (y - (this.position.y + this.#tilesize.h * loc.y)) | 0;//top edge offset
        let dd = t.distancetop(xoff);
        return dd - yoff;
    }
    /** returns the graphic tile from the main map at the given location 
     * if not valid location -1 is returned
    */
    tilefromMap(loc){
        if (this.wrapTileInterrogation){
            if (loc.x < 0) loc.x += this.cols;
            else if (loc.x >= this.cols) loc.x -= this.cols;
            if (loc.y < 0) loc.y += this.rows;
            else if (loc.y >= this.rows) loc.y -= this.rows
        }        
        if (this.validLocation(loc)){
            return this.#tiles[this.#map[loc.y][loc.x]];
        } else {return -1;}
    }
    /** returns the tile from the graphic map a tile distance away from given location*/
    tilefromMapOffset(loc, direction, distance){
        return this.tilefromMap(this.locationOffset(loc, direction, distance));
    }
    /** returns a tile number from the graphic tilemap 
    */
    tileNumfromMap(loc){
        if (this.wrapTileInterrogation){
            if (loc.x < 0) loc.x += this.cols;
            else if (loc.x >= this.cols) loc.x -= this.cols;
            if (loc.y < 0) loc.y += this.rows;
            else if (loc.y >= this.rows) loc.y -= this.rows
        }        
        if (this.validLocation(loc)){
            return this.#map[loc.y][loc.x];
        } else {return -1;}
    }
    /** gets the tile number from the graphic map a tile distance away from given location */
    tileNumfromMapoffset(loc, direction, distance){
        return this.tileNumfromMap(this.locationOffset(loc, direction, distance));
    }
    /** returns a collision tile number from the collisionmap 
     * @param {{x:int,y:int}} loc 
    */
    tileNumfromCollisionMap(loc){
        if (this.wrapTileInterrogation){
            if (loc.x < 0) loc.x += this.cols;
            else if (loc.x >= this.cols) loc.x -= this.cols;
            if (loc.y < 0) loc.y += this.rows;
            else if (loc.y >= this.rows) loc.y -= this.rows
        }
        if (this.validLocation(loc)){
            return this.collisionmap[loc.y][loc.x];
        } else {return -1;}
    }
    /** returns a collision tile number from the collisionmap a tile distance away from given location 
     * @param {{x:int,y:int}} loc 
     * @param {TileDirection} direction 
     * @param {int} distance 
    */
    tileNumfromCollisionMapoffset(loc, direction, distance){
        return this.tileNumfromCollisionMap(this.locationOffset(loc, direction, distance));
    }
    /** returns true if sprite is withing the tolerance distance of the center of given tile */
    actorAtcentre(actor, loc, tolerance){
        if (tolerance === undefined) {tolerance = 0;} else {tolerance = tolerance * tolerance;}
        return vector2.distanceSQ(actor.position, this.pixelcentre(loc)) < tolerance;
    }
    /** takes an array of tile locations and outputs an array of vector3 world locations 
     * points array must be in x y object form
     * @example [{x:4,y:4},{x:5,y:4}];
    */
    routeTovector3(points){
        let route = new Array(points.length);
        for (let p = 0; p < points.length; p++){
            route.push(this.pixelcentre(points[p]));
        }
    }
    pixeltop(location){
        return location.y * this.#visibletilesize.h + this.#position.y
    }
    pixelbottom(location){
        return location.y * this.#visibletilesize.h + this.#visibletilesize.h + this.#position.y
    }
    pixelleft(location){
        return location.x * this.#visibletilesize.w + this.#position.x
    }
    pixelright(location){
        return location.x * this.#visibletilesize.w + this.#visibletilesize.w + this.#position.x
    }
    /** takes a tile location and returns the centre location as a vector3 {x:1,y:4,z:4}*/
    pixelcentre(location){
        return {x:location.x * this.#visibletilesize.w +  this.#visibletilesize.w/2 + this.#position.x,
                y:location.y * this.#visibletilesize.h +  this.#visibletilesize.h/2 + this.#position.y, z:0};
    }
    pixelcentrex(location){
        return location.x * this.#visibletilesize.w +  this.#visibletilesize.w/2 + this.#position.x;
    }
    pixelcentrey(location){
        return location.y * this.#visibletilesize.h +  this.#visibletilesize.h/2 + this.#position.y;
    }
    /** takes a bitwise tile direction and converts to a vector3 direction vector
     * create directions using bitwise or |
     * @example 
     * // up tile
     * let up = TileDirection.UP;
     * //up and left
     * let upleft = TileDirection.UP | TileDirection.LEFT;
     */
    static tileDirectiontoVector(tiledirection){
        let v = vector3.zero;
        if (tiledirection & TileDirection.UP){v.y = -1;}
        if (tiledirection & TileDirection.DOWN){v.y = 1;}
        if (tiledirection & TileDirection.LEFT){v.x = -1;}
        if (tiledirection & TileDirection.RIGHT){v.x = 1;}
        return v;
    }
    static spriteTileDirection(sprite){
        return this.vectorToTiledirection(sprite.deltaposition);
    }
    static vectorToTiledirection(vec){
        let v = vector3.ordinalise(vec);
        if (v.x > 0) {return TileDirection.RIGHT;}
        if (v.x < 0) {return TileDirection.LEFT;}
        if (v.y > 0) { return TileDirection.DOWN;}
        if (v.y < 0) {return TileDirection.UP;}
        return TileDirection.NONE;
    }
    /**
     * determines if two locations are the same
     * @param {{x:int,y:int}} locA 
     * @param {{x:int,y:int}} locB 
     * @returns true if same locations and false otherwise
     */
    static samelocation(locA, locB){
        return locA.X == locB.x && locA.y === locB.y;
    }
    /** returns the tile location of a given sprite */
    locationactor(actor){
        return this.location(actor.centrex, actor.centrey);
    }
    /** returns a tile location a tile distance from the given location
     * in the direction specified
     * @example 
     * let p = {x:4,y:5};
     * let v = map.locationto(p, map.LEFT, 4);
     * //v would be {x:0,y:5}
     * let v = map.locationto(p, map.LEFT | map.UP, 2);
     * //v would be {x:2,y:3}    
     * @param {{x:int,y:int}} loc  
     * @param {int} direction  
     * @param {int} distance  

    */
    locationOffset(loc, direction, distance){
        let v = {x:loc.x,y:loc.y};
        if (direction & TileDirection.UP){v.y -= distance;}
        if (direction & TileDirection.DOWN){v.y += distance;}
        if (direction & TileDirection.LEFT){v.x -= distance;}
        if (direction & TileDirection.RIGHT){v.x += distance;}  
        return v;
    }
    /** works out a displacement from a sprites centre tile in the direction it is moving
     * if you make the distance -ve this will give you a direction backwards
     */
    locationForward(sprite, distance){
        return this.locationOffset(this.locationactor(sprite),Tilemap.spriteTileDirection(sprite),distance);
    }
    
    /** given a list of directions available from a given tile, determines which one if moved to from a current location
     * will be nearer to the target tile. returning that direction
     */
    shortestDistanceCrow(directions, currentLoc, targetLoc){
        //just return one direction if that was all available
        if (directions.length == 1)
            return directions[0];

        let workingTile = {x:0,y:0};
        let workingDistance = 0;
        let shortestDistance = 999999999;
        let chosenDirection = TileDirection.NONE;

        for (let p = 0; p < directions.length; p++){
            const ordinal = directions[p]
            workingTile = this.locationOffset(currentLoc, ordinal, 1);
            workingDistance = vector2.distanceSQ(targetLoc, workingTile);
            //distance = Vector2.DistanceSquared(targetPos, new Vector2(newTile.X, newTile.Y));
            if (workingDistance < shortestDistance){
                shortestDistance = workingDistance;
                chosenDirection = ordinal;
            }//end switch
        }//end foreach
        return chosenDirection;
    }
    /**Checks the collision map at given location to see if it contains a legal tiles (those we can occupy)
     * returning true if it does and false if not
     * @param {{x:int,y:int}}} loc 
     * @param {[int]} legalist - an array of legal collision tile values toenable the move to be made in a direction
     */
    validLocationLegal(loc, legalist){
        return legalist.includes(this.tileNumfromCollisionMap(loc));
    }
    /**Checks the collision map for availble positions from given tile, given a set of legal tiles (those we can occupy)
     * returning a list of valid moves
     * @param {{x:int,y:int}}} loc 
     * @param {[int]} legalist - an array of legal collision tile values toenable the move to be made in a direction
     * @param {int} distance if ommited 1 tile space is used
     */ // could simplify using validLocationLegal
    validDirectionsLegal(loc, legalist, distance){
        let dir = [];
        let ct;
        if (distance === undefined){distance = 1;}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.LEFT, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.LEFT);}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.RIGHT, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.RIGHT);}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.UP, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.UP);}
        
        ct = this.tileNumfromCollisionMapoffset(loc, TileDirection.DOWN, distance);
        if (legalist.includes(ct)){dir.push(TileDirection.DOWN);}
        
        return dir;
    }
    /**Checks the tile map for availble positions from given tile, given a set of illegal tiles (those we can't occupy)
     * returning a list of valid moves
     */
    validDirectionsIllegal(loc, illegalist){

    }
    /** given a list of directions, remove the one specified (if it exists)
     */
    static removeDirection(possibleDirections, direction){
        for (let p = 0; p < possibleDirections.length; p++){
            if (possibleDirections[p] == direction){
                possibleDirections.splice(p,1);
            }
        }
    }
    /** given a list of directions, remove a direction if it is in the opposite direction to the one specified
     */
    static removeOppositeDirection(possibleDirections, direction){
        Tilemap.removeDirection(possibleDirections, Tilemap.oppositeDirection(direction));
    }
    /** given a direction (left, right up or down returns the oppositie direction, 
     * @example 
     * //will computer minor ordinals if bitwise or'd together
     * let direction = TileDirection.LEFT | TileDirection.UP; */
    static oppositeDirection(direction){
        let newdirection = 0;
        if ((direction & TileDirection.LEFT) == TileDirection.LEFT) {newdirection |= TileDirection.RIGHT;}
        else if ((direction & TileDirection.RIGHT) == TileDirection.RIGHT) {newdirection |= TileDirection.LEFT;}
        if ((direction & TileDirection.UP) == TileDirection.UP) {newdirection |= TileDirection.DOWN;} 
        else if ((direction & TileDirection.DOWN) == TileDirection.DOWN) {newdirection |= TileDirection.UP;}
        return newdirection;
    }

    /** takes a pixel location and returns a tile location (if possible) in the tilemap */
    location(x, y){
        x -= this.#position.x;
        y -= this.#position.y;
        if (this.clamplocation){
            if (x < 0) {x = 0;} else if (x >= this.#area.w){ x = this.#area.w - 1;}
            if (y < 0) {y = 0;} else if (y >= this.#area.h){ y = this.#area.h - 1;}
        }
        return {x: (x/this.#visibletilesize.w)|0, y:(y/this.#visibletilesize.h)|0}
        //return {x: (x/this.#tilesize.w)|0, y:(y/this.#tilesize.w)|0}
    }

    /** determines if a tile location exists within the tilemap */
    validLocation(loc){
        return loc.x >=0 && loc.x < this.cols && loc.y >= 0 && loc.y < this.rows;
      }

    /** gets the left hand side of given tile location
     * supply a valid tile location
     */
    pixelLeft(loc){
        let x = (loc.x === undefined) ? loc : loc.x;
        return this.#position.x + this.#visibletilesize.w * x;
        //return this.position.x + this.#tilesize.w * x;
    }
    /** gets the pixel location of the top of tile location
    * supply a valid tile location
    */
    pixelTop(loc){
        let y = (loc.y === undefined) ? loc : loc.y;
        return this.#position.y + this.#visibletilesize.h * y;
        //return this.position.y + this.#tilesize.h * y;
    }
    /** gets the right hand side of given tile location
     * supply a valid tile location
     */
    pixelRight(loc){
        let x = (loc.x === undefined) ? loc : loc.x;
        return this.#position.x + this.#visibletilesize.w * x + this.#visibletilesize.w;
        //return this.position.x + this.#tilesize.w * x + this.#tilesize.w;
    }
    /** gets the bottom hand side of given tile location
     * supply a valid tile location
     */
    pixelBottom(loc){
        let y = (loc.y === undefined) ? loc : loc.y;
        return this.#position.y + this.#visibletilesize.h * y + this.#visibletilesize.h;
        //return this.position.y + this.#tilesize.h * y + this.#tilesize.h;
    }
    /** determines if there is direction line of site from the start location and the goal location*/
    lineofSite(startloc, goalloc,){

    }
    /** produces a list of tiles between the start location and goal location */
    listBetween(startloc, goalloc,){
    }
    /** converts a tilemap into a collision map using the tilemap and 
     * An array of collision tiles which map the display tiles to specific collision ones, 
     * make sure this has enough entries to cover all the display tiles
     * @param {[int]} collisionBlocks - an array of graphic to collision mappings (must be same length as tiles array)
     * @param {int} empty - collision tile to place for undefined tilemap areas (-1 - nothing drawn)
     */
    createCollisionMap(collisionBlocks, empty){
        let row = 0;
        let col = 0;
        try{
            this.collisionmap = new Array(this.rows);
            for (let p = 0; p < this.rows; p++){this.collisionmap[p] = new Array(this.cols)}

            for (let r = 0; r < this.rows; r++){
                for (let c = 0; c < this.cols; c++) {
                    //skip no tile and leave as user defaulted for empty
                    let q = this.#map[r][c];
                    this.collisionmap[r][c] = (this.#map[r][c] == -1) ? empty : collisionBlocks[this.#map[r][c]];
                }
            }
        } catch(e){
            let p = {r:row, c:col};
            throw new ArgumentException(
                    "collision block does not contain an element for\n" +
                    "display tile number " + this.#map[row][col]  + "\n" +
                    "at position [" + row + "," + col + "]");
        }
    }
    /** works through all tile locations in the tilemap and passes tile information to the callback
     * this will allow you to remove/replace special marker tiles with other tiles and sprite if required
     * using a switch to examine the tile recepients is a good technique
     * your handler should return the tile to replace the specific tile with for instance if the tile is a sprite marker then you may
     * want to replace the tile with a floor or empty tile (return the tile given if no change is wanted)
     * @param {*} callback - a callback use Engine.makeCallback to prepare your callback object
     */
    processmap(callback){
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++) {
                let data = {loc:{x:c,y:r},tile:this.#map[r][c]};
                let newtile = Engine.processCallback(callback, data);
                if (newtile != data.tile){
                    this.setMapGraphic(data.loc, newtile);
                }
            }
        }
    }
    /**
     * will check to make sure all indexes specified in the tilemap have a corresponding tile in the tileset.
     * This is expensive so do it during debugging phase of your project to help you out.
     */
    #verifymaptiles(){
        for (let r = 0; r < this.rows; r++){
            for (let c = 0; c < this.cols; c++) {
                let data = {loc:{x:c,y:r},tile:this.#map[r][c]};
                if (data.tile >= this.#tiles.length){
                    throw new Error("UNKNOWN TILE:" + data.tile + " at loc{x, y}:{" + data.loc.x + "," + data.loc.y + "}");
                }
            }
        }
    }
    /**
     * highlights the list of directions from the given location
     * @param {{x:float,y:float}} loc 
     * @param {[TileDirection]} directions 
     * @param {{time:float,tx:texture,colour:colour, alpha:float}} renderinfo 
     */
    highlightdirections(loc, directions, renderinfo){
        for (let p = 0; p < directions.length; p++){
            //let q = this.locationOffset(loc, directions[p],1);
            renderinfo.p = p;
            new highlightTile(this.locationOffset(loc, directions[p],1), this, renderinfo);
        }
    }
    /**
     * highlight a tile location in the map
     * @param {{x:float,y:float}} loc 
     * @param {{time:float,tx:texture,port:Rectangle,colour:colour, alpha:float}} renderinfo 
     */
    highlight(loc, renderinfo){
        new highlightTile(loc, this, renderinfo);
    }
    /**
     * 
     * @param {{x:int,y:int}} loc tile location to place highlight
     * @param {{time:float, alpha:float}} renderinfo visual settings to apply, assumed that sprite frames already set (we essntially scale and alpha only)
     * @param {Sprite} spr Sprite to use, must have a frame defined
     */
    highlightnew(loc, renderinfo, spr){
        if (spr.timer == null){
            spr.timer = new Timer(spr);
            spr.timer.overwriteEnable();
        }
        spr.timer.hideafter(renderinfo.time);
        spr.scaleTo = {w:this.visibletilesize.w,h:this.visibletilesize.h};
        spr.layer = renderinfo.layerfrom.layer;
        if (renderinfo.layerfrom instanceof Tilemap) {
            spr.x = this.pixelLeft(loc);
            spr.y = this.pixelTop(loc);
        } else {
            this.setActorcentre(spr, loc);
        }
        spr.alpha = renderinfo.alpha;
    }
}

class highlightTile extends Sprite{
    mytx;
    /**
     * 
     * @param {{x:int,y:int}} loc 
     * @param {Tilemap} tmap 
     * @param {{time:float,tx:texture,port:Rectangle,colour:colour, alpha:float}} ri 
     */
    constructor(loc, tmap, ri){
        super();
        Engine.spM.add(this);

        if (ri.colour !== undefined){
            this.mytx = Tex.getColouredPixel(Array.isArray(ri.colour[0]) ? ri.colour[ri.p] : ri.colour);
            this.frame.define(this.mytx);
        } else if (ri.tx !== null){
            if (ri.portion === undefined){this.frame.define(ri.tx);}
            else { this.frame.define(ri.tx, ri.port);}
        }
        this.frame.define(Tex.singlepixel);
        this.scaleTo = {w:tmap.visibletilesize.w,h:tmap.visibletilesize.h};
        //this.sx = tmap.visibletilesize.w;
        //this.sy = tmap.visibletilesize.h;
        //this.align = Align.topLeft;
        this.alpha = ri.alpha;
        this.timer = new Timer(this);
        this.timer.killafter(ri.time);
        this.layer = tmap.layer;
        this.x = tmap.position.x + tmap.visibletilesize.w * loc.x;
        this.y = tmap.position.y + tmap.visibletilesize.h * loc.y;
    }
    cleanup(){
        super.cleanup();
        this.mytx.remove();
        this.mytx = null;
    }
}
class spriteTile extends Sprite{
    tile;
    constructor(x, y, frameinfo, number, layer, scale){
        super();
        Engine.spM.add(this);
        this.frame.define(frameinfo.tex, frameinfo.port);
        //this.align = Align.topLeft;
        this.x = x;
        this.y = y;
        this.scale1d = scale;
        this.clickable = true;
        this.tile = number;
        this.layer = layer;
        //this.showRenderArea = [255,0,0,100];
    }
    draw(){
        super.draw();
        this.layer.push();
        this.layer.textAlign(CENTER, CENTER);
        this.layer.fill(255);
        this.layer.stroke(0);
        this.layer.textSize(20);
        this.layer.strokeWeight(2);
        this.layer.text(this.tile,this.centrex, this.top);
        this.layer.pop();
    }
}