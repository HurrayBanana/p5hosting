const c = ( s ) => {
  colour = [];
  
  //all drawing done once at start
  s.setup = () => {
    s.createCanvas(400, 60);
    s.background(190);
    s.frameRate(60);
    s.colorMode(s.HSB,255);
    s.textAlign(s.CENTER,s.CENTER);
    s.text("click to select colour", 200, 10);
    for (let p = 0; p <= 400; p++){
      let c = s.color(p/400*255, 255, 255);
      s.stroke(c);
      colour.push(c);
      s.line(p,20,p,60);
    }
    //now broadcast starting colour
    MsgBus.send(msgT.colour,{col:colour[0]});
  };

  s.logic=()=>{
    if (s.mouseIsPressed){
      let pos = new vector2(s.mouseX,s.mouseY);
      if (insketch(s, pos)){
        MsgBus.send(msgT.colour,{col:colour[Math.floor(pos.x)]});
      }
    }
  }
  //no drawing here
  s.draw = () => {
    s.logic();
  };
};let myp5colour = new p5(c, 'coloursketch');