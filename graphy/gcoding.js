class GCoding{
    static getSglValFromData(data, pos){
        if (pos === undefined) { pos = 1;}
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }
    static getSglBoolFromData(data, pos){
        if (pos === undefined) { pos = 1;}
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos].toLowerCase() == "true";
        }
    }
    static getSglStringFromData(data, pos){
        if (pos === undefined) { pos = 1;}
        let parts = data.split(",");
        if (parts.length <= pos){
            co.log("fatal error reading:" + data);
        } else {
            return parts[pos];
        }
    }    
    static name = {
        encode:function(g, arr){
            arr.push("name," + g.name);
        },
        encodeMin:function(g, arr){
            arr.push("t" + g.name);
        },
        decode:function(g, data){
            g.name = GCoding.getSglStringFromData(data)},
        name:function(){return "name"},
        nameMin:function(){return "t"},
    }
    static divisor = {
        encode:function(g, arr){
            arr.push("divisor," + g.dynamicDivisor);
        },
        encodeMin:function(g, arr){
            arr.push("/," + g.dynamicDivisor);
        },
        decode:function(g, data){
            MsgBus.send(msgT.divisorChange, GCoding.getSglValFromData(data))
        },
        name:function(){return "divi"},
        nameMin:function(){return "/"},
    }
    static cost = {
        encode:function(g, arr){
            arr.push("costnode," + g.showNodeCost);
        },
        encodeMin:function(g, arr){
            arr.push("£," + g.showNodeCost.toString().slice(0,1));
        },
        decode:function(g, data){
            g.showNodeCost =GCoding.getSglBoolFromData(data);
        },
        name:function(){return "cost"},
        nameMin:function(){return "£"},
    }
    static setsstyle = {
        encode:function(g, arr){
            arr.push("setstyle," + g.setModesimple);
        },
        encodeMin:function(g, arr){
            arr.push("[," + g.setModesimple.toString().slice(0,1));
        },
        decode:function(g, data){
            g.setmodesimple = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "sets"},
        nameMin:function(){return "["},
    }
    static duplicates = {
        encode:function(g, arr){
            arr.push("dupe," + g.duplicates);
        },
        encodeMin:function(g, arr){
            arr.push("d," + g.duplicates.toString().slice(0,1));
        },
        decode:function(g, data){
            g.duplicates = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "dupe"},
        nameMin:function(){return "d"},
    }
    static arrow = {
        encode:function(g, arr){
            arr.push("arrow," + g.showArrows);
        },
        encodeMin:function(g, arr){
            arr.push(">," + g.showArrows.toString().slice(0,1));
        },
        decode:function(g, data){
            g.showArrows = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "arro"},
        nameMin:function(){return ">"},
    }
    static dynamic = {
        encode:function(g, arr){
            arr.push("dynamic," + g.isDynamicCost);
        },
        encodeMin:function(g, arr){
            arr.push("*," + g.isDynamicCost.toString().slice(0,1));
        },
        decode:function(g, data){
            g.dynamic = GCoding.getSglBoolFromData(data);
        },
        name:function(){return "dyna"},
        nameMin:function(){return "*"},
    }
    static heuristic = {
        encode:function(g, arr){
            arr.push("heuristic," + g.Hmethod.name());
        },
        encodeMin:function(g, arr){
            arr.push("%," + g.Hmethod.name());
        },
        decode:function(g, data){
            let p = HeuristicMethod.positionFromName(GCoding.getSglStringFromData(data));
            MsgBus.send(msgT.heuristic,p);
        },
        name:function(){return "heur"},
        nameMin:function(){return "%"},
    }
    static node = {
        encode:function(g, arr){
            for (let p = 0; p < g.size; p++) {
                arr.push(g.g[p].asString);
            }
        },
        encodeMin:function(g, arr){
            for (let p = 0; p < g.size; p++) {
                arr.push(g.g[p].asString.replace("node","n").replace("false","f").replace("true","t"));
            }
        },
        decode:function(g, data){
            g.AddNodeString(data);
        },
        name:function(){return "node"},
        nameMin:function(){return "n"},
    }
    static neighbour = {
        encode:function(g, arr){
            for (let p = 0; p < g.size; p++) {
                for (let q = 0; q < g.g[p].neighbour.length; q++) {
                    arr.push(g.g[p].neighbour[q].asString);
                }
            }
        },
        encodeMin:function(g, arr){
            for (let p = 0; p < g.size; p++) {
                for (let q = 0; q < g.g[p].neighbour.length; q++) {
                    arr.push(g.g[p].neighbour[q].asString.replace("neig","-").replace("false","f").replace("true","t"));
                }
            }
        },
        decode:function(g, data){
            g.AddNeighbourString(data);
        },
        name:function(){return "neig"},
        nameMin:function(){return "-"},
    }
    static components  = [
        GCoding.name, GCoding.divisor, GCoding.cost, GCoding.setsstyle,
        GCoding.duplicates, GCoding.arrow, GCoding.dynamic, GCoding.heuristic,
        GCoding.node, GCoding.neighbour
    ];

    //reduces the dataset size ready for b64 coding
    static encodeGraph(g){
        let arr=[];
        for (let p = 0; p < GCoding.components.length; p++){
            GCoding.components[p].encodeMin(g, arr);
        }
        return arr;        
    }
    static exportGraph(g){
        let arr=[];
        for (let p = 0; p < GCoding.components.length; p++){
            GCoding.components[p].encode(g, arr);
        }
        return arr;
    }
    static importGraph(g, lines){
        for (let k = 0; k < lines.length; k++){
            let p = 0;
            let code = lines[k].slice(0,4);
            co.log("...[" + lines[k] + "]");
            while (p < GCoding.components.length && code != GCoding.components[p].name())
            {p++;}
            if (p < GCoding.components.length){
                GCoding.components[p].decode(g, lines[k]);
            } else {
                co.log("unknown graph data:[" + lines[k] + "]");
            }
        }
    }
}
