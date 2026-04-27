# import heapq

# def dijkstra(graph, start):
#     """
#     graph: dict[node] = list of (neighbor, weight)
#     start: starting node label
#     returns: (distances, previous)
#     """
#     distances = {node: float('inf') for node in graph}
#     distances[start] = 0
#     previous = {node: None for node in graph}
#     pq = [(0, start)]

#     while pq:
#         current_distance, current_node = heapq.heappop(pq)
#         if current_distance > distances[current_node]:
#             continue

#         for neighbor, weight in graph[current_node]:
#             distance = current_distance + weight
#             if distance < distances[neighbor]:
#                 distances[neighbor] = distance
#                 previous[neighbor] = current_node
#                 heapq.heappush(pq, (distance, neighbor))

#     return distances, previous

# def reconstruct_path(previous, start, end):
#     path = []
#     current = end
#     while current is not None:
#         path.append(current)
#         current = previous[current]
#     path.reverse()
#     if not path or path[0] != start:
#         return []
#     return path

# def sample_graph():
#     """
#     Same structure as the SVG example:
#     A-B (4), A-C (6), B-D (3), C-D (5)
#     Undirected graph represented as adjacency list.
#     """
#     graph = {
#         "A": [("B", 4), ("C", 6)],
#         "B": [("A", 4), ("D", 3)],
#         "C": [("A", 6), ("D", 5)],
#         "D": [("B", 3), ("C", 5)]
#     }
#     return graph

# if __name__ == "__main__":
#     g = sample_graph()
#     print("Available nodes:", ", ".join(sorted(g.keys())))
#     start = input("Enter start node: ").strip().upper()
#     end = input("Enter end node: ").strip().upper()

#     if start not in g or end not in g:
#         print("Invalid start or end node.")
#     else:
#         distances, previous = dijkstra(g, start)
#         if distances[end] == float("inf"):
#             print(f"No path found from {start} to {end}.")
#         else:
#             path = reconstruct_path(previous, start, end)
#             print(f"Shortest distance from {start} to {end}: {distances[end]}")
#             print("Path:", " -> ".join(path))