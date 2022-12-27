//random int between upper and lower bounds
function ranI(low,high){
    return low + Math.floor(Math.random()*(high-low));
  }
  //random float between upper and lower bounds
  function ranF(low,high){
    return low + Math.random()*(high-low);
  }
  // generates a string name using alphas from a number
  function dblName(p){
      let ch = "";
      let key = Math.floor(p/26);
      //return p < 26 ? char(65+p) :  char(64 + key) + char(65 + p % 26); 
      return p < 26 ? getCh(65+p) :  getCh(64 + key) + getCh(65 + p % 26); 
  }
  function getCh(code){
    return String.fromCharCode(code);
  }

  function makenodes(sketch, g, num, w, h){
      for (let p = 0; p < num; p++){
        ch= dblName(p);
        let n = new SolverNode(ranI(50,w-50),ranI(50,h-50),ch,
          10);
/*        let n = new node(ranI(50,w-50),ranI(50,h-50),ch,
          ranF(-1,1),ranF(-1,1));*/
        g.AddNode(n)
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
  function showPick(name){
    let e = document.getElementById('createfrom');
    e.innerHTML = name;
    e = document.getElementById('destroyfrom');
    //e.innerHTML = name;
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
    let b = document.getElementById(id);
    b.className = "editname";
  }
  function filenameDone(id){
    textentryactive = false;

    let b = document.getElementById(id);
    b.className = "viewname";
  }
  function setTextboxValue(id, value){
    let b = document.getElementById(id);
    b.value = value;
  }
  function getTextboxValue(id){
    let b = document.getElementById(id);
    return b.value;
  }

  function insketcharea(s,x,y){
    return  x >= 0 && 
            x<= s.width &&
            y >= 0 &&
            y <= s.height;
  }

