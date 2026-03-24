/**
 * algorithms.js
 * Algoritmos de búsqueda BFS y A*
 * Lógica pura sin dependencias del DOM
 */

// ── Algoritmo BFS ─────────────────────────────────────────────
function runBFSLogic(adjList, start, goal) {
    let steps = [];
    let queue = [[start]];
    let visited = new Set([start]);
    
    steps.push({ type: 'init', node: start });

    while (queue.length > 0) {
        let path = queue.shift();
        let node = path[path.length - 1];

        steps.push({ type: 'expand', node, frontier: queue.map(p => p[p.length-1]) });

        if (node === goal) {
            steps.push({ type: 'found', path, cost: path.length - 1 });
            return steps;
        }

        for (let neighborObj of (adjList[node] || [])) {
            let neighbor = neighborObj.node;
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                let newPath = [...path, neighbor];
                queue.push(newPath);
                steps.push({ type: 'discover', node: neighbor, from: node });
            }
        }
    }
    steps.push({ type: 'fail' });
    return steps;
}

// ── Algoritmo A* ──────────────────────────────────────────────
function runAStarLogic(adjList, start, goal, hMap) {
    let steps = [];
    let h = (n) => hMap[n] || 0;
    let gScore = { [start]: 0 };
    let fScore = { [start]: h(start) };
    let openSet = new Set([start]);
    let closedSet = new Set();
    let parent = { [start]: null };

    steps.push({ type: 'init', node: start });

    while (openSet.size > 0) {
        // Seleccionar nodo con menor f(n)
        let current = null;
        openSet.forEach(node => {
            if (current === null || fScore[node] < fScore[current]) current = node;
        });

        steps.push({ type: 'expand', node: current, fValues: {...fScore} });

        if (current === goal) {
            let path = [];
            let curr = goal;
            while (curr !== null) {
                path.unshift(curr);
                curr = parent[curr];
            }
            steps.push({ type: 'found', path, cost: gScore[goal] });
            return steps;
        }

        openSet.delete(current);
        closedSet.add(current);

        for (let neighborObj of (adjList[current] || [])) {
            let neighbor = neighborObj.node;
            if (closedSet.has(neighbor)) continue;

            let tentativeG = gScore[current] + neighborObj.cost;

            if (!openSet.has(neighbor) || tentativeG < gScore[neighbor]) {
                parent[neighbor] = current;
                gScore[neighbor] = tentativeG;
                fScore[neighbor] = gScore[neighbor] + h(neighbor);
                
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                    steps.push({ type: 'discover', node: neighbor, from: current, f: fScore[neighbor] });
                } else {
                    steps.push({ type: 'update', node: neighbor, from: current, f: fScore[neighbor] });
                }
            }
        }
    }
    steps.push({ type: 'fail' });
    return steps;
}