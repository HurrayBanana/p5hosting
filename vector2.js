

class vector2{
    #x=0;
    #y=0;
    //dirty;
    #length;
    get length(){return this.#length;}
    get distance() {return this.#length;}
    #mag = 0;
    constructor(x, y){
      this.set(x,y);
    }
    set(x,y){
      this.#x = x;
      this.#y = y;
      this.#calcdist();
    }
    get x(){return this.#x;}
    get y(){return this.#y;}
    set x(value){
      if (this.#x != value){
        this.#x = value;
        this.#calcdist();
      } 
    }
    set y(value){
      if (this.#y != value){
        this.#y = value;
        this.#calcdist();
      } 
    }
    #calcdist(){
      this.#length = Math.sqrt(this.#x*this.#x + this.#y*this.#y);
    }

    get normalise(){
      this.#x = this.#x/this.#length;
      this.#y = this.#y/this.#length;
      this.#length = 1;
      return this;
    }
    normaliseNew(){
      return new vector2(x/this.#length, y/this.#length);
    }
    static normalised(x,y){
        let mag = Math.sqrt(x*x + y*y);
        //let ux = x/mag;
        //let uy = y/mag;
        return new vector2(x/mag, y/mag);
    }
    mulNew(scalar){
      return new vector2(this.#x * scalar, this.#y * scalar);
    }
    divNew(scalar){
      return new vector2(this.#x / scalar, this.#y / scalar);
    }
    mul(scalar){
      this.x = this.#x * scalar;
      this.y = this.#y * scalar;
    }
    div(scalar){
      this.x = this.#x / scalar;
      this.y = this.#y / scalar;
    }
    add(vec, y){
      if (y === undefined){// if just a vector
        this.#x = this.#x + vec.x;
        this.#y = this.#y + vec.y;

      } else {
        this.#x += vec;
        this.#y += y;
      }
      this.#calcdist();
    }
    sub(vec, y){
      if (y === undefined){// if just a vector
        this.#x -= vec.x;
        this.#y -= vec.y;
      } else {
        this.#x -= vec;
        this.#y -= y;
      }
      this.#calcdist();
    }
    static sub(v1, v2){
      return  new vector2(v1.#x - v2.#x, v1.#y - v2.#y);
    }
  }