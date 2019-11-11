/*

*/

export function astar(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    // if unvisitedNodes.length is null or false or 0..., any falsy, return false
    while (!!unvisitedNodes.length) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        // If we encounter a wall, we skip it.
        if (closestNode.isWall) continue;
        // If the closest node is at a distance of infinity,
        // we must be trapped and should therefore stop.
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === finishNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode, grid);
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

// // A* finds a path from start to goal.
// // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
// function A_Star(start, goal, h)
// // The set of discovered nodes that may need to be (re-)expanded.
// // Initially, only the start node is known.
// openSet:= { start }

// // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
// cameFrom:= an empty map

// // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
// gScore:= map with default value of Infinity
// gScore[start] := 0

// // For node n, fScore[n] := gScore[n] + h(n).
// fScore:= map with default value of Infinity
// fScore[start] := h(start)

// while openSet is not empty
// current:= the node in openSet having the lowest fScore[] value
// if current = goal
//             return reconstruct_path(cameFrom, current)

// openSet.Remove(current)
// for each neighbor of current
// // d(current,neighbor) is the weight of the edge from current to neighbor
// // tentative_gScore is the distance from start to the neighbor through current
// tentative_gScore:= gScore[current] + d(current, neighbor)
// if tentative_gScore < gScore[neighbor]
//                 // This path to neighbor is better than any previous one. Record it!
//                 cameFrom[neighbor] := current
// gScore[neighbor] := tentative_gScore
// fScore[neighbor] := gScore[neighbor] + h(neighbor)
// if neighbor not in openSet
// openSet.add(neighbor)

// // Open set is empty but goal was never reached
// return failure