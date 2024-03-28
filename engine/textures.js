/** @classdesc support to help with textures, loading and manipulating */
class Tex{
    /** font used to pre-render textures ready for sprites (alphabet stuff)
     * change it before calling Engine.init()
     * default monospace
     */
    static prerenderFont = "monospace";
    /** font size to use for pre-render texture characters - default 24 @type {int} */
    static prerenderFontsize = 24;
    /** texture size to use for pre-render texture characters - default 32 @type {int}*/
    static prerenderFontTextureSize = 32;
    /** extra sizing for fonts that don't report ascenders and descenders properly.
     * Use this when pre-rendered character textures get cropped
     * defaults to 0, try making it 4, 6 etc... until rendering is ok
     * @type {int}
     */
    static prerenderFontTextureSizeExtra = 0;
    //texture space
    /** single pixel for scaling for rectangles @type {texture}*/
    static singlepixel;
    /** texture with just white pixels 50x50  @type {texture}*/
    static rect50by50;
    /** 8x8 pixel triangle white outline with black triangle  @type {texture}*/
    static triangle;
    /** white circle   @type {texture}*/
    static circle4by4;
    /** white circle   @type {texture}*/
    static circle8by8;
    /** white circle   @type {texture}*/
    static circle16by16;
    /** white circle   @type {texture}*/
    static circle32by32;
    /** T target can be used for visualisations  @type {texture}*/
    static target;
    /** holds alphaset as textures @type {texture[]}*/
    static txAlpha = [];
    /** holds alphaset as textures with a border @type {texture[]}*/
    static txAlphaBordered = [];
    /** set of textures generated for each of the characters */
    static alphaset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !\"£$%^&*()[]{}-+=,.:;?><¬";
    /** 
     * generates a stock alphabet as a set of sprite textures
    */
    static genAlphaset(){
        //push();
        //get metrics
        // textFont(Tex.prerenderFont);
        // textSize(Tex.prerenderFontsize);
        // Tex.prerenderFontTextureSize = textAscent() + textDescent();
        // pop();
        Tex.txAlpha = new Array(Tex.alphaset.length);
        Tex.txAlphaBordered = new Array(Tex.alphaset.length);
        for (let p =0; p < Tex.alphaset.length; p++){
            Tex.txAlpha[p] = this.makeLetter(Tex.alphaset[p]);
            Tex.txAlphaBordered[p] = this.makeLetter(Tex.alphaset[p],true);
        }
    }
    /**
     * takes the first character in string and returns appropriate texture, will return a ¬ if doesn't exist
     * @param {string} ch character to obtain texture of
     * @param {bool} border if false or undefined will return normal character texture if true will get a bordered version
     * @returns {texture} requested texture if exists or a not texture
     */
    static getAlphachar(ch, border){
        let p = Tex.alphaset.indexOf(ch[0]);
        if (p == -1) p = Tex.alphaset.length - 1;
        return (border === undefined || !border) ? Tex.txAlpha[p] : Tex.txAlphaBordered[p];
    }
    /**
     * returns the indexed texture from the alphaset, if outside range will return a ¬
     * @param {string} ch character to obtain texture of
     * @param {bool} border if true will get a bordered version
     * @returns {texture} texture requested if possible
     */
    static getAlphaindex(idx, border){
        if (p < 0 || p >= Tex.alphaset.length) p = Tex.alphaset.length - 1;
        return (border === undefined || !border) ? Tex.txAlpha[p] : Tex.txAlphaBordered[p];
    }
    /** slope tiles 16x16 
     * contains the following basic slopes
     * 0,0 0,4 0,8 0,12 0,16
     * 4,0 4,4 4,8 4,12 4,16
     * 8,0 8,4 8,8 8,12 8,16
     * 12,0 12,4 12,8 12,12 12,16
     * 16,0 16,4 16,8 16,12
     * used for testing purposes - for slope interactions when complete
    */
    static slopes;
    /** holds rectangles portions for the slopes */
    static #slopePorts;
    /** holds slope textures from testing */
    static tsSlopes;
    /** returns a Tile object for the given slope*/
    static getslopetile(left, right){
        left >>= 2;
        right >>= 2;
        //finish this
    }
    /**
     * hashes an RGB colour value for texture name in texture cache
     * @param {colour} colour 
     * @returns hashed colour
     */
    static colTonum(colour){
        return colour[0]*1024 + colour[1]*256 + colour[2];
    }
    /** get a coloured pixel for making sprites which when scaled can make any sized rectangle 
     * @param {colour} tintcolour 
     * @returns {texture}
    */
    static getColouredPixel(tintcolour){
        let colHash = Tex.colTonum(tintcolour);
        let tex = Tex.tintcache.get(Tex.singlepixel.__hbname + colHash) ;
        if (tex === undefined){
            tex = createGraphics(1, 1);
            tex.pixelDensity(1);
            tex.fill(tintcolour);
            tex.noStroke();
            tex.rect(0,0,1,1);
            tex.__hbname = Tex.singlepixel.__hbname;
            tex.__hbtint = colHash;
            Tex.tintcache.set(tex.__hbname + tex.__hbtint, tex);
        }
        return tex;
    }    
    //NEED TO TAKE ONBOARD THE ALPHA (as this is part of the tint)
    /** takes a texture and produces a tinted version     
     * tintcolour should be a rgb array 
     * @param {texture} texture texture/image to copy
     * @param {color} tintcolour to apply to the texture
     * @param {float} alpha alpha value to apply to the tint 0 transparent 1 fully opaque
     * @param {string} compositor if supplied overrides the default composite operation "destination-atop" with your own has to be valid operation
     * @returns {texture} the coloured texture requested
     @example [255,0,0] - rgb array full red, no green, no blue
     DO NOT USE IN A GAME LOOP THESE SHOULD BE CREATED BEFORE GAME STARTS, as this may take time
     if texture in that colour has been requested before then the cached version will be selected
    */
     static getTintedCopy(texture, tintcolour, alpha, compositor){
        compositor = (compositor === undefined) ? "destination-atop" : compositor;
        let colHash = Tex.colTonum(tintcolour);
        let tex = Tex.tintcache.get(texture.__hbname + colHash) ;
        if (tex === undefined){
            if (alpha === undefined){alpha = 1;}
            tex = createGraphics(texture.width, texture.height);
            tex.pixelDensity(1);
            tex.drawingContext.globalAlpha = alpha;
            tex.fill(tintcolour);
            tex.noStroke();
            tex.rect(0,0,tex.width,tex.height);
            tex.drawingContext.globalCompositeOperation = compositor;// "destination-atop";
            tex.drawingContext.globalAlpha = 1;
            tex.image(texture,0,0);
            tex.__hbname = texture.__hbname;
            tex.__hbtint = colHash;
            Tex.tintcache.set(tex.__hbname + tex.__hbtint, tex);
        }
        return tex;
    }      
    /** holds all the cached tinted textures used for quick look up rather than keep generating*/
    static tintcache = new Map();
    /** holds all the cached textures */
    static texturecache = new Map();
    /** simple counter so cache can keep track and avoid duplicates */
    static texnum = 0;
    /** holds the image load requests as these happen asynchronously */
    static loadQ = [];
    /**
     * let the engine know how many images you are loading 
     * @param {int} number number of images to be loaded in this session
     * use this if you are loading a lot and need to hold up further processing until they have loaded
     * use Tex.loadcomplete to let you know if this has happend or not
     */
    static beginload(number){
        Tex.loadcount = 0;
        Tex.loadnumbner = number
    }
    /**
     * gets true if loadnumber matches requested number set with beginload
     * @returns {bool}
     */
    static get loadcomplete() { return Tex.loadcount == Tex.loadnumbner;}
    /**
     *  load and log a particular image/texture
     * @param {string} fileNpath 
     * @param {function} texture this is easier to do as an anonymous function see example provided here
     * @example
     * //assuming txtiles has been declared globally somewhere (eg. in sketch)  
     * //anonymous function accepts parameter img, stores reference in txtiles
     * Tex.loadToTexture("./tiles.png", (img)=>{txtiles=img;});
     */
    static loadToTexture(fileNpath, callback){
        let tex = Tex.texturecache.get(fileNpath);
        if (tex === undefined && !this.loadQ.includes(fileNpath)){
            Tex.loadQ.push(fileNpath);
            loadImage(fileNpath, (img)=>{
                let t = img; 
                t.__hbtint = this.colTonum([255,255,255])
                t.__hbname = fileNpath;
                //remove from q
                Tex.texturecache.set(t.__hbname + t.__hbtint, t);
                Tex.loadQ.splice(Tex.loadQ.indexOf(fileNpath),1);
                Tex.loadcount++;
                callback(t);
                }
            );
        } else {console.log("attempt to load texture "+fileNpath+" again");}
    }
    //do not use stupid thing
    // static waitloading(){
    //     while (this.loadQ.length > 0);
    // }
    /** creates all the textures ready for use */
    static createTextures(){
        Tex.singlepixel = Tex.setupTexture(1,1);
        Tex.singlepixel.background(255);

        Tex.rect50by50 = Tex.setupTexture(50,50);
        Tex.rect50by50.background(255);
        
        Tex.target = Tex.makeLetter("T",true);
        Tex.genAlphaset();
        // triangle
        Tex.triangle = Tex.setupTexture(16,16);
        Tex.triangle.triangle(0,15,8,0,15,15);
        //circles
        Tex.circle4by4 = Tex.setupTexture(4,4);
        Tex.circle4by4.ellipse(2,2,1,1);

        Tex.circle8by8 = Tex.setupTexture(8,8);
        Tex.circle8by8.ellipse(4,4,3,3);

        Tex.circle16by16 = Tex.setupTexture(16,16);
        Tex.circle16by16.ellipse(8,8,7,7);

        Tex.circle32by32 = Tex.setupTexture(32,32);
        Tex.circle32by32.ellipse(16,16,15,15);
        Tex.slopes = Tex.#createSlopes(16);
    }
    /** generates the alphabetic character textures */
    static makeLetter(t, border){
        // test for rendermetrics
        push();
        textFont(Tex.prerenderFont);
        textSize(Tex.prerenderFontsize);
        let b = textAscent();
        let c = textDescent();
        Tex.prerenderFontTextureSize = b + c + Tex.prerenderFontTextureSizeExtra;
        pop();
        let tx = Tex.setupTexture(Tex.prerenderFontTextureSize,Tex.prerenderFontTextureSize);
        // tx.textFont("monospace");
        tx.textFont(Tex.prerenderFont);
        tx.textSize(Tex.prerenderFontsize);

        //
        tx.stroke(255);
        tx.strokeWeight(2);
        tx.noFill();
        if (border !== undefined)
            tx.rect(2,2,Tex.prerenderFontTextureSize-4,Tex.prerenderFontTextureSize-4,4,4,4,4);
        tx.fill(255);
        tx.textAlign(CENTER, CENTER);
        tx.text(t,Tex.prerenderFontTextureSize/2,Tex.prerenderFontTextureSize/2);  
        return tx;
    }
    /** generic routine to create a texture with the width and height requested
     * will add it to the texture cache
     * 
     */

    /**
     * generic routine to create a texture with the width and height requested
     * will add it to the texture cache
     * @param {int} width number of pixels wide
     * @param {int} height number of pixels high
     * @returns {texture} texture to be drawn and written to
     */
    static setupTexture(width, height){
        let t = createGraphics(width, height);
        t.pixelDensity(1);
        t.clear();
        t.fill(255);
        t.noStroke();
        t.noSmooth();      
        t.__hbname = "tx" + Tex.texnum++;
        t.__hbtint = this.colTonum([255,255,255])
        this.texturecache.set(t.__hbname + t.__hbtint, t);
        return t;  
    }
 
    /**
     * generates a transparent texture with pixels set by a binary string array (white pixels equate 1 from the string array)
     * 
     * this can be used to generate tinted textures using getTintedCopy()
     * 
     * @param {string[]} each string in array represents a row of horizontal pixels, from top to bottom in binary (0/1), each string should contain the same number of bits
     * @param {int} scalex number of pixels each bit represents horizontally, if ommitted assumes 1 pixel per bit
     * @param {int} scaley number of pixels vertically each string represents, if ommitted assumes 1 row per string
     * @returns {texture} texture to be drawn and written to
     * @example 
     * let tank = [
     *      "0001000",
     *      "0001000",
     *      "1101011",
     *      "1111111",
     *      "1111111",
     *      "1100011",
     *      "1100011",
     *      ];
     * // use 4 pixels for each bit supplied horizontally and vertically
     * tex28x28 = Tex.bitarrayTotexture(tank, 4, 4);
     */
    static bitarrayTotexture(bits, scalex, scaley){
        scalex = (scalex === undefined)? 1 : scalex;
        scaley = (scaley === undefined)? 1 : scaley;
        let h = bits.length;
        let w = Tex.longestString(bits);
        let t = Tex.setupTexture(w *scalex, h * scaley);
        for (let y = 0; y < h; y++){
            for (let x = 0; x < w; x++){
                if (bits[y][x] == "1"){
                    t.rect(x * scalex, y * scaley, scalex, scaley);
                }
            }
        }        
        return t;
    }

    /** used by bitarray system to work out some metrics around bits, packs out shorter bit patterns
     * @param {string[]} arr 
     * @returns {int} longest string in the array
     */
    static longestString(arr){
        let b = arr[0].length;
        for (let p = 1; p < arr.length; p++){
            b = arr[p].length > b ? arr[p].length : b;
        }
        //auto pad to right with 0
        for (let p = 0; p < arr.length; p++){
            if (arr[p].length < b){
                arr[p] = arr[p].padEnd(b,"0");
            }  
        }
        return b;
    }
    /** slope tiles 16x16 
     * contains the following basic slopes
     * 0,0 0,4 0,8 0,12 0,16
     * 4,0 4,4 4,8 4,12 4,16
     * 8,0 8,4 8,8 8,12 8,16
     * 12,0 12,4 12,8 12,12 12,16
     * 16,0 16,4 16,8 16,12
    */
    /** generates slope quarters for given square tile size */
    static #createSlopes(size){
        //each tile 16x16 going to define 5x5 array of tiles (some space for dumping other tiles in later on)
        const t = Tex.setupTexture(256,256);
        Tex.tsSlopes = [];
        let q = (size/4) | 0;
        
        for (let y = 0; y < 5; y++){
            for (let x = 0; x < 5; x++){
                Tex.#trap(t, x * size, y * size, q * y , q * x, size);
                let n = new Tile(t,  new Rectangle(x * size, y * size, size, size));
                n.setHorizontalmap(q * y, q * x);
                //let data = {};
                //data.port = new Rectangle(x * size, y * size, size, size);
                //data.tex = t;
                //data.l = q * y;
                //data.r = q * x;
                Tex.tsSlopes.push(n);
                //Engine.tsSlopes.push(data);
            }
        }
        return t;
    }
    /** draw a vertical trapezium in a 16x16 area */
    static #trap(t, x, y, l, r, w){
        //draw triangle
        t.fill(120);
        if (l != r){
            let x1 = x;
            let y1 = y + l;

            let x2 = x + w;
            let y2 = y + r;

            let x3 = x + ((l > r) ? w:0);
            let y3 =  y + ((l > r) ? l:r);

            t.triangle(x1,y1, x2,y2, x3, y3);
        }
        let height = (l>r) ? l : r;
        if (height<w){
            t.rect(x,y+height, w, w-height);
        }
    }    
}