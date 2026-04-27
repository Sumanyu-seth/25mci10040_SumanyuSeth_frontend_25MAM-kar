document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("graph-canvas");
    const ctx = canvas.getContext("2d");

    const generateBtn = document.getElementById("btn-generate");
    const nodeCountInput = document.getElementById("node-count");

    const startSelect = document.getElementById("start-node");
    const endSelect = document.getElementById("end-node");

    const distanceOutput = document.getElementById("distance-output");
    const pathOutput = document.getElementById("path-output");
    const runBtn = document.getElementById("btn-run");
    const resetBtn = document.getElementById("btn-reset");

    const nodes = [];  // { x, y, label }
    let graph = {};    // label -> [{ to, weight }, ...]

    const RADIUS = 20;

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateNodes(count) {
        nodes.length = 0;
        const margin = 60;

        for (let i = 0; i < count; i++) {
            const x = randomInt(margin, canvas.width - margin);
            const y = randomInt(margin, canvas.height - margin);
            const label = String.fromCharCode(65 + i); // A, B, C...

            nodes.push({ x, y, label });
        }
    }

    function initEmptyGraph() {
        graph = {};
        for (const node of nodes) {
            graph[node.label] = [];
        }
    }

    function addUndirectedEdge(u, v, weight) {
        graph[u].push({ to: v, weight });
        graph[v].push({ to: u, weight });
    }

    // Create a connected random graph with random weights
    function generateRandomEdges() {
        initEmptyGraph();

        if (nodes.length < 2) return;

        const labels = nodes.map(n => n.label);

        // 1) Random spanning tree for connectivity
        const visited = new Set();
        visited.add(labels[0]);

        while (visited.size < labels.length) {
            const visitedArr = Array.from(visited);
            const u = visitedArr[randomInt(0, visitedArr.length - 1)];
            const remaining = labels.filter(l => !visited.has(l));
            const v = remaining[randomInt(0, remaining.length - 1)];

            const w = randomInt(1, 10);
            addUndirectedEdge(u, v, w);
            visited.add(v);
        }

        // 2) Extra random edges
        const extraEdges = Math.min(nodes.length, 4);
        for (let i = 0; i < extraEdges; i++) {
            const u = labels[randomInt(0, labels.length - 1)];
            const v = labels[randomInt(0, labels.length - 1)];
            if (u === v) continue;

            const already = graph[u].some(e => e.to === v);
            if (already) continue;

            const w = randomInt(1, 10);
            addUndirectedEdge(u, v, w);
        }
    }

    function getNode(label) {
        return nodes.find(n => n.label === label);
    }

    // Draw entire graph (edges, weights, nodes)
    function drawGraph() {
        clearCanvas();

        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw edges
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#6b7280";

        const drawnPairs = new Set();

        for (const u in graph) {
            for (const edge of graph[u]) {
                const v = edge.to;
                const pairKey1 = u + "-" + v;
                const pairKey2 = v + "-" + u;
                if (drawnPairs.has(pairKey1) || drawnPairs.has(pairKey2)) {
                    continue;
                }
                drawnPairs.add(pairKey1);

                const nodeU = getNode(u);
                const nodeV = getNode(v);
                if (!nodeU || !nodeV) continue;

                // Edge line
                ctx.beginPath();
                ctx.moveTo(nodeU.x, nodeU.y);
                ctx.lineTo(nodeV.x, nodeV.y);
                ctx.stroke();

                // Weight label
                const midX = (nodeU.x + nodeV.x) / 2;
                const midY = (nodeU.y + nodeV.y) / 2;
                ctx.fillStyle = "#111827";
                ctx.fillText(edge.weight.toString(), midX, midY);
            }
        }

        // Draw nodes on top
        for (const node of nodes) {
            ctx.beginPath();
            ctx.fillStyle = "#bfdbfe";
            ctx.strokeStyle = "#1f2937";
            ctx.lineWidth = 2;
            ctx.arc(node.x, node.y, RADIUS, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#111827";
            ctx.fillText(node.label, node.x, node.y);
        }
    }

    // Highlight a path (sequence of labels) in red
    function drawPath(path) {
        if (!path || path.length < 2) return;

        // Draw graph first so path appears on top
        drawGraph();

        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ef4444";

        for (let i = 0; i < path.length - 1; i++) {
            const uLabel = path[i];
            const vLabel = path[i + 1];
            const uNode = getNode(uLabel);
            const vNode = getNode(vLabel);
            if (!uNode || !vNode) continue;

            ctx.beginPath();
            ctx.moveTo(uNode.x, uNode.y);
            ctx.lineTo(vNode.x, vNode.y);
            ctx.stroke();
        }
    }

    function updateDropdowns() {
        function fillSelect(select) {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
            for (const node of nodes) {
                const opt = document.createElement("option");
                opt.value = node.label;
                opt.textContent = node.label;
                select.appendChild(opt);
            }
        }
        fillSelect(startSelect);
        fillSelect(endSelect);
    }

    function resetResult() {
        distanceOutput.textContent = "Distance: -";
        pathOutput.textContent = "Path: -";
    }

    // ---- Dijkstra in JavaScript (on 'graph') ----
    function runDijkstra(start, end) {
        const dist = {};
        const prev = {};
        const unvisited = new Set();

        for (const label in graph) {
            dist[label] = Infinity;
            prev[label] = null;
            unvisited.add(label);
        }
        dist[start] = 0;

        while (unvisited.size > 0) {
            let current = null;
            let currentDist = Infinity;
            for (const label of unvisited) {
                if (dist[label] < currentDist) {
                    currentDist = dist[label];
                    current = label;
                }
            }
            if (current === null) break;
            if (current === end) break;  

            unvisited.delete(current);

            for (const edge of graph[current]) {
                const neighbor = edge.to;
                if (!unvisited.has(neighbor)) continue;
                const newDist = dist[current] + edge.weight;
                if (newDist < dist[neighbor]) {
                    dist[neighbor] = newDist;
                    prev[neighbor] = current;
                }
            }
        }

        const path = [];
        let cur = end;
        while (cur !== null) {
            path.push(cur);
            cur = prev[cur];
        }
        path.reverse();

        if (path.length === 0 || path[0] !== start || dist[end] === Infinity) {
            return { distance: Infinity, path: [] };
        }
        return { distance: dist[end], path };
    }

    // ---- Event handlers ----

    generateBtn.addEventListener("click", () => {
        const count = parseInt(nodeCountInput.value, 10);
        if (isNaN(count) || count < 2) {
            alert("Please enter a valid number of nodes (at least 2).");
            return;
        }
        if (count > 20) {
            alert("Please enter 20 or fewer nodes.");
            return;
        }

        generateNodes(count);
        generateRandomEdges();
        updateDropdowns();
        resetResult();
        drawGraph();
    });

    runBtn.addEventListener("click", () => {
        const start = startSelect.value;
        const end = endSelect.value;

        if (!start || !end) {
            alert("Please select both start and end nodes.");
            return;
        }

        if (start === end) {
            alert("Start and end are the same. Distance is 0.");
            distanceOutput.textContent = "Distance: 0";
            pathOutput.textContent = "Path: " + start;
            drawGraph();
            return;
        }

        const result = runDijkstra(start, end);
        if (result.distance === Infinity || result.path.length === 0) {
            alert(`No path found from ${start} to ${end}.`);
            distanceOutput.textContent = "Distance: ∞";
            pathOutput.textContent = "Path: -";
            drawGraph();
        } else {
            distanceOutput.textContent = "Distance: " + result.distance;
            pathOutput.textContent = "Path: " + result.path.join(" -> ");
            drawPath(result.path);
        }
    });

    resetBtn.addEventListener("click", () => {
        const count = parseInt(nodeCountInput.value, 10) || 7;
        generateNodes(count);
        generateRandomEdges();
        updateDropdowns();
        resetResult();
        drawGraph();
    });

    // Initial graph on load
    const initialCount = parseInt(nodeCountInput.value, 10) || 7;
    generateNodes(initialCount);
    generateRandomEdges();
    updateDropdowns();
    resetResult();
    drawGraph();
});