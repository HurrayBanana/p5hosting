const a = ( s ) => {

  let activecolour = [255,255,0];
  let pos = new vector2(100,100);
  
  s.preload=()=>{
    MsgBus.sub(msgT.colour, s.acceptcolour, s);
  }
  
  s.setup = () => {
    s.createCanvas(400, 400);
    s.frameRate(60);
    s.background(190);
    s.noStroke();
  };

  s.acceptcolour=(data)=>{
    activecolour = data.col;
  }
  
  s.logic=()=>{
    pos.x = s.mouseX;
    pos.y = s.mouseY;
    
    if (insketch(s,pos)){
      MsgBus.send(msgT.playerData,{x:pos.x,y:pos.y});      
    }
    
  }
  s.draw = () => {
    s.logic();
    
    if (insketch(s, pos) && s.mouseIsPressed){
      s.fill(activecolour);
      s.circle(pos.x,pos.y,30);
    }
  };
  

};let myp5 = new p5(a, 'actionsketch');

