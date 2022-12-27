//uses instance mode for the sketch
//so we can control what element the sketch ends up inside of
//globals
//TODO graph needs converting into a class so fields can be present
//and transformation work can then happen in there.
//graph = [];
let graph;
let co;
textentryactive = false;

/* END OF GLOBALS */
const s = ( s ) => {
  let cBACK = [220,220,255];
  let sW = 750;
  let sH = 750;  
  let nameInput;
  
  s.setup = () => {
    //ref to canvas
    var can = s.createCanvas(sW, sH);
    s.setHTMLcanvas();
    let p = document.getElementById("console");
    p.style.height = sH + "px";
    co = new con(p,30);
    //co.Off();
    s.createUI();
    graph = new Graph();
    co.log("made:" + graph.name);
    setTextboxValue("filename", graph.name);
    
    s.buildgraph(graph);
    //create mouse event only triggered over canvas area
    can.mousePressed(s.canvasdown);
  };
  s.setHTMLcanvas=()=>{
    let p = document.getElementById("sketcharea");
    p.style.height = s.height + "px";
    p.style.width = s.width + "px";
  }

  //used for individual key press cases
  s.keyPressed = () => {
      inpM.SetPressedState(s.keyCode);
  };

  s.keyReleased = () => {
    inpM.SetReleasedState(s.keyCode);
  };

  s.createUI=()=>{

  }
  s.nameedit=()=>{
    let b = document.getElementById("filename");
    b.className = "editname"
  }
  s.nameChanged=()=> {
    co.log('you are typing: ', nameInput.value());
    graph.name = nameInput.value();
  }


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
    if (!textentryactive){
      if (inpM.kPressed(kD) && !insketcharea(s, s.mouseX, s.mouseY)){
        s.dijsolve(g);
      }
      if (inpM.kPressed(kA) && !insketcharea(s, s.mouseX, s.mouseY)){
        s.astarsolve(g);
      }
      if (inpM.kPressed(kH) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.Visible = !co.Visible;
      }
      if (inpM.kPressed(kH) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.toggleDuplicates();
      }
      if (inpM.kPressed(kE)){
        g.name = getTextboxValue("filename");
        filestuff.arrStringFromGraph(s, graph);
      }
      if (inpM.kPressed(kL) && !insketcharea(s, s.mouseX, s.mouseY)){
        Graph.loadGraph(s.newGraph);
      }
      if (inpM.kPressed(kC) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.centre(s, true);
      }
      if (inpM.kPressed(kC) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.clear();
      }
      if (inpM.kPressed(kA) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.toggleArrows();
      }
    }
  }
  let dij = null;
  let astar = null;
  s.dijsolve=(g)=>{
    if (dij == null|| dij.finished ) {
      dij = new Dijkstra(g);
      dij.cycles = 1;
    } else {
      dij.solve();
    }
    let htc = document.getElementById("console");
    htc.innerHTML = dij.showStateHTML();
  }
  s.astarsolve=(g)=>{
    if (astar == null|| astar.finished ) {
      astar = new Astar(g);
      astar.cycles = 1;
    } else {
      astar.solve();
    }
      let htc = document.getElementById("console");
      htc.innerHTML = astar.showStateHTML();
  }
  s.newGraph=(g)=>{
    graph = g;
    g.centre(s, true);
    setTextboxValue("filename",g.name);
  }    
  s.draw = () => {
    s.logic();
    s.background(cBACK);
    graph.draw(s);
    //s.drawkeys();
    if (dij != null && dij.finished && dij.route != null){
      s.text(dij.show(), 20, 100);
    }
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
    graph.released(s);
  };
};let myp5 = new p5(s, 'sketcharea');

