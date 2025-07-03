import { Aisle, Product, GridCell } from '../types/store';

export const GRID_WIDTH = 20;
export const GRID_HEIGHT = 15;

export const aisles: Aisle[] = [
  {
    id: 'dairy',
    name: 'Dairy',
    position: { x: 2, y: 2 },
    width: 3,
    height: 2,
    color: '#04cf84',
    products: ['milk', 'cheese', 'yogurt', 'butter']
  },
  {
    id: 'frozen',
    name: 'Frozen Foods',
    position: { x: 7, y: 2 },
    width: 2,
    height: 3,
    color: '#51c995',
    products: ['frozen pizza', 'ice cream', 'frozen vegetables']
  },
  {
    id: 'snacks',
    name: 'Snacks',
    position: { x: 12, y: 2 },
    width: 4,
    height: 2,
    color: '#04b7cf',
    products: ['chips', 'crackers', 'cookies', 'candy']
  },
  {
    id: 'beverages',
    name: 'Beverages',
    position: { x: 2, y: 6 },
    width: 2,
    height: 4,
    color: '#04cf84',
    products: ['soda', 'juice', 'water', 'coffee']
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    position: { x: 6, y: 7 },
    width: 3,
    height: 2,
    color: '#51c995',
    products: ['shampoo', 'soap', 'toothpaste', 'deodorant']
  },
  {
    id: 'produce',
    name: 'Produce',
    position: { x: 12, y: 6 },
    width: 4,
    height: 3,
    color: '#04b7cf',
    products: ['apples', 'bananas', 'lettuce', 'tomatoes']
  },
  {
    id: 'meat',
    name: 'Meat & Deli',
    position: { x: 2, y: 12 },
    width: 5,
    height: 2,
    color: '#04cf84',
    products: ['chicken', 'beef', 'ham', 'turkey']
  },
  {
    id: 'bakery',
    name: 'Bakery',
    position: { x: 10, y: 12 },
    width: 3,
    height: 2,
    color: '#51c995',
    products: ['bread', 'muffins', 'cake', 'donuts']
  }
];

export const products: Product[] = [
  { id: '1', name: 'Milk', category: 'Dairy', aisle: 'dairy' },
  { id: '2', name: 'Cheese', category: 'Dairy', aisle: 'dairy' },
  { id: '3', name: 'Yogurt', category: 'Dairy', aisle: 'dairy' },
  { id: '4', name: 'Butter', category: 'Dairy', aisle: 'dairy' },
  { id: '5', name: 'Frozen Pizza', category: 'Frozen', aisle: 'frozen' },
  { id: '6', name: 'Ice Cream', category: 'Frozen', aisle: 'frozen' },
  { id: '7', name: 'Frozen Vegetables', category: 'Frozen', aisle: 'frozen' },
  { id: '8', name: 'Chips', category: 'Snacks', aisle: 'snacks' },
  { id: '9', name: 'Crackers', category: 'Snacks', aisle: 'snacks' },
  { id: '10', name: 'Cookies', category: 'Snacks', aisle: 'snacks' },
  { id: '11', name: 'Candy', category: 'Snacks', aisle: 'snacks' },
  { id: '12', name: 'Soda', category: 'Beverages', aisle: 'beverages' },
  { id: '13', name: 'Juice', category: 'Beverages', aisle: 'beverages' },
  { id: '14', name: 'Water', category: 'Beverages', aisle: 'beverages' },
  { id: '15', name: 'Coffee', category: 'Beverages', aisle: 'beverages' },
  { id: '16', name: 'Shampoo', category: 'Personal Care', aisle: 'personal-care' },
  { id: '17', name: 'Soap', category: 'Personal Care', aisle: 'personal-care' },
  { id: '18', name: 'Toothpaste', category: 'Personal Care', aisle: 'personal-care' },
  { id: '19', name: 'Deodorant', category: 'Personal Care', aisle: 'personal-care' },
  { id: '20', name: 'Apples', category: 'Produce', aisle: 'produce' },
  { id: '21', name: 'Bananas', category: 'Produce', aisle: 'produce' },
  { id: '22', name: 'Lettuce', category: 'Produce', aisle: 'produce' },
  { id: '23', name: 'Tomatoes', category: 'Produce', aisle: 'produce' },
  { id: '24', name: 'Chicken', category: 'Meat', aisle: 'meat' },
  { id: '25', name: 'Beef', category: 'Meat', aisle: 'meat' },
  { id: '26', name: 'Ham', category: 'Meat', aisle: 'meat' },
  { id: '27', name: 'Turkey', category: 'Meat', aisle: 'meat' },
  { id: '28', name: 'Bread', category: 'Bakery', aisle: 'bakery' },
  { id: '29', name: 'Muffins', category: 'Bakery', aisle: 'bakery' },
  { id: '30', name: 'Cake', category: 'Bakery', aisle: 'bakery' },
  { id: '31', name: 'Donuts', category: 'Bakery', aisle: 'bakery' }
];

export const entrance = { x: 10, y: 0 };
export const checkout = { x: 17, y: 13 };

export function createGrid(): GridCell[][] {
  const grid: GridCell[][] = [];
  
  // Initialize all cells as walkable
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      grid[y][x] = {
        x,
        y,
        isWalkable: true,
        isAisle: false,
        isEntrance: x === entrance.x && y === entrance.y,
        isCheckout: x === checkout.x && y === checkout.y
      };
    }
  }

  // Mark aisle areas as non-walkable
  for (const aisle of aisles) {
    for (let y = aisle.position.y; y < aisle.position.y + aisle.height; y++) {
      for (let x = aisle.position.x; x < aisle.position.x + aisle.width; x++) {
        if (y < GRID_HEIGHT && x < GRID_WIDTH) {
          grid[y][x].isWalkable = false;
          grid[y][x].isAisle = true;
          grid[y][x].aisleId = aisle.id;
        }
      }
    }
  }

  return grid;
}