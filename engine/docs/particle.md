> ### class partic
> Holds information about an idividual particle
> 
> 

---

> #### pos
> position of the particle. You can make this a vector3 type (or any type) as long as it has x and y properties that set the position
> 
> to draw the particle on screen
> 
> 
> {**vector2**}
> 
> 

---

> #### vel
> velocity of the particle, you can use whatever you wish as your update controls the particles but it must update the postion x and y properties
> 
> 
> {**vector2**}
> 
> 

---

> #### rot
> the rotation angle of the particle texture, in radians
> 
> Do any work here in radians (if you want to sue degrees you'll have to do the maths to convert between)
> 
> 
> {**float**} in radians
> 
> 

---

> #### size
> a value to determine the scale in the x and y directions for the particle.
> 
> 
> {**vector2**} or any object with x and y properties e.g {x:2,y:3}
> 
> 

---

> #### gsize
> a value to determine the scale in the x and y directions for the particles drawn on a glow layer.
> 
> This enables you to draw at different sizes if you are drawing on both the glow and normal layers
> 
> 
> {**vector2**} or any object with x and y properties e.g {x:2,y:3}
> 
> 

---

> #### alive
> if false then the particle will no longer be drawn
> 
> set an individual particles alive propery to false to stop it being draw (you probably want to stop it being updated in your update method as well)
> 
> defaults to true
> 
> 
> {**bool**}
> 
> 

---

> #### end = false
> if true then the partcile set will be removed from the Particle Manager
> 
> set this to true in your update method when you want the particle effect to stop
> 
> 
> {**bool**}
> 
> 

---

> #### particles
> Array of particles in this set
> 
> 
> {**particle[]**}
> 
> 

---

> #### layer = null
> renderlayer associated with this particle set
> 
> 
> {**Image | Texture**}
> 
> 

---

> #### glayer = null
> glow renderlayer associated with this particle set
> 
> 
> {**Image | Texture**}
> 
> 

---

> #### alpha
> transparency of the particles (1 opaque -> 0 fully transparent)
> 
> 
> {**float**}
> 
> 

---

> #### basecol = null
> the colour to tint the texture you have supplied for the particles,
> 
> default null, If set then the colour value will be used to tint the texture
> 
> 
> {**colour**}
> 
> 

---

> #### glowcol = null
> the colour to tint the texture you have supplied for the particles,
> 
> default null, If set then the colour value will be used to tint the texture
> 
> 
> {**colour**}
> 
> 

---

> #### tx
> the texture to render the partcile, this must be set, it defaults to Tex.singlepixel. The entire texture is rendered so be careful on choice
> 
> 
> {**Image|Texture**}
> 
> 

---

> #### world = true
> specifies whether we are rendering in world or main view co-ordinates, default is true, world co-ordinates.
> 
> It should be set to the same as whatever co-ordinate system the particle is associated with
> 
> 

---

> #### constructor(density)
> creates the partcle set with the following number of elements
> 
> Make sure in you constructor after calling super(number of elements) that you set up the initial properties for each particle
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
> ```
> 

---

> #### cleanup()
> removes any references when the particleset is destroyed, if you add any extra resources to your
> 
> own partcile sets make sure you override this cleanup method and call super.cleanup() within your method
> 
> 

---

