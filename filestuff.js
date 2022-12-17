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
        let arr=g.asArrayString();
        const w = s.createWriter('concept.graph');
        co.log('writing file concept.graph - contents follow');
        for (let p=0; p < arr.length; p++){
            w.print(arr[p]);
            co.log(arr[p]);
        }

        w.close();
        w.clear();
    }

}