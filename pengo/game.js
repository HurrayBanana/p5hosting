/** contains all game control elements */
class Game {
    map;
    count
    pause = 300
    longesttunnel = 0
    constructor(){
        this.map = new PengoMap();
        this.count = this.pause
        this.map.buildnew()
    }

    /**
     * if a maze has been generated and the display delay has elapsed then start a new maze
     */
    update(){
        rng.next()
        if (this.map.longest > this.longesttunnel){
            this.longesttunnel = this.map.longest
        }
        if (this.map.state == PengoMode.WAITING){
            if (--this.count < 0){
                this.count = this.pause
                this.map.buildnew()
            }
        } else{
            this.pause = parseInt(document.getElementById("mzgenwait").value)
            this.count = this.pause
        }
        if (this.alpha < 0.05){
            this.colour = Engine.cols3bit[(Math.random() * (Engine.cols3bitlen-1)) | 0 ]
        }
        if (this.alpha < 0.05 || this.alpha > 1){
            this.dalpha = -this.dalpha
        }
        this.alpha += this.dalpha
    }
    alpha = 1
    dalpha = -0.005
    colour = Engine.cols3bit[0]
    /**
     * show status of maze delay, if the countdown is underway
     */
    draw(){
        push();
        let col = color(this.colour[0] , this.colour[1], this.colour[2], this.alpha * 255)
        fill(col)
        textAlign(RIGHT,BOTTOM)
        textSize(20)
        text("created by Hurray Banana October 2024", Engine.viewWidth - 10, Engine.viewHeight - 10)
        fill(255);
        textSize(12)
        textAlign(LEFT,BOTTOM);

        text("Longest tunnel made overall :" + this.longesttunnel, 10, Engine.viewHeight - 10);
        pop();
        if (this.count < this.pause){
            push();
            fill(255);
            textAlign(CENTER,BOTTOM);

            text("frames till next genration :" + this.count, Engine.viewWidth/2,Engine.viewHeight);
            pop();
        }
    }
}