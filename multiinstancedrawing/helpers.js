//returns true if vertex is inside dimensions of sketch  
function insketch(s, vert){
    return  vert.x >= 0 && vert.x < s.width &&
            vert.y >= 0 && vert.y < s.height;
}