# Visualizador de Algoritmos BFS y A* – UMG

<div align="center">
  <img src="https://img.shields.io/badge/Python-3.x-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Status-Activo-brightgreen" alt="Status">
</div>

<br>

Este proyecto es un **visualizador interactivo de algoritmos de búsqueda en grafos**, desarrollado como parte de mi formación en la **Universidad Mariano Gálvez (UMG)**. Implementa los algoritmos **Breadth-First Search (BFS)** y **A* (A-Star)**, permitiendo analizar en tiempo real la exploración del grafo, el costo de ruta y la eficiencia temporal.

<p align="center">
  <img src="https://via.placeholder.com/800x450?text=Visualizador+BFS+y+A*" alt="Vista previa del visualizador" width="80%">
</p>

---

##  Características principales

###  Algoritmos implementados
- **BFS (Breadth-First Search)** – Búsqueda no informada que explora nivel por nivel utilizando una cola FIFO.
- **A* (A-Star)** – Búsqueda informada con heurística `f(n) = g(n) + h(n)`, optimizada para encontrar la ruta de menor costo.

###  Interfaz profesional
- Visualización interactiva del grafo con nodos y aristas animadas.
- Panel de control con configuración en tiempo real (nodo inicio, meta, aristas y heurísticas).
- Registro de eventos con timestamps para seguimiento del algoritmo.
- Estadísticas en tiempo real (nodos explorados, costo de ruta, tiempo de cálculo).
- Exportación de la visualización a PNG.

###  Separación de responsabilidades
El código está organizado siguiendo buenas prácticas:
- `main.py` – Lanzador del visualizador.
- `index.html` – Estructura semántica de la interfaz.
- `style.css` – Estilos personalizados con paleta de colores UMG.
- `app.js` – Lógica de UI, renderizado y animación.
- `algorithms.js` – Algoritmos BFS y A* puros, sin dependencias del DOM.

---

##  Tecnologías utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **Python** | Lanzador del visualizador y manejo de archivos temporales |
| **HTML5** | Estructura semántica de la interfaz |
| **CSS3** | Estilos personalizados y diseño responsivo |
| **JavaScript (ES6)** | Lógica interactiva, algoritmos y animaciones |
| **Canvas API** | Renderizado dinámico del grafo |

---

## Instalación y ejecución

1. **Clona este repositorio:**

```bash
git clone https://github.com/Javiii3er/visualizador-ia-bfs-astar.git
cd visualizador-ia-bfs-astar

2. **Clona este repositorio:**
    python main.py

3. **Se abrirá automáticamente en tu navegador predeterminado.**

--- 
##  Cómo usar
Selecciona el algoritmo (BFS o A*)

Ingresa las aristas con formato: A-B:4, A-C:2, B-D:5

Define nodo inicio y nodo meta

Para A*: agrega heurísticas h(n) con formato: A:7, B:4, C:3

Ajusta la velocidad de la animación

Presiona "Ejecutar Algoritmo" y observa la exploración paso a paso

Exporta el resultado en PNG con el botón naranja

---
##  Estructura del proyecto
visualizador-ia-bfs-astar/
├── .gitignore              # Archivos ignorados por Git  
├── requirements.txt        # Dependencias (ninguna externa)  
├── main.py                 # Lanzador del visualizador  
├── index.html              # Estructura HTML  
├── style.css               # Estilos CSS  
├── app.js                  # Lógica de UI y animación  
└── algorithms.js           # Algoritmos BFS y A* puros  

--- 

##  Licencia
Este proyecto es de uso académico y personal. Puedes usarlo como inspiración para tus propios proyectos o adaptarlo a tus necesidades.

----
## Desarrollador
José Luis Javier – Universidad Mariano Gálvez (UMG)
Curso: Inteligencia Artificial 