const b = ( s ) => {

  //set a defaults to avoid nulls/undefineds etc...
  let activecolour = [255,255,255];
  let playerdata = {x:0,y:0};
  
  s.preload=()=>{
    MsgBus.sub(msgT.playerData, s.acceptPlayerData, s);
    MsgBus.sub(msgT.colour, s.acceptcolour, s);
  }
  
  s.acceptcolour=(data)=>{
    activecolour = data.col;
  }
  
  s.setup = () => {
    s.createCanvas(100, 400);
    s.frameRate(60);
  };

  //capture and store player data message
  s.acceptPlayerData=(data)=>{
    playerdata = data;
  }
  
  s.draw = () => {
    s.background(190);
    s.fill(0);
    s.text("x:" + Math.floor(playerdata.x), 10, 10);
    s.text("y:" + Math.floor(playerdata.y), 10, 20);
    s.fill(activecolour);
    s.rect(10,30,80,20);
  };
};let mypOther5 = new p5(b, 'uisketch');