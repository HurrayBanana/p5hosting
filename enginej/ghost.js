class thrust extends particleSet{

  end;
  colour;
  direction;
  start;
  constructor(pos, direction, density, col)
  {
      super(density);
      Engine.particleM.add(this);
      this.layer = Engine.glowlayer(0);//Engine.glowlayer(15);
      //normailse direction vector (so length 1)
      direction.normalise();
      //generate initial particles
      this.generator(direction, pos, col);
  }

  /// <summary>
  /// generates the initial position and texture etc.. for each of the particles
  /// </summary>
  generator(direction, start, col)
  {
    this.alpha = 0.5;
      //loop through each particle creating it
      for (let p = 0; p < this.particles.length; p++)
      {
          //create a moving particle and store
          let mp = this.particles[p];
          mp.size = new vector2(15,15);

          //set initial position and let the engine know this is alive (to be drawn)
          mp.pos = start.clone;

          //add a little randomness to general direction flying
          let x = floatBetween(direction.x - 0.35, direction.x + 0.35);
          let y = floatBetween(direction.y - 0.35, direction.y + 0.35);
          //set velocity based on requested direction + the little bit of random spread
          mp.vel = new vector2((direction.x + x)*150,
                               (direction.y + y)*150)  ;
          
          //set rotation (in radians) to be same as direction it will move
          mp.rot = vector2.anglefromdirection(mp.vel);
          //set initial colour
          mp.col = [col[0],col[1],col[2]];
      }
  }  
  update()
  {
      this.alpha -= 1 * delta;
      //if alpha is too low disable rendering kill the entire particle set
      if (this.alpha < 0.15)
      {
          this.alive = false;
          this.end = true;
          return;
      }
      for (let part = 0; part < this.particles.length; part++)
      {
          let p = this.particles[part];
          //only update those alive
          if (p.alive)
          {
              //add particle velocity on
              p.pos.x += p.vel.x * delta;
              p.pos.y += p.vel.y * delta;
              //p.vel.y += 100 * delta;
              //increase scale 50% per second
              p.size.x += p.size.x * 0.5 * delta;
              p.size.y += p.size.y * 0.5 * delta;

              //rotate by PI radians per second
              p.rot += Math.PI * delta;
          }
      }
  }
}

class Bullet extends Sprite{
    myboss;
    constructor(start, velocity, owner){
      super();
      this.myboss = owner;
      Engine.spM.add(this);
      this.frame.define(txtiles, new Rectangle(162,8,4,4));
      this.position = start.clone;
      this.velocity = velocity.clone;
      this.timer = new Timer(this);
      this.timer.killafter(2.5);
      this.friction = 1;
      //this.vscale = new vector2(0.05,0.05);
      this.history = new History(this);
      this.history.show(0.01677, 150);
      this.history.scale = 0.5;///10.01;//0.5;
      this.history.clampAlpha = 0.5;//0.1;//0.3;

      //this.gravity = new vector3(0,100,0);
      //testing vector3 referencing by using clyde as the gravity well
      //this.gravitywell = new GravityWell(refblinky.position, 500);
      //this.gravitywell = new GravityWell(refclyde.position, 560);
      //this.gravitywell = new GravityWell(new vector3(Engine.viewWidth/2,Engine.viewHeight/2,0), 100);
      this.layer = Engine.layer(0);
      //this.limit = new Limit(Limit.wrap, Engine.mainview);

      this.callbackCollide = this.hitsomething;
      this.collisionPrimary = true;
      this.collisionList = [Ghost];
    }
    update(delta){
      super.update(delta);
      if (this.scale > 2) this.kill();
    }

    hitsomething(hitthis){
      if (this.myboss !== hitthis){
        hitthis.kill();
        this.kill();
        return true;//indicate stop processing collisions
      } else {
        return false;
      }
  }


  //draw(delta){
  //  this.layer.push();
  //  this.layer.fill(255);
  //  this.layer.noStroke();
  //  this.layer.circle(this.x, this.y, 5 * this.scale);
  //  
  //  //this.layer.text("xv:" + this.vx + " vy:" + this.vy,10,100);
  //  this.layer.pop();
//
  //}
}

class Ghost extends Sprite{

    speed;
    kleft;
    kright;
    kup;
    kdown;
    kshoot;
    direction;
    shoottimer;
    bulletspeed = 200;
    constructor(up, down, left, right, shoot){
      super();
      Engine.spM.add(this);
      
      this.kleft = left;
      this.kright = right;
      this.kup = up;
      this.kdown = down;
      this.kshoot = shoot;
      

      this.frame.define(txsprite, new Rectangle(138,213,32,32));//blinky 0
      this.frame.define(txsprite, new Rectangle(172,213,32,32));//blinky 1

      this.frame.define(txsprite, new Rectangle(138,352,32,32));//pinky 2
      this.frame.define(txsprite, new Rectangle(172,352,32,32));//pinky 3
      
      this.frame.define(txsprite, new Rectangle(138,492,32,32));//inky 4
      this.frame.define(txsprite, new Rectangle(172,492,32,32));//inky 5

      this.frame.define(txsprite, new Rectangle(138,631,32,32));//clyde 6
      this.frame.define(txsprite, new Rectangle(172,631,32,32));//clyde 7

      this.scale1d = 2;
      this.e = 0.90;
      //draw on sprite layer 0 - back
      this.layer = Engine.layer(2);
      
      //this.limit = new Limit(this);
      //this.limit.regionaction(Limitmode.wrap, Engine.mainview);
      //custom timer, need to update in sprite update routine
      this.shoottimer = new Timer(this)
      this.shoottimer.interval(0.25);
      this.direction = 0;
      //this.gravity = new vector3(0,200,0);

      this.mass = 1000;

    }

    cleanup(){
      super.cleanup();
      this.myresource = null;
    }
    setcharacter(charnum){
      charnum *= 2;
      //animate every 5 pixels moved
      this.frame.animateondistance(5, LastAction.repeat,charnum,charnum + 1);
    }
  
    update(delta){
      super.update(delta);
      //update the custome timer
      this.shoottimer.update(delta);

      if (keyIsDown(this.kleft)){
        this.x -= this.speed * delta;
        this.direction = -Math.PI/2;
      }
      if (keyIsDown(this.kright)){
        this.x += this.speed * delta;
        this.direction = Math.PI/2;
      }
      if (keyIsDown(this.kup)){
        this.y -= this.speed * delta;
        this.direction = 0;
      }
      if (keyIsDown(this.kdown)){
        this.y += this.speed * delta;
        this.direction = Math.PI;
      }
      if (keyIsDown(this.kshoot))
      if (this.shoottimer.elapsedReset){
        let aim = vector3.directionfromangle(this.direction,0);
        aim.mul(this.width/2); 
        let start = new vector3(this.x + aim.x, this.y + aim.y, 0);
        let vel = aim.normalisedclone();
        vel.mul(this.bulletspeed);
        new Bullet(start, vel, this);
      }
    }

}//ghost

class Blinky extends Ghost{
  resetpos;
  constructor(mass){
    super(UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, P);

    //this.frame.defineSliding(txsprite, new Rectangle(138,213,32,32),SlideMethod.upAppear, 32);
    //console.log(this.frame.count);
    this.frame.define(Engine.txCircle4by4);
    this.frame.define(Engine.txCircle8by8);
    this.frame.define(Engine.txCircle16by16);
    this.frame.define(Engine.txCircle32by32);
    //this.frame.last();
    //this.frame.animateonrate(1, LastAction.reverse, this.frame.lastframe - 3, this.frame.lastframe);
    this.setcharacter(0);
    //this.limit = null;
    this.speed = 100;
    this.x = 500;
    this.y = 200;
    this.resetpos = this.position.clone;
    this.callbackFuneral = this.pointtoclyde;
    this.collidable = false;
    this.align = Align.centre;
    this.layer = Engine.layer(1);
    //this.angle = 45;
    this.timer = new Timer(this);
    this.limit = new Limit(this);
    let cx = Engine.mainview;
    this.limit.regionaction(Limitmode.stopAt, Engine.mainview);
    this.limit.show = null;//[0,0,255,40];
    
    //this.timer.eventStopafter(1,5,this,this.dothis);
    //this.vr = 30;
    //this.vx = 60;
    //this.gravitywell = new GravityWell(Engine.mainview.centre, 9);
    this.gravitywell = new GravityWell(refGrav.position,1.5);
    this.gravitywell = new GravityWell(refclyde.position, 1);
    this.vx = 30;
    /** scale factor to apply to history rendering
     * this value is the factor by which to increase/decrease the scale of history trails.
     * a value of 1 would increase the size by 100%
     * a value of -0.5f would decrease the size by 50%, it defaults to 0 which is no scale change */
    this.history = new History(this);
    this.history.show(0.05,20);
    this.history.renderfrom = 3;
    this.history.scale = -0.5;
    this.history.clampAlpha = 0.1;//0.1;//0.3;
    //this.invincible(5);d
    //this.friction = 0.1;
    //this.cliparea = Engine.view(1);
    //this.clipon();
    //this.hide();
    this.mass= mass;
  }
  cols = ["yellow","green"];
  ci = 0;
  dothis(){
    this.vx += 15;
    this.ci = (this.ci + 1) % 2;
    //backcol = this.cols[this.ci];
    //if (this.history.length > 0){
    //  console.log("history:", this.history[0].pos.x, " current:", this.x);
    //}
  }
  ax = -0.01;
  update(delta){
    super.update(delta);
    if (frameCount % 3 == 0) new thrust(this.position,this.deltapositionNegative,2,[255,0,255]);
    //this.alpha += this.ax;
    
    //if (this.alpha <= 0.01 || this.alpha >=0.99){
    //  this.ax = -this.ax;
    //  this.alpha += this.ax;
    //}

    let p = this.align;
    if (keyIsDown(49)){this.align = Align.topLeft;}
    if (keyIsDown(50)){this.align = Align.top;}
    if (keyIsDown(51)){this.align = Align.topRight;}
    if (keyIsDown(52)){this.align = Align.left;}
    if (keyIsDown(53)){this.align = Align.centre;}
    if (keyIsDown(54)){this.align = Align.right;}
    if (keyIsDown(55)){this.align = Align.bottomLeft;}
    if (keyIsDown(56)){this.align = Align.bottom;}
    if (keyIsDown(57)){this.align = Align.bottomRight;}
    if (p != this.align) console.log(this.align, this.centrex, this.centrey);
  }
  vunerable(){
    this.collidable = true;
  }

  invincible(seconds){
    this.collidable = false;
    this.timer.flashStopafter(seconds,0.2,0.15,this, this.vunerable);
    //this.timer.callback(this, this.vunerable, seconds);
  }
  pointtoclyde(){
    MsgBus.send(msgT.scored,{score:2,player:"blinky"});
    this.position = this.resetpos.clone;
    if (this.timer.action != null && this.timer.action != Action.flashKillafter){
      this.resurrect();
      this.invincible(5);
    }
  }

}
//keycodes from
//https://www.toptal.com/developers/keycode
let W = 87;
let S = 83;
let A = 65;
let D = 68;
let V = 86;
let P = 80;

class Clyde extends Ghost{
  resetpos;
  safe;

  constructor(){
    super(W,S,A,D,V);
    this.setcharacter(3);
    this.speed = 100;
    this.x = 150;
    this.y = 150;
    this.resetpos = this.position.clone;
    this.callbackFuneral = this.pointtoblinky;
    this.collidable = false;
    this.timer = new Timer(this);
    this.limit = new Limit(this);
    this.limit.regionaction(Limitmode.bounce, new Rectangle(200,200,400,400));
    this.cliplimit();
    this.showclip = null;//[255,0,0,40];
    this.vx = 120;
    this.vy = 100;
    this.e = 0.98;
    //this.gravity= new vector3(0,250,0);
    this.align = Align.centre;
    this.layer = Engine.layer(1);

    //this.vy = 95;
    //this.invincible(5);
    //this.hide();
    //this.history = new History(this);
    //this.history.show(0.022, 150);
    //this.history.scale = -0.05;
    //this.history.clampAlpha = 0.15;
    //this.history.renderfrom = 40;
  }

  update(delta){
    super.update(delta);
    //if (frameCount % 3 == 0) new thrust(this.position,this.deltapositionNegative,10,[0,165,255]);
    //if (frameCount % 3 == 0) new thrust(this.position,vector3.sub(this.lastposition, this.position),10,[0,165,255]);
    //stop vertical motion once sprite has bounced enough
    //if (this.vy != 0 && this.energylevel < 0.01){
      //this.gravity.y = 0;
      //this.vy = 0;
      //this.energylevel = 1;//reset energy
    //}
    MsgBus.send(mymess.clydepos,{pos:this.position});
  }
  vunerable(){
    this.collidable = true;
  }

  invincible(seconds){
    this.collidable = false;
    this.timer.flashStopafter(seconds,0.2,0.15,this, this.vunerable);
    //this.timer.callback(this, this.vunerable, seconds);
  }

  pointtoblinky(){
    MsgBus.send(msgT.scored,{score:2,player:"blinky"});
    this.position = this.resetpos.clone;
    if (this.timer.action != Action.flashKillafter){
      this.resurrect();
      this.invincible(5);
    }
  }
}

class GravSprite extends Sprite{
  static missilecount = 0;
  mytracking = null;
  killtime = 10;
  flamecolour = [255,0,0];
  constructor(x,y){
    super();
    Engine.spM.add(this);
    this.frame.define(bluetri);
    this.frame.define(cyantri);
    this.frame.define(limetri);
    this.frame.define(Engine.txTriangle);
    this.frame.show(randomint(4))
    this.scale1d = 2;
    this.layer = Engine.hud;
    this.x = x;
    this.y = y;
    this.timer = new Timer(this);
    this.killtime = 8 + Math.random() * 8;
    this.timer.killafter(this.killtime);
    this.callbackFuneral = this.died;
    //this.vx = xv;
    //this.vy = yv;

    this.limit = new Limit(this);
    this.limit.regionaction(Limitmode.bounce, Engine.mainview);
    MsgBus.sub(mymess.clydepos, this.grabclyde, this);
    GravSprite.missilecount++;
  }
  cleanup(){
    super.cleanup();
    MsgBus.drop(mymess.clydepos, this.grabclyde, this);

  }
  grabclyde(data){
    this.mytracking = data.pos;
  }
  died(){
    GravSprite.missilecount--;
    if (GravSprite.missilecount < 20){
      let s = vector2.directionfromangle(Math.random()*Math.PI*2,0);
      s.mul(580); s.add(400,400);
      new GravSprite(s.x,s.y);
    }
    if (GravSprite.missilecount < 20){
      let s = vector2.directionfromangle(Math.random()*Math.PI*2,0);
      s.mul(580); s.add(400,400);
      new GravSprite(s.x,s.y);
    }
  }

  
  update(delta){
    super.update(delta);
    if (this.mytracking != null){
      this.angle += (60 + Math.random()*50) * this.angularDirectionTo(this.mytracking, 3) * delta;
      this.velocityInCurrentDirection((30 + Math.random()*50),0);
    }
    let diff = this.timer.elapsedTime/this.killtime;
    this.flamecolour[1]  = 255 * diff;
    if (frameCount % 6 == 0) new thrust(this.position,this.deltapositionNegative,2,this.flamecolour);
  }
}

class mymess extends msgT{
      /** data {score:1234,player:"blinky"} */
      static scored = "scored";
      /** data {pos:vector3} */
      static clydepos = "clydepos";
}
