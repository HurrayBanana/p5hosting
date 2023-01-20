class filestuff{
    static picker = null;
    static #loading = null;
    static #onceloaded = null;

    static setHandler(loader){
        filestuff.picker = document.getElementById('upload');
        filestuff.picker.onchange = loader;
    }
    static setHandlerAndClick(loader){
        this.setHandler(loader);
        filestuff.picker.click();
    }    
    //need name giving code
    static arrStringFromGraph(s, g)
    {
        //let arr=g.asArrayString();
        let arr=GCoding.exportGraph(g);
        const w = s.createWriter(g.name + '.graph');
        co.log('writing file [" + g.name + "] contents follow');
        for (let p=0; p < arr.length; p++){
            w.print(arr[p]);
            co.log(arr[p]);
        }

        w.close();
        w.clear();
    }
    static qsFromGraph(s, g){
        co.log("graph encoded");
        let arr=GCoding.encodeGraph(g);
        let qs="?hb=";
        for (let p = 0; p < arr.length; p++){
            let b = btoa(arr[p]);
            co.log(b + " {" + atob(b) + "}");
            qs += (p==0?"":"!") + b;
        }
        co.log("full qs len:" + qs.length);
        //co.log(qs);
    }
    static #wordset = [
        "class","cost","deferred","draw","true",
        "protect","false","constructor","this","dont","draw","false",
        "same","return","parent","node","return","graph","life","time","count",
        "static","passthrough","untitled","start","null","arrows","need",
        "this","can","edit","different","direction","neighbours",
        "duplicates","show","works","dynamic","distances",
        "get","arrows","not","set","goal","active","over","size","length",
        "centre","keep","aspect","let","calc","extents","width","height",
        "scale","attempt","scaling","with","single","item","undefined",
        "only","shrink","Math","floor","toggle","part","rendering","lines","remove","dupe",
        "written","object","drawing","update","position","log","name",
        "splice","takes","string","from","file","produces","const","parts","parse",
        "lower","case","source","dest","query","fatal",
        "error","reading","exists","attempt","pressed","sketch","area","mouse",
        "modify","active","push","pick","released","outputs","output"
      ];
      static #pickword(){
        let p = ranI(0,filestuff.#wordset.length-1);
        while (filestuff.#lastpicks.includes(p)){
          p = ranI(0,filestuff.#wordset.length-1);
        }
        filestuff.#lastpicks.push(p);
        if (filestuff.#lastpicks.length > 20) {
            filestuff.#lastpicks.splice(0,1);
        }
        return filestuff.#wordset[p];
      }
      static getnewName(upper){
        if (upper === undefined){
          return filestuff.#pickword()+filestuff.#pickword()+filestuff.#pickword();
        } else {
              let a = [filestuff.#pickword(),filestuff.#pickword(),filestuff.#pickword()];
              return filestuff.caps(a);
        }
      }
      static #lastpicks = [];
      static splitAndCaps(s){
        return filestuff.caps(s.split(" "));
      }
      static caps(arr){
        let s = "";
        for (let p = 0; p < arr.length; p++){
          s = s + arr[p].substring(0,1).toUpperCase() +arr[p].substring(1,arr[p].length);
        }
        return s;
      }
}