-- no issue here Sort heuristic dynamic change bug as per neighbour
fixed, wasn't getting saved because of an incorrect temp change - Look at broadcast of cost mode as it is not setting when loaded
also save solver method with graph so we can automatically go to that mode on load

reject anything that is not a .graph file to avoid infinite hangs