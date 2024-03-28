  /******************************
   * particle.js
   ******************************/ 
  /**
   * @classdesc Holds information about an idividual particle
   */
  class particle{
    /**
     * position of the particle. You can make this a vector3 type (or any type) as long as it has x and y properties that set the position
     * to draw the particle on screen
     * @type {vector2}
     */
    pos;
    /** 
     * velocity of the particle, you can use whatever you wish as your update controls the particles but it must update the postion x and y properties
     * @type {vector2}
     *  */
    vel;
    /**
     * the rotation angle of the particle texture, in radians
     * Do any work here in radians (if you want to sue degrees you'll have to do the maths to convert between)
     * @type {float} in radians
     */
    rot;
    /**
     * a value to determine the scale in the x and y directions for the particle.
     * @type {vector2} or any object with x and y properties e.g {x:2,y:3}
     */
    size;
    /**
     * a value to determine the scale in the x and y directions for the particles drawn on a glow layer.
     * This enables you to draw at different sizes if you are drawing on both the glow and normal layers
     * @type {vector2} or any object with x and y properties e.g {x:2,y:3}
     */
    gsize;
    /**
     * if false then the particle will no longer be drawn
     * set an individual particles alive propery to false to stop it being draw (you probably want to stop it being updated in your update method as well)
     * defaults to true
     * @type {bool}
     */
    alive;
}

class particleSet{
    /**
     * if true then the partcile set will be removed from the Particle Manager
     * set this to true in your update method when you want the particle effect to stop
     * @type {bool}
     */
    end = false;
    /**
     * Array of particles in this set
     * @type {particle[]}
     */
    particles;
    /**
     * renderlayer associated with this particle set
     * @type {Image | Texture}
     */
    layer = null;
    /**
     * glow renderlayer associated with this particle set
     * @type {Image | Texture}
     */
    glayer = null;
    /**
     * transparency of the particles (1 opaque -> 0 fully transparent)
     * @type {float}
     */
    alpha;
    /**
     * the colour to tint the texture you have supplied for the particles, 
     * default null, If set then the colour value will be used to tint the texture
     * @type {colour}
     */
    basecol = null;
    /**
     * the colour to tint the texture you have supplied for the particles, 
     * default null, If set then the colour value will be used to tint the texture
     * @type {colour}
     */
    glowcol = null;
    /**
     * the texture to render the partcile, this must be set, it defaults to Tex.singlepixel. The entire texture is rendered so be careful on choice
     * @type {Image|Texture}
     */
    tx;
    /**
     * specifies whether we are rendering in world or main view co-ordinates, default is true, world co-ordinates.
     * It should be set to the same as whatever co-ordinate system the particle is associated with
     */
    world = true;
    /**
     * creates the partcle set with the following number of elements
     * Make sure in you constructor after calling super(number of elements) that you set up the initial properties for each particle
     * @example
     * // a set of simple time based animations for effects 
     *class thrust extends particleSet{
     *
     *  end;
     *  colour;
     *  direction;
     *  start;
     *  constructor(pos, direction, density, col, world)
     *  {
     *      super(density);
     *      Engine.particleM.add(this);
     *      this.layer = Engine.glowlayer(0);
     *      //normailse direction vector (so length 1)
     *      direction.normalise();
     *      //generate initial particles
     *      this.generator(direction, pos, col);
     *      this.world = world;
     *  }
     *
     *  // generates the initial position and texture etc.. for each of the particles
     *  generator(direction, start, col)
     *  {
     *      this.alpha = 0.5;
     *      this.basecol = col;
     *      //loop through each particle creating it
     *      for (let p = 0; p < this.particles.length; p++)
     *      {
     *          //create a moving particle and store
     *          let mp = this.particles[p];
     *          mp.size = new vector2(15,15);
     *
     *          //set initial position and let the engine know this is alive (to be drawn)
     *          mp.pos = start.clone;
     *
     *          //add a little randomness to general direction flying
     *          let x = floatBetween(direction.x - 0.35, direction.x + 0.35);
     *          let y = floatBetween(direction.y - 0.35, direction.y + 0.35);
     *          //set velocity based on requested direction + the little bit of random spread
     *          mp.vel = new vector2((direction.x + x)*150,
     *                               (direction.y + y)*150)  ;
     *          
     *          //set rotation (in radians) to be same as direction it will move
     *          mp.rot = vector2.anglefromdirection(mp.vel);
     *          //set initial colour
     *          mp.col = [col[0],col[1],col[2]];
     *      }
     *  }  
     *  update()
     *  {
     *      this.alpha -= 1 * delta;
     *      //if alpha is too low disable rendering kill the entire particle set
     *      if (this.alpha < 0.15)
     *      {
     *          this.alive = false;
     *          this.end = true;
     *          return;
     *      }
     *      for (let part = 0; part < this.particles.length; part++)
     *      {
     *          let p = this.particles[part];
     *          //only update those alive
     *          if (p.alive)
     *          {
     *              //add particle velocity on
     *              p.pos.x += p.vel.x * delta;
     *              p.pos.y += p.vel.y * delta;
     *              //increase scale 50% per second
     *              p.size.x += p.size.x * 0.5 * delta;
     *              p.size.y += p.size.y * 0.5 * delta;
     *
     *              //rotate by PI radians per second
     *              p.rot += Math.PI * delta;
     *          }
     *      }
     *  }
     *}
     * @param {int} density 
     */
    constructor(density)
    {
        this.end = false;
        this.alpha = 1;
        this.tx = Tex.singlepixel;
        this.particles = new Array(density);
        for (let p = 0; p < density; p++){
            this.particles[p] = new particle();
            this.particles[p].alive = true;
        }
    }
    /**
     * removes any references when the particleset is destroyed, if you add any extra resources to your
     * own partcile sets make sure you override this cleanup method and call super.cleanup() within your method
     */
    cleanup(){
      this.particles = null;
    }
}

/**
 * @classdesc Manager for updating and rendering all particles
 */
class particleManager{
    /** 
     * holds the managed particles
     * @type {particleSet[]}
     */
    sets;
    /**
     * holds number of particles being managed/drawn
     */
    #count;
    /** constructs the manager */
    constructor(){
      this.sets = [];
    }
  
    /**
     * Adds a new particle set to be managed
     * @param {particleSet} ps 
     */
    add(ps){
      this.sets.push(ps);
    }
    /** updates all managed particle sets, your update routine is called to move the particles*/
    update(){
        this.#count = 0;
      for (let set = 0; set < this.sets.length; set++){
        this.sets[set].update();
      }
      this.#bringoutthedead();
    }
    //removes all particles marked as end
    // THIS IS BOGUS, LOOP ENDS IF WE DELETE the last item (the first thing checked)
    // I wonder if I can do a multisplice at the end instead ???
    #bringoutthedead(){
      let p = this.sets.length - 1;
      while (p >= 0){//} && p < this.sets.length){
          if (this.sets[p].end){
            this.sets[p].cleanup();
            this.sets.splice(p,1);
          } else { 
            this.#count += this.sets[p].particles.length;
          }
          p--;
      }
    }
    /** draws the managed particle sets */
    draw(){
        this.#count = 0;
        for (let set = 0; set < this.sets.length; set++){
            let pset = this.sets[set];
            if (pset.glayer != null || pset.layer != null){
              if (pset.layer != null) pset.layer.drawingContext.globalAlpha = pset.alpha;
              if (pset.glayer != null) pset.glayer.drawingContext.globalAlpha = pset.alpha;
              let tx;
              let gtx;
              
              tx = (pset.basecol != null) ? Tex.getTintedCopy(pset.tx, pset.basecol) : pset.tx;
              gtx = (pset.glowcol != null) ? Tex.getTintedCopy(pset.tx, pset.glowcol) : pset.tx;
              
              this.#count += pset.particles.length;
              let ofx = this.world ? -Engine.mainview.x:0;
              let ofy = this.world ? -Engine.mainview.y:0;
              if (pset.layer != null && pset.glayer == null){
                for (let part = 0; part < pset.particles.length; part++){
                    let p = pset.particles[part];
                    if (p.alive){
                        pset.layer.push();
                        pset.layer.translate(p.pos.x + ofx , p.pos.y + ofy);
                        
                        if (p.rot != 0){ pset.layer.rotate(p.rot);}
                        
                        pset.layer.image(tx,0,0,p.size.x, p.size.y);
                        pset.layer.pop();
                    }
                 }
              } else if (pset.layer == null && pset.glayer != null){
                for (let part = 0; part < pset.particles.length; part++){
                    let p = pset.particles[part];
                    if (p.alive){
                        pset.glayer.push();
                        pset.glayer.translate(p.pos.x + ofx , p.pos.y + ofy);
                        
                        if (p.rot != 0){ pset.glayer.rotate(p.rot);}
                        
                        pset.glayer.image(gtx,0,0,p.gsize.x, p.gsize.y);
                        pset.glayer.pop();
                    }
                 }
              } else {
                for (let part = 0; part < pset.particles.length; part++){
                  let p = pset.particles[part];
                  if (p.alive){
                      pset.layer.push();
                      pset.glayer.push();
                      pset.layer.translate(p.pos.x + ofx , p.pos.y + ofy);
                      pset.glayer.translate(p.pos.x + ofx , p.pos.y + ofy);
                      
                      if (p.rot != 0){ pset.layer.rotate(p.rot);pset.glayer.rotate(p.rot);}
                      
                      pset.layer.image(tx,0,0,p.size.x, p.size.y);
                      pset.glayer.image(gtx,0,0,p.gsize.x, p.gsize.y);
                      pset.layer.pop();
                      pset.glayer.pop();
                  }
               }

              }
            }
        }
    }
    /**
     * gets a debug string from the particle manager with number of particle sets and total number of active particles
     */
    get debugdisplay(){return "particle sets [" + this.sets.length + 
    "] particles [" + this.#count + "]";}
}