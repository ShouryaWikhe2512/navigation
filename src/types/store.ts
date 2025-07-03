export interface Position {
  x: number;
  y: number;
}

export interface Aisle {
  id: string;
  name: string;
  position: Position;
  width: number;
  height: number;
  color: string;
  products: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  aisle: string;
}

export interface PathStep {
  position: Position;
  direction?: 'up' | 'down' | 'left' | 'right';
  instruction?: string;
}

export interface GridCell {
  x: number;
  y: number;
  isWalkable: boolean;
  isAisle: boolean;
  aisleId?: string;
  isEntrance?: boolean;
  isCheckout?: boolean;
}