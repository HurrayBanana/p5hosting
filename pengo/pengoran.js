/**
 * implements the register pair from z80
 */
class RegPair{
    #hl = 0
    get HL(){
        return this.#hl
    }
    set HL(value){
        this.#hl = value & 0xffff
    }
    get HLhex(){
        return this.HL.toString(16).padStart(4,"0")
    }
    constructor(init){
        this.#hl = init & 0xffff
    }
    get H(){
        return (this.#hl &0xff00) >> 8
    }
    set H(value){
        this.#hl = (this.#hl & 0x00ff) | ((value & 0xff) << 8)
    }
    get L(){
        return this.#hl & 0x00ff
    }
    set L(value){
        this.#hl = (this.#hl  & 0xff00) | (value & 0xff)
    }

    get Hhex(){
        return this.H.toString(16).padStart(2,"0")
    }
    get Lhex(){
        return this.L.toString(16).padStart(2,"0")
    }
}
/**
 * implements the random number generator from Pengo, mimicing the z80 assembler implementation
 */
class PengoRandom{
    reg

    constructor(seed){
        this.reg = new RegPair(seed)
    }
    seed(seed){
        this.reg = new RegPair(seed)
    }
    /**
     * returns a byte in the PRNG sequence
     * masked to return values 0-3 for use as an ordinal direction - essentially mod 4
     */
    next(){
        let newnum = new RegPair(this.reg.HL << 1)
        newnum.HL += this.reg.HL
        newnum.H += this.reg.L
        this.reg.HL = newnum.HL
        return this.reg.H & 0x03
    }
}

/*
seed the original random number with a value of $365a (random number is stored internally as 16-bit)

rndnum:
    multiply original random number by 2 to create a new random number
    add original random number to new random number
    add low byte of original random number to high byte of new random number
    store new random number 
    on exit register A contains high byte of the new random number and is queried by the caller upon return
*/