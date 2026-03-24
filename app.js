/**
 * app.js
 * Lógica de la aplicación: UI, renderizado, animación
 * Depende de algorithms.js para los algoritmos de búsqueda
 */

// ── Estado Global ───────────────────────────────────────────
let currentAlgo = 'bfs';
let adjList = {};
let nodePositions = {};
let states = {
    nodes: {},
    edges: {},
    info: {}
};
let animationInterval = null;

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

// ── Inicialización y UI ──────────────────────────────────────
function init() {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    document.getElementById('speed-slider').oninput = function() {
        document.getElementById('speed-val').textContent = this.value + 'x';
    };
}

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    calculateLayout();
    render();
}

function setAlgo(type) {
    currentAlgo = type;
    document.getElementById('btn-bfs').className = 'btn-algo' + (type === 'bfs' ? ' active-bfs' : '');
    document.getElementById('btn-astar').className = 'btn-algo' + (type === 'astar' ? ' active-astar' : '');
    document.getElementById('astar-config').style.display = (type === 'astar' ? 'block' : 'none');
    addLog(`Cambiado a algoritmo: ${type.toUpperCase()}`, 'log-info');
}

function showError(msg) {
    const toast = document.getElementById('error-toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 4000);
}

function addLog(msg, type = '') {
    const logBox = document.getElementById('log-box');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${new Date().toLocaleTimeString([], {hour12:false})}] ${msg}`;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
}

// ── Procesamiento de Datos ───────────────────────────────────
function parseInputs() {
    const graphData = {};
    const edgesRaw = document.getElementById('edges').value.split(',');
    
    try {
        edgesRaw.forEach(raw => {
            const match = raw.trim().match(/^([^-]+)-([^:]+)(?::(\d+(\.\d+)?))?$/);
            if (!match) return;
            
            const u = match[1].trim();
            const v = match[2].trim();
            const w = match[3] ? parseFloat(match[3]) : 1;
            
            if (!graphData[u]) graphData[u] = [];
            if (!graphData[v]) graphData[v] = [];
            
            graphData[u].push({ node: v, cost: w });
            graphData[v].push({ node: u, cost: w });
        });
    } catch(e) {
        showError("Error en formato de aristas.");
        return null;
    }

    const hMap = {};
    if (currentAlgo === 'astar') {
        document.getElementById('heuristics').value.split(',').forEach(h => {
            const m = h.trim().match(/^([^:]+):(\d+(\.\d+)?)$/);
            if (m) hMap[m[1].trim()] = parseFloat(m[2]);
        });
    }

    return { graphData, hMap };
}

function calculateLayout() {
    const nodes = Object.keys(adjList);
    if (nodes.length === 0) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.75;

    nodes.forEach((node, i) => {
        const theta = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        nodePositions[node] = {
            x: centerX + radius * Math.cos(theta),
            y: centerY + radius * Math.sin(theta)
        };
    });
}

// ── Motor de Renderizado ─────────────────────────────────────
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const nodes = Object.keys(adjList);
    if (nodes.length === 0) {
        ctx.fillStyle = '#2a3550';
        ctx.font = '16px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Ingresa datos del grafo para comenzar', canvas.width/2, canvas.height/2);
        return;
    }

    // Dibujar Aristas
    const seenEdges = new Set();
    nodes.forEach(u => {
        (adjList[u] || []).forEach(edge => {
            const v = edge.node;
            const pair = [u, v].sort().join('-');
            if (seenEdges.has(pair)) return;
            seenEdges.add(pair);

            const p1 = nodePositions[u], p2 = nodePositions[v];
            const state = states.edges[pair] || 'normal';

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            if (state === 'path') {
                ctx.strokeStyle = '#4ecb71'; ctx.lineWidth = 4;
                ctx.setLineDash([]);
            } else if (state === 'active') {
                ctx.strokeStyle = '#f0a500'; ctx.lineWidth = 2.5;
                ctx.setLineDash([5, 5]);
            } else {
                ctx.strokeStyle = '#2a3550'; ctx.lineWidth = 1.5;
                ctx.setLineDash([]);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = (state === 'path' ? '#4ecb71' : '#7a8aaa');
            ctx.font = '10px monospace';
            ctx.fillText(edge.cost, (p1.x + p2.x)/2 + 12, (p1.y + p2.y)/2 - 8);
        });
    });

    // Dibujar Nodos
    const radius = 26;
    nodes.forEach(node => {
        const pos = nodePositions[node];
        const state = states.nodes[node] || 'unvisited';
        
        const theme = {
            unvisited: { bg: '#1a2540', border: '#3a5080', text: '#8aabca' },
            open:      { bg: '#1a3a7a', border: '#4a9eff', text: '#ffffff' },
            closed:    { bg: '#3a1a7a', border: '#8a5aff', text: '#c8a8ff' },
            current:   { bg: '#6a5000', border: '#f0a500', text: '#ffffff' },
            path:      { bg: '#0d3520', border: '#4ecb71', text: '#ffffff' },
            goal:      { bg: '#5a0d0d', border: '#ff4444', text: '#ffffff' },
            start:     { bg: '#0d2a5a', border: '#4a9eff', text: '#ffffff' }
        };

        const col = theme[state] || theme.unvisited;

        if (state === 'current') {
            ctx.shadowBlur = 20;
            ctx.shadowColor = col.border;
        }

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = col.bg;
        ctx.fill();
        ctx.strokeStyle = col.border;
        ctx.lineWidth = (state === 'current' ? 4 : 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = col.text;
        ctx.font = 'bold 14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node, pos.x, pos.y);

        if (currentAlgo === 'astar' && states.info[node]?.f !== undefined) {
            ctx.fillStyle = '#7a8aaa';
            ctx.font = '9px Consolas';
            ctx.fillText(`f:${states.info[node].f}`, pos.x, pos.y + radius + 14);
        }
    });
}

// ── Ejecución de la Animación ────────────────────────────────
function startSearch() {
    if (animationInterval) clearInterval(animationInterval);
    
    const { graphData, hMap } = parseInputs();
    const startNode = document.getElementById('start').value.trim();
    const goalNode = document.getElementById('goal').value.trim();

    if (!graphData[startNode]) { showError(`Nodo de inicio "${startNode}" no existe.`); return; }
    if (!graphData[goalNode]) { showError(`Nodo meta "${goalNode}" no existe.`); return; }
    
    adjList = graphData;
    calculateLayout();
    
    states.nodes = {}; states.edges = {}; states.info = {};
    Object.keys(adjList).forEach(n => states.nodes[n] = 'unvisited');
    
    document.getElementById('log-box').innerHTML = '';
    document.getElementById('hud-stats').style.opacity = '1';
    document.getElementById('timer-hud').style.display = 'flex';
    document.getElementById('btn-run').disabled = true;

    const t0 = performance.now();
    const steps = (currentAlgo === 'bfs' 
        ? runBFSLogic(adjList, startNode, goalNode) 
        : runAStarLogic(adjList, startNode, goalNode, hMap));
    const t1 = performance.now();
    document.getElementById('cpu-time').textContent = (t1 - t0).toFixed(4);

    let stepIdx = 0;
    const speed = parseInt(document.getElementById('speed-slider').value);
    const delay = Math.max(100, 1500 / speed);

    animationInterval = setInterval(() => {
        if (stepIdx >= steps.length) {
            clearInterval(animationInterval);
            document.getElementById('btn-run').disabled = false;
            addLog("Simulación finalizada.", "log-info");
            return;
        }

        const s = steps[stepIdx];
        processStep(s, startNode, goalNode);
        render();
        stepIdx++;
    }, delay);
}

function processStep(s, start, goal) {
    switch(s.type) {
        case 'init':
            states.nodes[s.node] = 'start';
            addLog(`Nodo inicial establecido: ${s.node}`, 'log-info');
            break;
            
        case 'expand':
            Object.keys(states.nodes).forEach(n => {
                if(states.nodes[n] === 'current') states.nodes[n] = 'closed';
            });
            states.nodes[s.node] = (s.node === goal ? 'goal' : 'current');
            addLog(`Expandiendo nodo actual: ${s.node}`, 'log-current');
            break;

        case 'discover':
        case 'update':
            if (s.node !== goal) states.nodes[s.node] = 'open';
            const pair = [s.from, s.node].sort().join('-');
            states.edges[pair] = 'active';
            if (s.f) states.info[s.node] = { f: s.f };
            addLog(`Nodo descubierto: ${s.node} desde ${s.from}`, '');
            break;

        case 'found':
            addLog(`¡META ALCANZADA! Ruta: ${s.path.join(' → ')}`, 'log-found');
            document.getElementById('stat-visited').textContent = Object.values(states.nodes).filter(v => v !== 'unvisited').length;
            document.getElementById('stat-cost').textContent = s.cost;
            
            s.path.forEach(n => {
                if(n !== start && n !== goal) states.nodes[n] = 'path';
            });
            for(let i=0; i < s.path.length-1; i++) {
                const p = [s.path[i], s.path[i+1]].sort().join('-');
                states.edges[p] = 'path';
            }
            break;
            
        case 'fail':
            addLog("Fallo: No se encontró una ruta posible.", "log-error");
            showError("No hay conexión entre el inicio y la meta.");
            break;
    }
}

function resetUI() {
    clearInterval(animationInterval);
    adjList = {}; nodePositions = {}; 
    states.nodes = {}; states.edges = {}; states.info = {};
    document.getElementById('log-box').innerHTML = '<div class="log-entry log-info">Reiniciado. Ingrese nuevos datos.</div>';
    document.getElementById('hud-stats').style.opacity = '0';
    document.getElementById('timer-hud').style.display = 'none';
    document.getElementById('btn-run').disabled = false;
    render();
}

function exportCanvas() {
    const link = document.createElement('a');
    link.download = `UMG_IA_Graph_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Iniciar aplicación
init();