# p5hosting
[Graphy application](https://hurraybanana.github.io/p5hosting/graphy/index.html)

This is wip and will contain bugs

### naming
Click graph name (top left of graph area) to change it (have to export the grapj

### Mouse
- click on graph - drop next node
- click on node - selects that node - goes yellow
- hold left button over node - drag and drop node to new place

### Keys
=====
#### Mouse Over console area
- H - hide/show console output
- L - load a graph from local storage
- E - export the current graph (goes to current browser download location)
- C - clear console window
- P - next iteration in current graph solve

#### Mouse Over sketch
- C - centre and scale sketch to canvas (keepsaspect ratio of graph)
- A - toggle Arrows (same as button)
- H - toggle duplicate neighbour costs (same as button)

#### mouse over a node
- T - remove all neighbours of node
- F - remove selected node as a neighbour of this node
- P - remove this node as a neigbour of selected node
- S - set this node as the Start node
- G - set this node as the Goal node
- D - create a directed neighbour from the selected node to this node
- U - create an undirected neighbour (2 way) between this node and the selected node
- X - delete node

#### mouse over neighbour cost
- L - toggles linking of connected nodes in one of the following ways

1. If two separate directed connections are made they are set to duplicate each others costs
1. If a single directed neighbour exists another is created in the opposite direction and linked
1. If a pair of linked neighbours exists they are unlinked and can be costed independantly

- \+ increase the cost for this neighbour travel
- \- decrease the cost for this neighbour travel

#### mouse over heuristic cost (below node)
- \+ increase the cost heuristic for this node to goal node
- \- decrease the cost heuristic for this node to the goal node


