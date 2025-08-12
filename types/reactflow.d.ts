declare module "reactflow" {
  export interface Edge<T = any> {
    id: string;
    source: string;
    target: string;
    data?: T;
  }
  export interface Node<T = any> {
    id: string;
    data?: T;
  }
}
