declare module 'reactflow' {
  export interface Node<T = any> {
    id: string;
    position?: { x: number; y: number };
    data?: T;
  }
  export interface Edge<T = any> {
    id: string;
    source: string;
    target: string;
    data?: T;
  }
}
