#### pengo maze generator

Simple visualisation of the pengo maze generation algorithm. This implementation uses the same random number generator and direction picking system, which is very inefficient but good enough to generate the mazes at the start of each round. 
        
The stunned snow bees mark the start points of each of the depth first searches performed by the algorithm.
        
Sometimes you get long delays even when there is an obvious direction to choose because the directions are picked at random, so the same inappropriate direction may be chosen several times.
