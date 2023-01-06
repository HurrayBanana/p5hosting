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
auto = false;
help = false;

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
    MsgBus.sub(msgT.reset, s.reset, s);
    MsgBus.sub(msgT.clearcon, s.clearconsole, s);
    MsgBus.sub(msgT.load, s.load, s);
    MsgBus.sub(msgT.export, s.export, s);
    MsgBus.sub(msgT.solvestyle, s.toggleSolveStyle, s);
    MsgBus.sub(msgT.cleargraph, s.clearGraph,s);
    MsgBus.sub(msgT.help,s.toggleHelp,s);
  }
  s.clearGraph=()=>{
    graph = new Graph();
  }
  s.toggleHelp=()=>{
    help = !help;
    if (help){
      htc.innerHTML = IframeFrom("info.html", 700,500);
    } else {
      s.clearconsole();
    }
    s.broadcastHelp();
  }
  s.broadcastHelp=()=>{
    MsgBus.send(msgT.helpChanged, {state:help, txtT:"hide", txtF:"show"});
  }
  s.toggleSolveStyle=()=>{
    auto = !auto;
    s.broadcastSolveStyle();
  }
  s.broadcastSolveStyle=()=>{
    MsgBus.send(msgT.solvestylechanged, {state:auto, txtT:"auto", txtF:"step"});
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
    s.reset();
    s.broadcastSolveMethod();
  }
  s.reset=()=>{
    dij = null;
    astar = null;
  }
  s.broadcastAllStates=()=>{
    s.broadcastSolveMethod();
    s.broadcastSolveStyle();
    s.broadcastHelp();

    MsgBus.send(msgT.divisorChange,1);
  }
  s.broadcastSolveMethod=()=>{
    MsgBus.send(msgT.solvemethodchanged, {state:solveDijkstra, txtT:"Dijkstra", txtF:"A *"})
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
    //testing autosolve - this works - sort off
    //hook up properly and astar
    //hook up button
    //now need to record solve history properly so its an array of html entries
    //which can be displayed to the console
    if (auto){
      s.reset();
      if (solveDijkstra){
        solveHistory = [];
        dij = new Dijkstra(graph);
        dij.autoSolve = auto;
        dij.start();
        dij.solve();
        if (graph.solveHistory){
          htc.innerHTML = dij.allHistory;
        } else {
          htc.innerHTML = dij.lastHistory;
        }
      } else {
        astar = new Astar(graph);
        astar.autoSolve = auto;
        astar.start();
        astar.solve();
        if (graph.solveHistory){
          htc.innerHTML =astar.allHistory;
        } else {
          htc.innerHTML =astar.lastHistory;
        }        
      }
    }
  }

  s.generalUI = (g) => {
    if (!textentryactive){
      if (inpM.kPressed(kP)){
        MsgBus.send(msgT.solve);
      }
      if (inpM.kPressed(kD) && !insketcharea(s, s.mouseX, s.mouseY)){
        //s.dijsolve(g);
      }
      if (inpM.kPressed(kSlashQmark)){
        MsgBus.send(msgT.help);
      }
      if (inpM.kPressed(kA) && !insketcharea(s, s.mouseX, s.mouseY)){
        //s.astarsolve(g);
      }
      if (inpM.kPressed(kH) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.Visible = !co.Visible;
      }
      if (inpM.kPressed(kC) && !insketcharea(s, s.mouseX, s.mouseY)){
        s.clearconsole();
      }
      if (inpM.kPressed(kE)&& !insketcharea(s, s.mouseX, s.mouseY)){
        s.export();
      }
      if (inpM.kPressed(kL) && !insketcharea(s, s.mouseX, s.mouseY)){
        s.load();
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

  s.clearconsole=()=>{
    co.clear();
  }
  s.load=()=>{
    Graph.loadGraph(s.newGraph);
  }
  s.export=()=>{
    graph.name = getTextboxValue("filename");
    filestuff.arrStringFromGraph(s, graph);
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
      if (graph.solveHistory){
        htc.innerHTML = dij.allHistory;
      } else {
        htc.innerHTML = dij.lastHistory;
      }
      /*
      if (g.solveHistory){
        co.log(dij.showStateHTML());
      } else {
        htc.innerHTML = dij.showStateHTML();
      }*/
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
      if (graph.solveHistory){
        htc.innerHTML =astar.allHistory;
      } else {
        htc.innerHTML =astar.lastHistory;
      }     
      /*
      if (g.solveHistory){
        co.log(astar.showStateHTML());
      } else {
        htc.innerHTML = astar.showStateHTML();
      }
      */    
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
