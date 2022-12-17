

class vector2{
    x=0;
    y=0;
    #mag = 0;
    constructor(x, y){
      this.x = x;
      this.y = y ;
    }
  
    normalise(){
      let v = vector2.normalised(this.x, this.y);
      x = v.x;
      y = v.y;
    }
    static normalised(x,y){
        let mag = Math.sqrt(x*x + y*y);
        let ux = x/mag;
        let uy = y/mag;
        return new vector2(ux, uy);
    }
  
    static subtract(x1,y1,x2,y2){
      return  new vector2(x2 - x1, y2 - y1);
    }
  }