//implements a simple text console for output areas
//basic for now but can easily add scroll controls
class con{
    #On = true;
    #line=[];
    #start = 0;
    #rows = 10;
    #myelement;
    constructor(element, rows){
        this.#myelement = element;
        this.#rows = rows;
        this.log("====> console starting <====");
        this.On();

    }
    get Visible() {return this.#On;}
    set Visible(value) {this.#On = value;if (value) this.show();else this.pause();}
    On(){this.#On = true;this.show();}
    Off(){this.#On = false;this.pause();}

    log(t){
        this.#line.push(t);
        if (this.#On){
            this.#myelement.innerHTML += "</br>" + t;
            this.#myelement.scrollTop = this.#myelement.scrollHeight;  
        }         
    }

    show(){
        //let start = this.#rows > this.#line.length ? 0 : this.#line.length - this.#rows;
        let start = 0;
        //let count = (this.#line.length - start) - 1;
        this.#myelement.innerHTML = this.#line[0];
        for (let p = 1; p < this.#line.length; p++){
            this.#myelement.innerHTML += "</br>" + this.#line[p];
        }
		this.#myelement.scrollTop = this.#myelement.scrollHeight;
    }
    pause(){
        this.#myelement.innerHTML = "====> console output paused <==== [h to resume]";
    }
}