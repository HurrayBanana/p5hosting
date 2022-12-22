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
    nameInput.value(graph.name);
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
    nameInput = s.createInput('');
    nameInput.position(5, 5);
    nameInput.size(200);
    nameInput.input(s.nameChanged);
    //nameInput.value("brian");
    //nameInput.focus
  }
  s.nameChanged=()=> {
    co.log('you are typing: ', nameInput.value());
    graph.name = nameInput.value();
  }
/*
  rdmethod = createRadio();
  rdmethod.option('0','Next available position');
  rdmethod.option('1','overflow');
  rdmethod.selected('1');
  rdmethod.position(200,10);
  rdmethod.mouseClicked(methodchanged);

  tbwords = createElement('textarea');
  tbwords.attribute('rows',5);
  tbwords.style('resize','none');
  tbwords.position(10,35);
  tbwords.size(width - 50);
  tbwords.value('Enter a series of words. Each one will be entered into the hash table, duplicates will be ignored, maximum unique words is 100');
  tbwords.input(typed);
*/

  

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
    //if (once > 0){
    //  once--;
    //  co.log(graph.name);  
    //}
    //if (nameInput.value() != graph.name){
    //  nameInput.value(graph.name);
    //}
    graph.update(s);
  }
//let once = 2;
  s.generalUI = (g) => {
      if (inpM.kPressed(kH) && !insketcharea(s, s.mouseX, s.mouseY)){
        co.Visible = !co.Visible;
      }
      if (inpM.kPressed(kH) && insketcharea(s, s.mouseX, s.mouseY)){
        graph.toggleDuplicates();
      }
      if (inpM.kPressed(kE)){
        g.name = nameInput.value();
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
      if (inpM.kPressed(kA)){
        graph.toggleArrows();
      }
  }
  s.newGraph=(g)=>{
    graph = g;
    g.centre(s, true);
    nameInput.value(g.name);
  }    
  s.draw = () => {
    s.logic();
    s.background(cBACK);
    graph.draw(s);
    //s.drawkeys();
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

