# Dijkstra Shortest Path Visualizer

A mini project combining **DSA** (Dijkstra’s algorithm) with **frontend** (HTML, CSS, JavaScript canvas).  
The app generates a random weighted graph, lets you choose start and end nodes, and visualizes the shortest path.

---

## 1. Project Structure

- `index.html` – Layout of the app (canvas + side panel UI).
- `style.css` – Styling for the canvas area and dark side panel.
- `script.js` – Frontend logic:
  - Random graph generation (nodes, edges, weights).
  - Dijkstra’s algorithm in JavaScript.
  - Drawing nodes, edges, weights, and shortest path on canvas.
- `dijkstra.py` – Python implementation of Dijkstra’s algorithm using an adjacency list (for DSA / theory, testing, and explanation).

---

## 2. How to Run (Frontend)

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox).
2. Choose **Number of nodes** and click **Generate Graph**.
3. Select **Start node** and **End node** from dropdowns.
4. Click **Find Shortest Path**:
   - The shortest distance is shown in the side panel.
   - The shortest path is highlighted in red on the canvas.
5. Click **Reset Graph** to regenerate a new random graph with the same node count.

<img width="1883" height="868" alt="image" src="https://github.com/user-attachments/assets/c7f55319-bbb6-4641-a92d-5327f7cecd15" />

---

<img width="1880" height="867" alt="image" src="https://github.com/user-attachments/assets/5bb219a6-1536-42ea-9373-bd882963fbfa" />


---

## 3. Dijkstra in JavaScript (script.js)

- The graph is stored as an **adjacency list**:

  ```js
  graph[label] = [{ to: neighborLabel, weight: w }, ...]
  ```

- Algorithm steps:
  - Initialize distances `dist[label] = Infinity`, previous `prev[label] = null`.
  - Repeatedly pick the unvisited node with smallest `dist`.
  - Relax edges: update `dist[neighbor]` and `prev[neighbor]` when a shorter path is found.
  - Reconstruct the path from `end` back to `start` using `prev`.
- The resulting path array is then drawn as a **thick red polyline** over the existing graph.

---

## 4. Dijkstra in Python (dijkstra.py)

- Implements the same algorithm in Python for the DSA part of the project.
- Uses a dictionary-based adjacency list, similar to:

  ```python
  graph = {
      "A": [("B", 2), ("C", 5)],
      "B": [("A", 2), ("C", 1)],
      ...
  }
  ```

- Command-line usage:
  - Run: `python dijkstra.py`
  - Enter start and end nodes when prompted.
  - The script prints:
    - Shortest distance.
    - Shortest path sequence.
---

## 5. Technologies Used

- **HTML5** – Structure and UI elements.
- **CSS3 and Bootstrap** – Dark sidebar layout, responsive design, styled buttons.
- **JavaScript (ES6)** – Canvas drawing, random graph generation, Dijkstra’s algorithm.
- **Python 3** – Separate Dijkstra implementation for data structures and algorithms demonstration.
