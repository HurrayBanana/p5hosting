engine created by Hurray Banana &copy;2023-2024

this can be found in file **textures.js**
## class Tex
>  support to help with textures, loading and manipulating
> 
> 

---

## properties
#### 
> to use write **this.**
> 
> generic routine to create a texture with the width and height requested
> 
> will add it to the texture cache
> 
> 

---

####  alphaset [static]
> default value **"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !\"£$%^&*()[]{}-+=,.:?><¬";**
> 
> to use write **Tex.alphaset**
> 
> set of textures generated for each of the characters
> 
> 

---

####  circle16by16 [static]
> to use write **Tex.circle16by16**
> 
> white circle   @type {texture}
> 
> 

---

####  circle32by32 [static]
> to use write **Tex.circle32by32**
> 
> white circle   @type {texture}
> 
> 

---

####  circle4by4 [static]
> to use write **Tex.circle4by4**
> 
> white circle   @type {texture}
> 
> 

---

####  circle8by8 [static]
> to use write **Tex.circle8by8**
> 
> white circle   @type {texture}
> 
> 

---

####  loadQ [static]
> default value **[]**
> 
> to use write **Tex.loadQ**
> 
> holds the image load requests as these happen asynchronously
> 
> 

---

####  prerenderFont [static]
> default value **"monospace"**
> 
> to use write **Tex.prerenderFont**
> 
> font used to pre-render textures ready for sprites (alphabet stuff)
> 
> change it before calling Engine.init()
> 
> default monospace
> 
> 

---

####  prerenderFontTextureSize [static]
> default value **32**
> 
> to use write **Tex.prerenderFontTextureSize**
> 
> texture size to use for pre-render texture characters - default 32 @type {int}
> 
> 

---

####  prerenderFontTextureSizeExtra [static]
> default value **0**
> 
> to use write **Tex.prerenderFontTextureSizeExtra**
> 
> extra sizing for fonts that don't report ascenders and descenders properly.
> 
> Use this when pre-rendered character textures get cropped
> 
> defaults to 0, try making it 4, 6 etc... until rendering is ok
> 
> 
> type {**int**}
> 
> 

---

####  prerenderFontsize [static]
> default value **24**
> 
> to use write **Tex.prerenderFontsize**
> 
> font size to use for pre-render texture characters - default 24 @type {int}
> 
> 

---

####  rect50by50 [static]
> to use write **Tex.rect50by50**
> 
> texture with just white pixels 50x50  @type {texture}
> 
> 

---

####  singlepixel [static]
> to use write **Tex.singlepixel**
> 
> single pixel for scaling for rectangles @type {texture}
> 
> 

---

####  slopes [static]
> to use write **Tex.slopes**
> 
> slope tiles 16x16
> 
> contains the following basic slopes
> 
> 0,0 0,4 0,8 0,12 0,16
> 
> 4,0 4,4 4,8 4,12 4,16
> 
> 8,0 8,4 8,8 8,12 8,16
> 
> 12,0 12,4 12,8 12,12 12,16
> 
> 16,0 16,4 16,8 16,12
> 
> used for testing purposes - for slope interactions when complete
> 
> 

---

####  target [static]
> to use write **Tex.target**
> 
> T target can be used for visualisations  @type {texture}
> 
> 

---

####  texnum [static]
> default value **0**
> 
> to use write **Tex.texnum**
> 
> simple counter so cache can keep track and avoid duplicates
> 
> 

---

####  texturecache [static]
> default value **new Map()**
> 
> to use write **Tex.texturecache**
> 
> holds all the cached textures
> 
> 

---

####  tintcache [static]
> default value **new Map()**
> 
> to use write **Tex.tintcache**
> 
> holds all the cached tinted textures used for quick look up rather than keep generating
> 
> 

---

####  triangle [static]
> to use write **Tex.triangle**
> 
> 8x8 pixel triangle white outline with black triangle  @type {texture}
> 
> 

---

####  tsSlopes [static]
> to use write **Tex.tsSlopes**
> 
> holds slope textures from testing
> 
> 

---

####  txAlpha [static]
> default value **[]**
> 
> to use write **Tex.txAlpha**
> 
> holds alphaset as textures @type {texture[]}
> 
> 

---

####  txAlphaBordered [static]
> default value **[]**
> 
> to use write **Tex.txAlphaBordered**
> 
> holds alphaset as textures with a border @type {texture[]}
> 
> 

---

#### /** generates slope quarters for given square tile size */
> to use write **this./** generates slope quarters for given square tile size */**
> 
> slope tiles 16x16
> 
> contains the following basic slopes
> 
> 0,0 0,4 0,8 0,12 0,16
> 
> 4,0 4,4 4,8 4,12 4,16
> 
> 8,0 8,4 8,8 8,12 8,16
> 
> 12,0 12,4 12,8 12,12 12,16
> 
> 16,0 16,4 16,8 16,12
> 
> 

---

## getters and setters
####   loadcomplete [getter] [static]
> to use write **Tex.loadcomplete**
> 
> gets true if loadnumber matches requested number set with beginload
> 
> 
> returns {**bool**}
> 
> 

---

## Methods
####  beginload(number) [static]
> to use write **Tex.beginload(number)**
> 
> let the engine know how many images you are loading
> 
> 
> **Parameters**
> 
> {**int**} **number** number of images to be loaded in this session
> 
> 

---

####  bitarrayTotexture(bits, scalex, scaley) [static]
> to use write **Tex.bitarrayTotexture(bits, scalex, scaley)**
> 
> generates a transparent texture with pixels set by a binary string array (white pixels equate 1 from the string array)
> 
> this can be used to generate tinted textures using getTintedCopy()
> 
> 
> returns {**texture**} texture to be drawn and written to
> 
> 
> **Parameters**
> 
> {**string[]**} **each** string in array represents a row of horizontal pixels, from top to bottom in binary (0/1), each string should contain the same number of bits
> 
> {**int**} **scalex** number of pixels each bit represents horizontally, if ommitted assumes 1 pixel per bit
> 
> {**int**} **scaley** number of pixels vertically each string represents, if ommitted assumes 1 row per string
> 
> ```js
> example
>       let tank = [
>            "0001000",
>            "0001000",
>            "1101011",
>            "1111111",
>            "1111111",
>            "1100011",
>            "1100011",
>            ];
>       // use 4 pixels for each bit supplied horizontally and vertically
>       tex28x28 = Tex.bitarrayTotexture(tank, 4, 4);
>      
> ```
> 

---

####  colTonum(colour) [static]
> to use write **Tex.colTonum(colour)**
> 
> hashes an RGB colour value for texture name in texture cache
> 
> 
> returns {**     * @returns hashed colou**}
> 
> 
> **Parameters**
> 
> {**colour**} **colour** 
> 
> 

---

####  createTextures() [static]
> to use write **Tex.createTextures()**
> 
> creates all the textures ready for use
> 
> 

---

####  genAlphaset() [static]
> to use write **Tex.genAlphaset()**
> 
> generates a stock alphabet as a set of sprite textures
> 
> 

---

####  getAlphachar(ch, border) [static]
> to use write **Tex.getAlphachar(ch, border)**
> 
> takes the first character in string and returns appropriate texture, will return a ¬ if doesn't exist
> 
> 
> returns {**texture**} requested texture if exists or a not texture
> 
> 
> **Parameters**
> 
> {**string**} **ch** character to obtain texture of
> 
> {**bool**} **border** if false or undefined will return normal character texture if true will get a bordered version
> 
> 

---

####  getAlphaindex(idx, border) [static]
> to use write **Tex.getAlphaindex(idx, border)**
> 
> returns the indexed texture from the alphaset, if outside range will return a ¬
> 
> 
> returns {**texture**} texture requested if possible
> 
> 
> **Parameters**
> 
> {**string**} **ch** character to obtain texture of
> 
> {**bool**} **border** if true will get a bordered version
> 
> 

---

####  getColouredPixel(tintcolour) [static]
> to use write **Tex.getColouredPixel(tintcolour)**
> 
> get a coloured pixel for making sprites which when scaled can make any sized rectangle
> 
> 
> returns {**texture**}
> 
> 
> **Parameters**
> 
> {**colour**} **tintcolour** 
> 
> 

---

####  getTintedCopy(texture, tintcolour, alpha, compositor) [static]
> to use write **Tex.getTintedCopy(texture, tintcolour, alpha, compositor)**
> 
> takes a texture and produces a tinted version
> 
> tintcolour should be a rgb array
> 
> 
> returns {**texture**} the coloured texture requested
> 
> 
> **Parameters**
> 
> {**texture**} **texture** texture/image to copy
> 
> {**color**} **tintcolour** to apply to the texture
> 
> {**float**} **alpha** alpha value to apply to the tint 0 transparent 1 fully opaque
> 
> {**string**} **compositor** if supplied overrides the default composite operation "destination-atop" with your own has to be valid operation
> 
> ```js
> example
> [255,0,0] - rgb array full red, no green, no blue
>      DO NOT USE IN A GAME LOOP THESE SHOULD BE CREATED BEFORE GAME STARTS, as this may take time
>      if texture in that colour has been requested before then the cached version will be selected
>     
> ```
> 

---

####  getslopetile(left, right) [static]
> to use write **Tex.getslopetile(left, right)**
> 
> returns a Tile object for the given slope
> 
> 

---

####  loadToTexture(fileNpath, callback) [static]
> to use write **Tex.loadToTexture(fileNpath, callback)**
> 
> load and log a particular image/texture
> 
> 
> **Parameters**
> 
> {**string**} **fileNpath** 
> 
> {**function**} **texture** this is easier to do as an anonymous function see example provided here
> 
> ```js
> example
>       //assuming txtiles has been declared globally somewhere (eg. in sketch)  
>       //anonymous function accepts parameter img, stores reference in txtiles
>       Tex.loadToTexture("./tiles.png", (img)=>{txtiles=img;});
>      
> ```
> 

---

####  longestString(arr) [static]
> to use write **Tex.longestString(arr)**
> 
> used by bitarray system to work out some metrics around bits, packs out shorter bit patterns
> 
> 
> returns {**int**} longest string in the array
> 
> 
> **Parameters**
> 
> {**string[]**} **arr** 
> 
> 

---

####  makeLetter(t, border) [static]
> to use write **Tex.makeLetter(t, border)**
> 
> generates the alphabetic character textures
> 
> 

---

####  setupTexture(width, height) [static]
> to use write **Tex.setupTexture(width, height)**
> 
> generic routine to create a texture with the width and height requested
> 
> will add it to the texture cache
> 
> 
> returns {**texture**} texture to be drawn and written to
> 
> 
> **Parameters**
> 
> {**int**} **width** number of pixels wide
> 
> {**int**} **height** number of pixels high
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
