
import { Position, GridCell, PathStep } from '../types/store'; 

interface Node {
  position: Position;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: Node;
}

export class AStar {
  private grid: GridCell[][];
  private width: number;
  private height: number;

  constructor(grid: GridCell[][]) {
    this.grid = grid;
    this.height = grid.length;
    this.width = grid[0]?.length || 0;
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const { x, y } = node.position;
    
    // Only horizontal and vertical movement (Manhattan style)
    const directions = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
    ];

    for (const dir of directions) {
      const newX = x + dir.x;
      const newY = y + dir.y;

      if (this.isValidPosition(newX, newY) && this.isWalkable(newX, newY)) {
        neighbors.push({
          position: { x: newX, y: newY },
          gCost: 0,
          hCost: 0,
          fCost: 0,
          parent: node
        });
      }
    }

    return neighbors;
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private isWalkable(x: number, y: number): boolean {
    return this.grid[y][x].isWalkable;
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    // Manhattan distance
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  private reconstructPath(endNode: Node): PathStep[] {
    const path: PathStep[] = [];
    let current = endNode;

    while (current.parent) {
      const direction = this.getDirection(current.parent.position, current.position);
      path.unshift({
        position: current.position,
        direction
      });
      current = current.parent;
    }

    // Add start position
    path.unshift({ position: current.position });

    return this.addInstructions(path);
  }

  private getDirection(from: Position, to: Position): 'up' | 'down' | 'left' | 'right' {
    if (to.y < from.y) return 'up';
    if (to.y > from.y) return 'down';
    if (to.x < from.x) return 'left';
    return 'right';
  }

  private addInstructions(path: PathStep[]): PathStep[] {
    const instructions: PathStep[] = [];
    let currentDirection: string | undefined;

    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      const instruction = this.generateInstruction(step, currentDirection, i, path.length);
      
      instructions.push({
        ...step,
        instruction
      });

      if (step.direction) {
        currentDirection = step.direction;
      }
    }

    return instructions;
  }

  private generateInstruction(
    step: PathStep, 
    currentDirection: string | undefined, 
    index: number, 
    totalSteps: number
  ): string {
    if (index === 0) return "Start from entrance";
    if (index === totalSteps - 1) return "Arrive at checkout";

    const direction = step.direction;
    if (!direction) return "Continue forward";

    if (currentDirection !== direction) {
      const directionMap = {
        'up': 'north',
        'down': 'south',
        'left': 'west',
        'right': 'east'
      };
      return `Turn ${directionMap[direction]}`;
    }

    return "Continue forward";
  }

  findPath(start: Position, end: Position): PathStep[] {
    const openSet: Node[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: Node = {
      position: start,
      gCost: 0,
      hCost: this.calculateDistance(start, end),
      fCost: 0,
      parent: undefined
    };
    startNode.fCost = startNode.gCost + startNode.hCost;

    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find node with lowest fCost
      let current = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fCost < current.fCost || 
            (openSet[i].fCost === current.fCost && openSet[i].hCost < current.hCost)) {
          current = openSet[i];
        }
      }

      const currentIndex = openSet.indexOf(current);
      openSet.splice(currentIndex, 1);
      closedSet.add(`${current.position.x},${current.position.y}`);

      // Check if we reached the target
      if (current.position.x === end.x && current.position.y === end.y) {
        return this.reconstructPath(current);
      }

      // Check neighbors
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.position.x},${neighbor.position.y}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeGCost = current.gCost + 1;
        const existingNode = openSet.find(n => 
          n.position.x === neighbor.position.x && n.position.y === neighbor.position.y
        );

        if (!existingNode || tentativeGCost < existingNode.gCost) {
          neighbor.gCost = tentativeGCost;
          neighbor.hCost = this.calculateDistance(neighbor.position, end);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = current;

          if (!existingNode) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return []; // No path found
  }
}

