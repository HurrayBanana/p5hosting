//random int between upper and lower bounds
function ranI(low,high){
    return low + Math.floor(Math.random()*(high-low));
  }
  //random float between upper and lower bounds
  function ranF(low,high){
    return low + Math.random()*(high-low);
  }

  function makenodes(sketch, g, num, w, h){
      for (let p = 0; p < num; p++){
        ch = pick.nextName;
        let n = new SolverNode(ranI(50,w-50),ranI(50,h-50),ch,
          10);
        g.AddNode(n);
        pick.refresh(g);
      }
      //bodge
      g.startNode = g.g[0];
      g.goalNode = g.g[g.g.length-1];
  }
  
  function addrandomfriends(g,maxN,minG, maxG){
      for (let p = 0; p < g.length; p++){
      //make some neighbours for each
      nb = [];
      for (let q = 0; q < ranI(1,( g.length > maxN ? 4 : g.length - 1)); q++){
        let qp = ranI(0, g.length - 1);
        if (!nb.includes(qp))
          nb.push(qp);
      }
      for (let q = 0; q < nb.length; q++){
        //don't link to myself
        if (nb[q] != p){
          g[p].addNeighbour(g[nb[q]],ranI(minG,maxG));
        }
      }
    }
  }
  //determines which if any neighours exist
  //involving this node and/or the selected node
  function neighbourRemovalVisibility(n, act){
    let ihtml = "";
    ihtml = n.neighbour.length > 0 ? "[" + n.name + " has neighbours] " : n.name + " has no neighbours] " ;
    
    if (act != null && n.name != act.name){
      ihtml += n.neighbourExists(n, act) ? "[" + n.name + " has " + act.name + " as a neighbour] " : "[" + n.name + " does not have " + act.name + " as a neighbour] ";
      ihtml += act.neighbourExists(act, n) ? "[" + act.name + " has " + n.name + " as a neighbour] " : "[" + act.name + " does not have " + n.name + " as a neighbour] ";
    }
    //bugger enter div for testing
    let e = document.getElementById('removenode');
    e.innerHTML = ihtml;
  }

  function hidecontainer(id){
    let el = document.getElementById(id);
    el.style.display = "none";  
  }
  function showcontainer(id){
    let el = document.getElementById(id);
    el.style.display = "block";  
  }
  function filenameSelect(id){
    textentryactive = true;
    id.className = "editname";
    //let b = document.getElementById(id);
    //b.className = "editname";
  }
  function filenameDone(id){
    textentryactive = false;
    id.className = "viewname";
    //let b = document.getElementById(id);
    //b.className = "viewname";
  }
  function setTextboxValue(id, value){
    let b = document.getElementById(id);
    b.value = value;
  }
  function getTextboxValue(id){
    let b = document.getElementById(id);
    return b.value;
  }

  function insketcharea(s,x,y, rightBorder){
    return  x >= 0 && 
            x<= s.width - (rightBorder === undefined ? 0: rightBorder) &&
            y >= 0 &&
            y <= s.height;
  }

  /*
  builds any dynamically constructed html elements (like combo boxes)
  */
  function setDynamicHTML(){
    let cb = document.getElementById("cheuristicmode");
    cb.value = 0;
    cb.innerHTML =  HeuristicMethod.available[0].name();   
  }
  function cycleAndSet(id, arr){
    id.value = (parseInt(id.value) + 1) % arr.length;
  }
  function setHeuristic(value){
    this.value = value;
    this.innerHTML = HeuristicMethod.available[value].name();
  }
  /* needs to process members of controls div to register their events
    that could be autoamtically done with data- attributes
  */
  function registertoggles(){
    MsgBus.sub(msgT.arrowschanged, binaryset, document.getElementById("barrows"));
    MsgBus.sub(msgT.duplicateschanged, binaryset, document.getElementById("bduplicates"));
    MsgBus.sub(msgT.costmodechanged, binaryset, document.getElementById("bcostmode"));
    MsgBus.sub(msgT.shownodecostchanged, binaryset, document.getElementById("bshownodecost"));
    MsgBus.sub(msgT.solvemethodchanged, binaryset, document.getElementById("bsolvemethod"));
    MsgBus.sub(msgT.solvestylechanged, binaryset, document.getElementById("bsolvestyle"));
    MsgBus.sub(msgT.solvehistorychanged, binaryset, document.getElementById("bsolvehistory"));
    MsgBus.sub(msgT.consolechanged, binaryset, document.getElementById("bconsole"));
    MsgBus.sub(msgT.divisorChange, showDivisor, document.getElementById("rdivisorlabel"));
    MsgBus.sub(msgT.divisorChange, setDivisorUI, document.getElementById("rdivisor"));
    MsgBus.sub(msgT.setmodechanged, binaryset, document.getElementById("bsetmode"));
    MsgBus.sub(msgT.helpChanged, binaryset, document.getElementById("bhelp"));
    MsgBus.sub(msgT.heuristic, setHeuristic, document.getElementById("cheuristicmode"));
    MsgBus.sub(msgT.pickerChanged, binaryset, document.getElementById("bpicker"));
  }
  function regsiterOverHelpers(){
    MsgBus.sub(msgT.over_helper, showcontext, document.getElementById("showcontext"));
  }

  function showcontext(data){
    this.innerHTML = data.m;
    contextcounter = data.t;
  }
  function setpara(content){
    return "<p class='contextline'>" + content + "</p>";
  }
  function setspan(pre, action, content, post){
    return "<span class='contextspan'>" + pre + "<span class='actionkey'>" + action + "</span>" + content + post +"</span>";
  }

  /*
  function sa(z){
    let q="";
    z.forEach(element => {
      q+=string.charas
    });
  }*/
  function setDivisorUI(value){
    this.value = value;
  }
  function showDivisor(value){
    this.innerHTML = value;
  }
  // value of this is passed when MsgBus.sub is registered (3rd parameter)
  //picks on of two choices
  function binaryset(data){
    //const {state,txtT,txtF} = data; - could do this
    this.innerHTML = data.state ? data.txtT : data.txtF;
    this.className = "button" + data.state.toString().toLowerCase();
  }
  
  function getSpan(content, classname){
    return "<span " + 
    (classname !== undefined ? "class=' " + classname + "'" : "") +
    ">" + content + "</span>";

  }

  function IframeFrom(url, height, width){
    let s = "<iframe src='" + url + "'" + 
    " title='notes' " + 
    "height='" +height + "' " +
    "width='" + width + "'><iframe>";
    return s;
  }

