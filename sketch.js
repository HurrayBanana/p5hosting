//uses instance mode for the sketch
//so we can control what element the sketch ends up inside of
//globals
//TODO graph needs converting into a class so fields can be present
//and transformation work can then happen in there.
//graph = [];
let graph;
let co;
/* END OF GLOBALS */
const s = ( s ) => {
  let cBACK = [220,220,255];
  let sW = 600;
  let sH = 600;  
  
  s.setup = () => {
    //ref to canvas
    var can = s.createCanvas(sW, sH);
    let p = document.getElementById("console");
    p.style.height = sH + "px";
    co = new con(p,30);
    //co.Off();
    s.createUI();
    graph = new Graph("demo");
    s.buildgraph(graph);
    //create mouse event only triggered over canvas area
    can.mousePressed(s.canvasdown);
  };

  //used for individual key press cases
  s.keyPressed = () => {
      inpM.SetPressedState(s.keyCode);
  };

  s.keyReleased = () => {
    inpM.SetReleasedState(s.keyCode);
  };

  s.createUI=()=>{}

  //******** for testing *************
  s.buildgraph = (g) => {
    makenodes(s, g, 4, sW, sH);
    addrandomfriends(g.g,2,10,20);
    g.centre(s);
  };
  s.logic = () => {
    hidecontainer("overoptions");
    hidecontainer("joinnode");
    //hidecontainer("removenode");
    
    s.generalUI(graph);
    graph.update(s);
  }

  s.generalUI = (g) => {
      if (inpM.kPressed(kH) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.Visible = !co.Visible;
      }
      if (inpM.kPressed(kH) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.toggleDuplicates();
      }
      if (inpM.kPressed(kE))
        filestuff.arrStringFromGraph(s, graph);
      if (inpM.kPressed(kL)){
        Graph.loadGraph(s.newGraph);
      }
      if (inpM.kPressed(kC) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.centre(s, true);
      }
      if (inpM.kPressed(kC) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.clear();
      }
      if (inpM.kPressed(kA)){
        graph.toggleArrows();
      }
  }
  s.newGraph=(g)=>{
    graph = g;
    g.centre(s, true);
  }    
  s.draw = () => {
    s.logic();
    s.background(cBACK);
    graph.draw(s);
    s.drawkeys();
    s.text("hover:" + graph.over, 10,sH - 30);
    s.after();
  };
  s.after=()=>{
    inpM.update();
  }
  s.drawkeys=()=>{
    s.text(inpM.getKeyState(), 10,10);
  }
  
  //mouse button down event only over canvas
  s.canvasdown=()=>{
    graph.pressed(s);
  }

  s.mouseReleased = () => {
    //nodew.released(graph);
    graph.released(s);
  };
};let myp5 = new p5(s, 'sketcharea');

