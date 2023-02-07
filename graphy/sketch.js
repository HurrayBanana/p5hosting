//uses instance mode for the sketch
//so we can control what element the sketch ends up inside of
//globals

let graph;
//let picklist;
let co;
 stockContext = "<p class='contextline'>context stuff will appear here</p>";
contextcounter = 0;
textentryactive = false;
solveDijkstra = true;
auto = false;
help = false;
printdoc = false;
printcon = true;
let pick;
showpick = true;
let printcheck;
/* END OF GLOBALS */
const s = ( s ) => {
  let cBACK = [220,220,255];
  let cPRNT = [255,255,255];
  let sW = 750;
  let sH = 750;  
  let nameInput;
  let htc;
  let dij = null;
  let astar = null;
  let outputdata = false;
  s.preload = () => {
    //const paramsString = 'q=URLUtils.searchParams&topic=api';
    //const searchParams = new URLSearchParams(paramsString);

    //// Iterating the search parameters
    //for (const p of searchParams) {
    //  console.log(p);
    //console.log(searchParams.has('topic'));               // true
    //console.log(searchParams.get('topic') === "api")
    //}

  }
  s.checkQS=()=>{
    let params = (new URL(document.location)).searchParams;
    let name = params.get("hbq");
    co.log("QS contained[" + name +"]");
  }
  s.loaded=()=>{

  }

  s.setup = () => {
    //ref to canvas
    var can = s.createCanvas(sW, sH);
    s.setHTMLcanvas();
    printcheck = document.getElementById("controls");
    let p = document.getElementById("console");
    co = new con(p,30);
    //co.Off();
    s.createUI();
    graph = new Graph();
    pick = new Picker(graph, sW-16);

    co.log("made:" + graph.name);
    setTextboxValue("filename", graph.name);
    
    s.buildgraph(graph);
    //create mouse event only triggered over canvas area
    can.mousePressed(s.canvasdown);
    htc = document.getElementById("console");
    s.broadcastAllStates();
    MsgBus.send(msgT.divisorChange,10);//bodge need a sensible solution
    s.checkQS();
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
    MsgBus.sub(msgT.droppedNewNode, s.newNodeDropped, s);
    MsgBus.sub(msgT.printdoc, s.printnow, s);
    MsgBus.sub(msgT.picker, s.togglePick,s);
  }

  s.togglePick=()=>{
    showpick = !showpick;
    MsgBus.send(msgT.pickerChanged, {state:showpick, txtT:"hide", txtF:"show"});
  }
  s.printnow=(data)=>{
    printdoc = true;
    printcon = data;
  }

  s.clearGraph=()=>{
    graph = new Graph();
    pick.graph = graph;
  }
  s.toggleHelp=()=>{
    help = !help;
    if (help){
      if (auto){
        MsgBus.send(msgT.solvestyle,this);
      }
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
    MsgBus.send(msgT.hi_liteclear);
    MsgBus.send(msgT.reset,this);

    if (auto && help){
      MsgBus.send(msgT.help,this);
    }
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
    co.log("-> solver reset");
  }
  s.broadcastAllStates=()=>{
    s.broadcastSolveMethod();
    s.broadcastSolveStyle();
    s.broadcastHelp();

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
    s.centregraph(g);
  };
  s.centregraph=(g)=>{
    g.centre(s, 105, true);
  }
  s.logic = () => {
    
    contextcounter++;
    if (contextcounter == 15){
      MsgBus.send(msgT.over_helper, {m:stockContext,t:15});
    }
    
    s.generalUI(graph);

    graph.update(s);
    pick.update(s);

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
        filestuff.qsFromGraph(s,g);
      }
      if (inpM.kPressed(kSlashQmark)){
        MsgBus.send(msgT.help);
      }
      if (inpM.kPressed(kA) && !insketcharea(s, s.mouseX, s.mouseY)){

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
        s.centregraph(graph);

        //graph.centre(s, 40, true);
      }
      if (inpM.kPressed(kA) && insketcharea(s, s.mouseX, s.mouseY)){
        MsgBus.send(msgT.arrows);
      }
      if (inpM.kPressed(kH) && insketcharea(s, s.mouseX, s.mouseY)){
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
    s.broadcastAllStates();
    s.centregraph(g);

//    g.centre(s, 40, true);
    setTextboxValue("filename",g.name);
    pick.graph = graph;

  }  
  s.draw = () => {
    s.logic();
    s.background(printdoc ? cPRNT:cBACK);
    
    if (printdoc){
      graph.printing();
    }
    graph.draw(s);
    if (printdoc){
      graph.finishedprinting();
      
    }
    if (!printdoc && showpick){
      pick.show(s);
    }
    //dave = s.text;
    //dave("brian",0,200);

    s.after();
  };
  s.after=()=>{
    inpM.update();
    graph.broadcastactingstate(s);
    //check for printing after render happens
    //so we can turn off node picker first 
    if (printdoc){
      printdoc = false;
      window.print();
    }
  }
  s.drawkeys=()=>{
    s.text(inpM.getKeyState(), 10,10);
  }
  
  //mouse button down event only over canvas
  s.canvasdown=()=>{
    if (graph.pressed(s, pick.nextName)) {
      pick.refresh();
    }
    pick.pressed(s);
  }

  s.newNodeDropped=(data)=>{
    let n = new SolverNode(data.x, data.y, data.name, 0, 0);
    graph.AddNode(n);
    pick.refresh();
  }

  s.mouseReleased = () => {
    graph.released(s);
    pick.released(s);
  };
};let myp5 = new p5(s, 'sketcharea');
