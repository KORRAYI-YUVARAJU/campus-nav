// =============================================
// MVGR Campus Graph & Dijkstra Algorithm
// =============================================

export interface CampusNode {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'building' | 'intersection' | 'gate';
  category?: 'academic' | 'admin' | 'community' | 'infrastructure';
  floors?: number;
  rooms?: string[];
}

export interface CampusEdge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphResult {
  path: string[];
  distance: number;
  pathCoords: { x: number; y: number; id: string }[];
}

// MVGR Campus buildings & intersections (mapped to SVG viewBox 0-920, 0-720)
export const campusNodes: CampusNode[] = [
  // === Buildings ===
  { id: 'main_gate', name: 'Main Gate', x: 780, y: 520, type: 'gate', category: 'infrastructure' },
  { id: 'ground', name: 'College Ground', x: 680, y: 590, type: 'building', category: 'community' },
  { id: 'admin', name: 'Administration Block', x: 430, y: 480, type: 'building', category: 'admin', floors: 3,
    rooms: ['Principal Office', 'Dean Office', 'Exam Cell', 'Admin Office'] },
  { id: 'ece_block', name: 'ECE Department', x: 160, y: 600, type: 'building', category: 'academic', floors: 4,
    rooms: ['ECE-101', 'ECE-102', 'ECE-201', 'ECE-202', 'ECE-301', 'ECE Lab 1', 'ECE Lab 2'] },
  { id: 'cse_block', name: 'CSE Department', x: 290, y: 610, type: 'building', category: 'academic', floors: 4,
    rooms: ['CSE-101', 'CSE-102', 'CSE-201', 'CSE-202', 'CSE-301', 'CSE Lab 1', 'CSE Lab 2', 'CSE Lab 3'] },
  { id: 'library', name: 'Central Library', x: 510, y: 230, type: 'building', category: 'community', floors: 3,
    rooms: ['Reading Hall', 'Reference Section', 'Digital Library', 'Periodicals'] },
  { id: 'civil_block', name: 'Civil Engineering', x: 390, y: 240, type: 'building', category: 'academic', floors: 3,
    rooms: ['CE-101', 'CE-201', 'CE Lab'] },
  { id: 'canteen', name: 'MVGR Canteen', x: 240, y: 195, type: 'building', category: 'community' },
  { id: 'bus_stand', name: 'Bus Stand', x: 340, y: 110, type: 'building', category: 'infrastructure' },
  { id: 'it_dept', name: 'IT Department', x: 340, y: 400, type: 'building', category: 'academic', floors: 3,
    rooms: ['IT-101', 'IT-201', 'IT Lab 1', 'IT Lab 2'] },
  { id: 'chem_lab', name: 'Chemistry Laboratory', x: 260, y: 350, type: 'building', category: 'academic' },
  { id: 'mech_dept', name: 'Mechanical Department', x: 80, y: 530, type: 'building', category: 'academic', floors: 3,
    rooms: ['ME-101', 'ME-201', 'Workshop'] },
  { id: 'workshop', name: 'Workshop Laboratory', x: 80, y: 420, type: 'building', category: 'academic' },
  { id: 'auditorium', name: 'Auditorium', x: 450, y: 390, type: 'building', category: 'community', floors: 2,
    rooms: ['Main Hall', 'Seminar Hall', 'Conference Room'] },
  { id: 'pond', name: 'Pond', x: 770, y: 190, type: 'building', category: 'community' },

  // === Road Intersections ===
  { id: 'int_1', name: 'Junction 1', x: 680, y: 520, type: 'intersection' },
  { id: 'int_2', name: 'Junction 2', x: 480, y: 520, type: 'intersection' },
  { id: 'int_3', name: 'Junction 3', x: 340, y: 520, type: 'intersection' },
  { id: 'int_4', name: 'Junction 4', x: 190, y: 520, type: 'intersection' },
  { id: 'int_5', name: 'Junction 5', x: 340, y: 290, type: 'intersection' },
  { id: 'int_6', name: 'Junction 6', x: 480, y: 290, type: 'intersection' },
  { id: 'int_7', name: 'Junction 7', x: 680, y: 290, type: 'intersection' },
  { id: 'int_8', name: 'Junction 8', x: 190, y: 290, type: 'intersection' },
  { id: 'int_9', name: 'Junction 9', x: 340, y: 140, type: 'intersection' },
];

export const campusEdges: CampusEdge[] = [
  { from: 'main_gate', to: 'int_1', weight: 50 },
  { from: 'int_1', to: 'ground', weight: 80 },
  { from: 'int_1', to: 'int_2', weight: 100 },
  { from: 'int_1', to: 'int_7', weight: 120 },
  { from: 'int_2', to: 'admin', weight: 30 },
  { from: 'int_2', to: 'int_3', weight: 80 },
  { from: 'int_2', to: 'int_6', weight: 120 },
  { from: 'int_3', to: 'int_4', weight: 80 },
  { from: 'int_3', to: 'int_5', weight: 120 },
  { from: 'int_3', to: 'cse_block', weight: 50 },
  { from: 'int_4', to: 'ece_block', weight: 50 },
  { from: 'int_4', to: 'mech_dept', weight: 60 },
  { from: 'int_4', to: 'int_8', weight: 120 },
  { from: 'int_5', to: 'chem_lab', weight: 40 },
  { from: 'int_5', to: 'it_dept', weight: 60 },
  { from: 'int_5', to: 'int_6', weight: 80 },
  { from: 'int_5', to: 'int_9', weight: 80 },
  { from: 'int_6', to: 'library', weight: 40 },
  { from: 'int_6', to: 'civil_block', weight: 50 },
  { from: 'int_6', to: 'auditorium', weight: 60 },
  { from: 'int_7', to: 'pond', weight: 60 },
  { from: 'int_7', to: 'int_6', weight: 100 },
  { from: 'int_8', to: 'workshop', weight: 60 },
  { from: 'int_8', to: 'canteen', weight: 70 },
  { from: 'int_8', to: 'int_5', weight: 80 },
  { from: 'int_9', to: 'bus_stand', weight: 30 },
  { from: 'int_9', to: 'canteen', weight: 60 },
];

// =============================================
//  Dijkstra's Shortest Path Algorithm
// =============================================
export function dijkstra(start: string, end: string): GraphResult | null {
  // Build undirected adjacency list
  const adj: Record<string, { node: string; weight: number }[]> = {};
  for (const e of campusEdges) {
    if (!adj[e.from]) adj[e.from] = [];
    if (!adj[e.to]) adj[e.to] = [];
    adj[e.from].push({ node: e.to, weight: e.weight });
    adj[e.to].push({ node: e.from, weight: e.weight });
  }

  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const pq: { node: string; d: number }[] = [];

  for (const n of campusNodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  }
  dist[start] = 0;
  pq.push({ node: start, d: 0 });

  while (pq.length) {
    pq.sort((a, b) => a.d - b.d);
    const cur = pq.shift()!;
    if (visited.has(cur.node)) continue;
    visited.add(cur.node);
    if (cur.node === end) break;
    for (const nb of adj[cur.node] || []) {
      if (visited.has(nb.node)) continue;
      const nd = dist[cur.node] + nb.weight;
      if (nd < dist[nb.node]) {
        dist[nb.node] = nd;
        prev[nb.node] = cur.node;
        pq.push({ node: nb.node, d: nd });
      }
    }
  }

  if (dist[end] === Infinity) return null;

  const path: string[] = [];
  let c: string | null = end;
  while (c) { path.unshift(c); c = prev[c]; }

  const nodeMap = new Map(campusNodes.map(n => [n.id, n]));
  return {
    path,
    distance: dist[end],
    pathCoords: path.map(id => {
      const n = nodeMap.get(id)!;
      return { x: n.x, y: n.y, id };
    }),
  };
}
