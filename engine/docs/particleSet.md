engine created by Hurray Banana &copy;2023-2024

this can be found in file **track.js**
## class particleSet
> a container for a particle effect which holds a set of particles
> 
> to be manipulated.
> 
> You have to provide a method to setup the initial settings for each particle
> 
> and also an update method to alter and manipulate each particle
> 
> 

---

## properties
#### alpha
> to use write **this.alpha**
> 
> transparency of the particles (1 opaque -> 0 fully transparent)
> 
> 
> type {**float**}
> 
> 

---

#### basecol
> default value **null**
> 
> to use write **this.basecol**
> 
> the colour to tint the texture you have supplied for the particles,
> 
> default null, If set then the colour value will be used to tint the texture
> 
> 
> type {**colour**}
> 
> 

---

#### constructor(density)
> to use write **this.constructor(density)**
> 
> creates the partcle set with the following number of elements
> 
> Make sure in you constructor after calling super(number of elements) that you set up the initial properties for each particle
> 
> the particles will be created for you (based on the density number) and the alive property set to true automatically
> 
> ```js
> example
>       // a set of simple time based animations for effects 
>      class thrust extends particleSet{
>      
>        end;
>        colour;
>        direction;
>        start;
>        constructor(pos, direction, density, col, world)
>        {
>            super(density);
>            Engine.particleM.add(this);
>            this.layer = Engine.glowlayer(0);
>            //normailse direction vector (so length 1)
>            direction.normalise();
>            //generate initial particles
>            this.generator(direction, pos, col);
>            this.world = world;
>        }
>      
>        // generates the initial position and texture etc.. for each of the particles
>        generator(direction, start, col)
>        {
>            this.alpha = 0.5;
>            this.basecol = col;
>            //loop through each particle creating it
>            for (let p = 0; p < this.particles.length; p++)
>            {
>                //create a moving particle and store
>                let mp = this.particles[p];
>                mp.size = new vector2(15,15);
>      
>                //set initial position and let the engine know this is alive (to be drawn)
>                mp.pos = start.clone;
>      
>                //add a little randomness to general direction flying
>                let x = floatBetween(direction.x - 0.35, direction.x + 0.35);
>                let y = floatBetween(direction.y - 0.35, direction.y + 0.35);
>                //set velocity based on requested direction + the little bit of random spread
>                mp.vel = new vector2((direction.x + x)*150,
>                                     (direction.y + y)*150)  ;
>                
>                //set rotation (in radians) to be same as direction it will move
>                mp.rot = vector2.anglefromdirection(mp.vel);
>                //set initial colour
>                mp.col = [col[0],col[1],col[2]];
>            }
>        }  
>        update()
>        {
>            this.alpha -= 1 * delta;
>            //if alpha is too low disable rendering kill the entire particle set
>            if (this.alpha < 0.15)
>            {
>                this.alive = false;
>                this.end = true;
>                return;
>            }
>            for (let part = 0; part < this.particles.length; part++)
>            {
>                let p = this.particles[part];
>                //only update those alive
>                if (p.alive)
>                {
>                    //add particle velocity on
>                    p.pos.x += p.vel.x * delta;
>                    p.pos.y += p.vel.y * delta;
>                    //increase scale 50% per second
>                    p.size.x += p.size.x * 0.5 * delta;
>                    p.size.y += p.size.y * 0.5 * delta;
>      
>                    //rotate by PI radians per second
>                    p.rot += Math.PI * delta;
>                }
>            }
>        }
>      }
>      
> ```
> 

---

#### end
> default value **false**
> 
> to use write **this.end**
> 
> if true then the partcile set will be removed from the Particle Manager
> 
> set this to true in your update method when you want the particle effect to stop
> 
> 
> type {**bool**}
> 
> 

---

#### glayer
> default value **null**
> 
> to use write **this.glayer**
> 
> glow renderlayer associated with this particle set
> 
> 
> type {**Image | Texture**}
> 
> 

---

#### glowcol
> default value **null**
> 
> to use write **this.glowcol**
> 
> the colour to tint the texture you have supplied for the particles,
> 
> default null, If set then the colour value will be used to tint the texture
> 
> 
> type {**colour**}
> 
> 

---

#### layer
> default value **null**
> 
> to use write **this.layer**
> 
> renderlayer associated with this particle set
> 
> 
> type {**Image | Texture**}
> 
> 

---

#### particles
> to use write **this.particles**
> 
> Array of particles in this set
> 
> 
> type {**particle[]**}
> 
> 

---

#### tx
> to use write **this.tx**
> 
> the texture to render the partcile, this must be set, it defaults to Tex.singlepixel. The entire texture is rendered so be careful on choice
> 
> 
> type {**Image|Texture**}
> 
> 

---

#### world
> default value **true**
> 
> to use write **this.world**
> 
> specifies whether we are rendering in world or main view co-ordinates, default is true, world co-ordinates.
> 
> It should be set to the same as whatever co-ordinate system the particle is associated with
> 
> 

---

## Methods
#### cleanup()
> to use write **this.cleanup()**
> 
> removes any references when the particleset is destroyed, if you add any extra resources to your
> 
> own partcile sets make sure you override this cleanup method and call super.cleanup() within your method
> 
> 

---

engine created by Hurray Banana &copy;2023-2024
