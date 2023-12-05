/*
message types with comments showing data formats
*/
class msgT{
    //data {x:999,y:999};
    static playerData = "playerData";
    //data {col:[r,g,b]};
    static colour = "colour";
}
class MsgBus{
    static #subs = {};
    static sub(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks === undefined) {
            callbacks = [];
        }
        callbacks.push({handler,instance})
        this.#subs[messageType] = callbacks;
    }
    static dropall(messageType){
        if (messageType !== undefined){
            this.#subs[messageType] = undefined;
        } else {
            this.#subs = {};
        }
    }
    
    static drop(messageType, handler, instance){
        let callbacks = this.#subs[messageType];
        if (callbacks != null) {
            let p = 0;
            while (p < callbacks.length && callbacks[p].handler !== handler && callbacks[p].instance !== instance ){
                p++;
            }
            if (p < callbacks.length) {   
                callbacks.splice(p,1);
                this.#subs[messageType] = callbacks;
            } 
        }
    }

    static send(messageType, data){
        let callbacks = this.#subs[messageType];
        if (callbacks !== undefined) {
            for (let p = 0; p < callbacks.length; p++){
                let {handler,instance} = callbacks[p];
                handler.call(instance, data);
            }
        }
    }
}