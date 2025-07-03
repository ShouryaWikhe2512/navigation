import React, { useState, useCallback } from 'react';
import { Store } from 'lucide-react';
import ProductSelector from './components/ProductSelector';
import StoreMap from './components/StoreMap';
import DirectionsPanel from './components/DirectionsPanel';
import { aisles, products, createGrid, entrance, checkout } from './data/storeData';
import { AStar } from './utils/pathfinding';
import { PathStep } from './types/store';

function App() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [highlightedAisles, setHighlightedAisles] = useState<string[]>([]);
  const [path, setPath] = useState<PathStep[]>([]);
  const [isRouteGenerated, setIsRouteGenerated] = useState(false);

  const handleProductSelect = useCallback((productId: string) => {
    setSelectedProducts(prev => [...prev, productId]);
  }, []);

  const handleProductRemove = useCallback((productId: string) => {
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  }, []);

  const generateRoute = useCallback(() => {
    if (selectedProducts.length === 0) return;

    // Get unique aisles from selected products
    const selectedAisles = new Set(
      selectedProducts.map(productId => {
        const product = products.find(p => p.id === productId);
        return product?.aisle;
      }).filter(Boolean)
    );

    const uniqueAisles = Array.from(selectedAisles) as string[];
    setHighlightedAisles(uniqueAisles);

    // Create grid for pathfinding
    const grid = createGrid();
    const pathfinder = new AStar(grid);

    // Calculate route through all aisles
    const aislePositions = uniqueAisles.map(aisleId => {
      const aisle = aisles.find(a => a.id === aisleId);
      if (!aisle) return null;
      
      // Find the closest walkable position to the aisle center
      const centerX = aisle.position.x + Math.floor(aisle.width / 2);
      const centerY = aisle.position.y + Math.floor(aisle.height / 2);
      
      // Find nearest walkable cell
      for (let radius = 1; radius <= 5; radius++) {
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            const x = centerX + dx;
            const y = centerY + dy;
            if (x >= 0 && x < 20 && y >= 0 && y < 15 && grid[y][x].isWalkable) {
              return { x, y };
            }
          }
        }
      }
      return null;
    }).filter(Boolean);

    // Calculate full path: Entrance → Aisles → Checkout
    const fullPath: PathStep[] = [];
    let currentPosition = entrance;

    // Visit each aisle
    for (const aislePos of aislePositions) {
      if (aislePos) {
        const segmentPath = pathfinder.findPath(currentPosition, aislePos);
        if (segmentPath.length > 0) {
          // Remove the first step if it's not the very first segment (to avoid duplicates)
          const pathToAdd = fullPath.length > 0 ? segmentPath.slice(1) : segmentPath;
          fullPath.push(...pathToAdd);
          currentPosition = aislePos;
        }
      }
    }

    // Path to checkout
    const checkoutPath = pathfinder.findPath(currentPosition, checkout);
    if (checkoutPath.length > 0) {
      fullPath.push(...checkoutPath.slice(1));
    }

    setPath(fullPath);
    setIsRouteGenerated(false);
  }, [selectedProducts]);

  const handlePathComplete = useCallback(() => {
    setIsRouteGenerated(true);
  }, []);

  const estimatedTime = Math.ceil(path.length * 0.5); // Rough estimate
  const totalDistance = path.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-[#04b7cf]" />
              <h1 className="text-2xl font-bold text-gray-900">SmartStore Navigator</h1>
            </div>
            <div className="text-sm text-gray-500">
              Advanced pathfinding • Manhattan-style routing
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Product Selector */}
          <div className="lg:col-span-1">
            <ProductSelector
              products={products}
              selectedProducts={selectedProducts}
              onProductSelect={handleProductSelect}
              onProductRemove={handleProductRemove}
              onGenerateRoute={generateRoute}
            />
          </div>

          {/* Store Map */}
          <div className="lg:col-span-2">
            <StoreMap
              aisles={aisles}
              highlightedAisles={highlightedAisles}
              path={path}
              onPathComplete={handlePathComplete}
            />
          </div>

          {/* Directions Panel */}
          <div className="lg:col-span-1">
            <DirectionsPanel
              path={path}
              estimatedTime={estimatedTime}
              totalDistance={totalDistance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;