//uses instance mode for the sketch
//so we can control what element the sketch ends up inside of
//globals
//TODO graph needs converting into a class so fields can be present
//and transformation work can then happen in there.
//graph = [];
let graph;
let co;
textentryactive = false;
solveDijkstra = true;

/* END OF GLOBALS */
const s = ( s ) => {
  let cBACK = [220,220,255];
  let sW = 750;
  let sH = 750;  
  let nameInput;
  let htc;
  let dij = null;
  let astar = null;
  let outputdata = false;
  s.setup = () => {
    //ref to canvas
    var can = s.createCanvas(sW, sH);
    s.setHTMLcanvas();
    let p = document.getElementById("console");
    //p.style.height = sH + "px";
    co = new con(p,30);
    //co.Off();
    s.createUI();
    graph = new Graph();
    co.log("made:" + graph.name);
    setTextboxValue("filename", graph.name);
    
    s.buildgraph(graph);
    //create mouse event only triggered over canvas area
    can.mousePressed(s.canvasdown);
    htc = document.getElementById("console");
    s.broadcastAllStates();

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
    MsgBus.sub(msgT.solvemethod, s.toggleSolveMethod, s);
    MsgBus.sub(msgT.solve, s.solvegraph, s);
  }

  s.solvegraph=()=>{
    if (solveDijkstra){
      s.dijsolve(graph);
    } else {
      s.astarsolve(graph);
    }
  }
  s.toggleSolveMethod=()=>{
    solveDijkstra = !solveDijkstra;
    dij = null;
    astar = null;
    //graph.clearRoute();
    s.broadcastSolveMethod();
  }
  s.broadcastAllStates=()=>{
    s.broadcastSolveMethod();
  }
  s.broadcastSolveMethod=()=>[
    MsgBus.send(msgT.solvemethodchanged, {state:solveDijkstra, txtT:"Dijkstra", txtF:"A *"})
  ]
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
      if (inpM.kPressed(kP)){
        MsgBus.send(msgT.solve);
      }
      if (inpM.kPressed(kD) && !insketcharea(s, s.mouseX, s.mouseY)){
        s.dijsolve(g);
      }
      if (inpM.kPressed(kA) && !insketcharea(s, s.mouseX, s.mouseY)){
        s.astarsolve(g);
      }
      if (inpM.kPressed(kH) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.Visible = !co.Visible;
      }
      if (inpM.kPressed(kC) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.clear();
      }
      if (inpM.kPressed(kE)&& !insketcharea(s, s.mouseX, s.mouseY)){
        g.name = getTextboxValue("filename");
        filestuff.arrStringFromGraph(s, graph);
      }
      if (inpM.kPressed(kL) && !insketcharea(s, s.mouseX, s.mouseY)){
        Graph.loadGraph(s.newGraph);
      }
      if (inpM.kPressed(kC) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.centre(s, true);
      }
      if (inpM.kPressed(kA) && insketcharea(s, s.mouseX, s.mouseY)){
        //graph.toggleArrows();
        MsgBus.send(msgT.arrows);
      }
      if (inpM.kPressed(kH) && insketcharea(s, s.mouseX, s.mouseY)){
        //graph.toggleDuplicates();
        MsgBus.send(msgT.duplicates);
      }
    }
  }

  s.dijsolve=(g)=>{
    if (dij == null){//|| dij.finished ) {
      dij = new Dijkstra(g);
      dij.start();
      outputdata = true;
      dij.cycles = 1;
    } else {
      if (!dij.started){
        dij.start();
      } else if (!dij.finished){
        dij.solve();
      }
    }
    if (outputdata){
      if (g.solveHistory){
        co.log(dij.showStateHTML());
      } else {
        htc.innerHTML = dij.showStateHTML();
      }
    } 
    if (dij.finished) {
      outputdata = false;
    }
  }
  s.astarsolve=(g)=>{
    if (astar == null){//|| astar.finished ) {
      astar = new Astar(g);
      astar.start();
      outputdata = true;
      astar.cycles = 1;
    } else {
      if (!astar.started){
        astar.start();
      } else if (!astar.finished){
        astar.solve();
      }
    }
    if (outputdata){
      if (g.solveHistory){
        co.log(astar.showStateHTML());
      } else {
        htc.innerHTML = astar.showStateHTML();
      }    
    }
    if (astar.finished) {
      outputdata = false;
    }
  }
  s.newGraph=(g)=>{
    graph.cleanup();
    dij=null;
    astar=null;
    graph = g;
    g.centre(s, true);
    setTextboxValue("filename",g.name);
  }    
  s.draw = () => {
    s.logic();
    s.background(cBACK);
    graph.draw(s);
    
    if (dij != null && dij.finished && dij.route != null){
      s.text(dij.show(), 20, 100);
    }
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

