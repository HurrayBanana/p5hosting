class Pengo extends Sprite{
    constructor(){
        super()
        Engine.spM.add(this)
        //facing right
        this.frame.define(txsprites, new Rectangle(67,4,16,16)) // up
        this.frame.define(txsprites, new Rectangle(19,4,16,16)) // down
        this.frame.define(txsprites, new Rectangle(35,4,16,16)) // left
        this.frame.define(txsprites, new Rectangle(99,4,16,16)) // right
        //crush up
        this.frame.define(txsprites, new Rectangle(67,20,16,16)) // 4
        this.frame.define(txsprites, new Rectangle(67+16,20,16,16))// 1
        //crush down
        this.frame.define(txsprites, new Rectangle(3,20,16,16)) // 6
        this.frame.define(txsprites, new Rectangle(3+16,20,16,16))// 1
        //crush left
        this.frame.define(txsprites, new Rectangle(35,20,16,16)) // 8
        this.frame.define(txsprites, new Rectangle(35+16,20,16,16))// 1
        //crush right
        this.frame.define(txsprites, new Rectangle(99,20,16,16)) // 10
        this.frame.define(txsprites, new Rectangle(99+16,20,16,16))// 1
        this.scaleTo = {w:32,h:32}
        this.layer = Engine.layer(2)
    }
    crush(position, direction){
        this.x = position.x
        this.y = position.y
        let s;
        if (direction.isleft){s = 8}
        else if (direction.isright){s = 10}
        else if (direction.isup){s = 4}
        else if (direction.isdown){s = 6}
        this.frame.animateonrate(0.1, LastAction.repeat, s, s + 1)
    }
    stand(position, direction){
        this.x = position.x
        this.y = position.y
        let s
        if (direction === undefined){
            s = 3
        } else {
            if (direction.isleft){s = 2}
            else if (direction.isright){s = 3}
            else if (direction.isup){s = 0}
            else if (direction.isdown){s = 1}
        }
        this.frame.animateonrate(0,LastAction.stop, s, s)
    }
}
class SnowBee extends Sprite{
    constructor(location){
        super()
        Engine.spM.add(this)
        this.frame.define(txsprites,new Rectangle(99,132,16,16))
        this.frame.define(txsprites,new Rectangle(99+16,132,16,16))
        this.frame.define(txsprites,new Rectangle(227,132,16,16))
        this.frame.define(txsprites,new Rectangle(227+16,132,16,16))
        this.frame.define(txsprites,new Rectangle(483,132,16,16))
        this.frame.define(txsprites,new Rectangle(483+16,132,16,16))
        this.frame.define(txsprites,new Rectangle(99,212,16,16))
        this.frame.define(txsprites,new Rectangle(99+16,212,16,16))
        this.frame.define(txsprites,new Rectangle(227,212,16,16))
        this.frame.define(txsprites,new Rectangle(227+16,212,16,16))
        this.frame.define(txsprites,new Rectangle(355,212,16,16))
        this.frame.define(txsprites,new Rectangle(355+16,212,16,16))
        this.frame.define(txsprites,new Rectangle(611,212,16,16))
        this.frame.define(txsprites,new Rectangle(611+16,212,16,16))

        this.scaleTo = {w:32,h:32}
        let bee = 2 * ((Math.random() * 7) | 0)
        this.frame.animateonrate(0.25, LastAction.repeat, bee, bee+1)
        this.x = location.x
        this.y = location.y
        this.layer = Engine.layer(1)
    }
}
class CrushedBlock extends Sprite{
    constructor(location){
        super()
        Engine.spM.add(this)
        this.frame.define(txtiles,new Rectangle(710,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*1,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*2,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*3,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*4,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*5,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*6,50,16,16))
        this.frame.define(txtiles,new Rectangle(710+16*7,50,16,16))
        this.scaleTo = {w:32,h:32}
        this.frame.animateonrate(0.10, LastAction.kill)
        this.x = location.x
        this.y = location.y
        this.layer = Engine.layer(1)
    }
}

class PengoMode {
    static PICKING = "picking"
    static TUNNELLING = "tunneling"
    static WAITING = "waiting"
    static MOVE = "move"
}

class PengoMap extends Tilemap{

    /** 
     * @type {PengoMode}
     */
    state = PengoMode.WAITING
    #generating = false;
    #loc;
    #delay = 0
    waitframes = 0
    activePosition
    current
    static BLANK = 0
    static ICE_BLOCK = 1
    longest = 0
    currentlength = 0
    sizeW = 35
    sizeH = 23
    pengo
    constructor(){
        super();
        Engine.tilemapM.add(this);
        // this.tileadd(txpengo, new Rectangle(0,8,16,16));//blank
        // this.tileadd(txpengo, new Rectangle(24,32,16,16));//ice block
        this.tileadd(txtiles, new Rectangle(200,10,16,16));//blank
        this.tileadd(txtiles, new Rectangle(430,10,16,16));//ice block
        //new tilemap method
        this.setEmptymap(this.sizeH, this.sizeW, PengoMap.ICE_BLOCK, {w:2,h:2})

        //don't allow out of bounds indexes to wrap the tilemap
        this.wrapTileInterrogation = false;
    }

    /**
     * refreshes the map and starts a new build process
     */
    buildnew(){
        this.sizeW = parseInt(document.getElementById("mzwidth").value)
        this.sizeH = parseInt(document.getElementById("mzheight").value)
        
        this.activePosition = vector2.zero
        this.state = PengoMode.PICKING
        this.setEmptymap(this.sizeH, this.sizeW, PengoMap.ICE_BLOCK, {w:2,h:2})
        this.current = new vector2(0, this.rows - 1)
        this.setMapGraphic(this.current, PengoMap.EMPTY)

        this.centreInmainview()
        this.longest = 0
        Engine.spM.removeall()

        this.pengo = new Pengo()

    }

    /**
     * performs the next step (one step in the build process)
     */
    step(){
        switch (this.state){
            case PengoMode.PICKING: this.picking();break
            case PengoMode.TUNNELLING:this.tunnelling();break
            case PengoMode.MOVE:this.moveon();break;
        } 
    }
    /**
     * looks to see if there is an ice block two positions away from current start point
     * biased towards up and down initial movement
     */
    picking(){
        this.activePosition.x = this.current.x
        this.activePosition.y = this.current.y
        this.pengo.stand(this.pixelcentre(this.activePosition))

        if (this.empty(this.activePosition)){
            if (this.ice(this.activePosition, TileDirection.UP, 2))
                this.startTunnel()
            else if (this.ice(this.activePosition, TileDirection.DOWN, 2))
                this.startTunnel()
            else if (this.ice(this.activePosition, TileDirection.LEFT, 2))
                this.startTunnel()
            else if (this.ice(this.activePosition, TileDirection.RIGHT, 2))
                this.startTunnel()
            else {
                this.state = PengoMode.MOVE
            }
        } else {
            this.state = PengoMode.MOVE
        }
    }

    /**
     * lays a red marker down to indicate a position that a tunnel operation started from
     */
    startTunnel() {
        // this.setMapGraphic(this.current, PengoMap.EMPTY)
        // this.highlight(this.current, { time: 200.2, alpha: 1, layer: Engine.layer(0) }, new Tilehigh([255, 0, 0]))
        new SnowBee(this.pixelcentre(this.activePosition))
        this.state = PengoMode.TUNNELLING

        this.currentlength = 0
    }

    /**
     * moves along by 2 blocks or if at the end of a row moves up 2 rows looking for a start position
     */
    moveon() {
        this.current.x += 2
        if (this.current.x < this.cols){
            this.pengo.stand(this.pixelcentre(this.activePosition))
            // this.highlight(this.current, { time: 0.5 + this.waitframes/10, alpha: 1, layer: Engine.layer(0) }, new Tilehigh([255, 255, 0]))
            this.state = PengoMode.PICKING
        } else {
            this.current.y -= 2
            this.current.x = -2
            if (this.current.y < 0){
                this.state = PengoMode.WAITING
                // Engine.spM.removeall()
            }
        }
        //this.pengo.stand(this.pixelcentre(this.activePosition))
    }

    /**
     * picks a random number and decides to tunnel in that direction is ice exists
     * 
     * note mega inneficient as PRNG may generate a direction that has alread been discarded
     * but that's how the original was written
     * 
     * better to hold to pick from an array of 4 directions, remove each one examined until array is empty
     */
    tunnelling(){
        let working = true
        let move = vector2.zero
        
        //could use the standard random number generator instead of the pengo one
        //let choice = (Math.random() * 4) | 0 // | 0 is bitwise or with zero which forces JS to convert float to int
        let choice = rng.next()  
        
        switch (choice){
            case 0:
                if (this.ice(this.activePosition, TileDirection.UP,2)) {
                    move.y = -1
                }
                break;
            case 1:
                if (this.ice(this.activePosition, TileDirection.DOWN,2)) {
                    move.y = 1
                }
                break;
            case 2:
                if (this.ice(this.activePosition, TileDirection.LEFT,2)) {
                    move.x = -1
                }
                break;
            case 3:
                if (this.ice(this.activePosition, TileDirection.RIGHT,2)) {
                    move.x = 1
                }
                break;
        }

        if (!move.iszero){
            this.pengo.crush(this.pixelcentre(this.activePosition), move)
            this.activePosition.add(move)
            this.setMapGraphic(this.activePosition, PengoMap.EMPTY)
            new CrushedBlock(this.pixelcentre(this.activePosition))
            //this.highlight(this.activePosition,{time:1.1,alpha:1,layer:Engine.layer(0)}, new Tilehigh([0,255,0]))

            let second = this.activePosition.clone
            Engine.eventM.delaycall(10/60, Engine.makeCallback(()=>{
                this.pengo.crush(this.pixelcentre(second), move)}, null));

            this.activePosition.add(move)
            this.setMapGraphic(this.activePosition, PengoMap.EMPTY)
            let third = this.activePosition.clone
            Engine.eventM.delaycall(10/60, Engine.makeCallback(()=>{
                new CrushedBlock(this.pixelcentre(third))}, null));

            let fourth = this.activePosition.clone
            Engine.eventM.delaycall(this.waitframes/60, Engine.makeCallback(()=>{
                this.pengo.stand(this.pixelcentre(fourth),move)}, null));
                    
            //this.highlight(this.activePosition,{time:1.1,alpha:1,layer:Engine.layer(0)}, new Tilehigh([0,255,0]))
            this.currentlength += 2
            if (this.currentlength > this.longest){
                this.longest = this.currentlength
            }
            working = this.pathContinue()
        }
        if (!working) { 
            this.state = PengoMode.MOVE
        }
    }

    /**
     * checks to see if an ice block exists in location or at an offset (if given)
     * @param {vector2|{x:int,y:int}} pos position to check
     * @param {TileDirection} direction ordinal to look for offset along from pos
     * @param {int} distance offset along ordinal to check
     * @returns {bool} true if ice, false if not
     */
    ice(pos, direction, distance){
        if (direction === undefined)
            return this.tileNumfromMap(pos) == PengoMap.ICE_BLOCK
        else
            return this.tileNumfromMapoffset(pos, direction, distance) == PengoMap.ICE_BLOCK
    }
    /**
     * checks to see if an empty tile exists in location or at an offset (if given)
     * @param {vector2|{x:int,y:int}} pos position to check
     * @param {TileDirection} direction ordinal to look for offset along from pos
     * @param {int} distance offset along ordinal to check
     * @returns {bool} true if empty, false if not
     */
    empty(pos, direction, distance){
        if (direction === undefined)
            return this.tileNumfromMap(pos) == PengoMap.EMPTY
        else
            return this.tileNumfromMapoffset(pos, direction, distance) == PengoMap.EMPTY
    }
    /**
     * determines if tunnelling can continue from current location
     * @returns true if a path is possible in any ordinal direction
     */
    pathContinue(){
        return  this.ice(this.activePosition, TileDirection.UP, 2) ||
                this.ice(this.activePosition, TileDirection.DOWN, 2) ||
                this.ice(this.activePosition, TileDirection.LEFT, 2) ||
                this.ice(this.activePosition, TileDirection.RIGHT, 2); 
    }

    /**
     * updates maze generation if delay frame count has elapsed
     */
    update(){
        super.update()
        this.waitframes = parseInt(document.getElementById("mzdelay").value)

        this.#delay--;
        if (this.#delay < 0){
            this.#delay = this.waitframes
            this.step()
        }
    }

    /**
     * show the maze generation state
     */
    draw(){
        super.draw()
        if (this.state != PengoMode.WAITING){
            push();
            fill(255);
            textAlign(CENTER,BOTTOM);
            text("Maze " + this.state , Engine.viewWidth/2,Engine.viewHeight - 10);
            textAlign(RIGHT,TOP);
            text("longest tunnel " + this.longest, Engine.viewWidth - 10, 10);
            textAlign(LEFT,TOP);
            text("current tunnel " + this.currentlength , 10, 10);
            pop();
        }
    }
}