import React from 'react';
import { Navigation, Clock, MapPin, CheckCircle, Store } from 'lucide-react';
import { PathStep } from '../types/store';

interface DirectionsPanelProps {
  path: PathStep[];
  estimatedTime: number;
  totalDistance: number;
}

export default function DirectionsPanel({ 
  path, 
  estimatedTime, 
  totalDistance 
}: DirectionsPanelProps) {
  const getStepIcon = (instruction?: string) => {
    if (!instruction) return '📍';
    
    if (instruction.includes('Start') || instruction.includes('Entrance')) return '🚪';
    if (instruction.includes('Checkout') || instruction.includes('Finally')) return '🛒';
    if (instruction.includes('Dairy')) return '🥛';
    if (instruction.includes('Produce')) return '🍎';
    if (instruction.includes('Meat') || instruction.includes('Deli')) return '🥩';
    if (instruction.includes('Frozen')) return '🧊';
    if (instruction.includes('Bakery')) return '🍞';
    if (instruction.includes('Beverages')) return '🥤';
    if (instruction.includes('Snacks')) return '🍿';
    if (instruction.includes('Personal Care')) return '🧴';
    return '👣';
  };

  if (path.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center text-gray-500">
          <Store className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to Navigate</h3>
          <p className="text-sm">Select items from your shopping list to generate zone-based directions through the store</p>
        </div>
      </div>
    );
  }

  // Filter out steps that have instructions (zone-based steps)
  const instructionSteps = path.filter(step => step.instruction);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-[#04b7cf]" />
        <h3 className="text-lg font-semibold text-gray-800">Store Navigation</h3>
      </div>

      {/* Route Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#04b7cf]" />
          <div>
            <span className="text-xs text-gray-600 block">Estimated Time</span>
            <span className="font-semibold text-gray-800">{estimatedTime} min</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#04b7cf]" />
          <div>
            <span className="text-xs text-gray-600 block">Total Distance</span>
            <span className="font-semibold text-gray-800">{totalDistance} steps</span>
          </div>
        </div>
      </div>

      {/* Zone-based directions */}
      <div className="space-y-4">
        {instructionSteps.map((step, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#04b7cf] to-[#0396b3] text-white rounded-full flex items-center justify-center text-lg shadow-sm">
              {getStepIcon(step.instruction)}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-[#04b7cf] bg-blue-50 px-2 py-1 rounded-full">
                  Step {index + 1}
                </span>
              </div>
              <p className="text-gray-800 font-medium leading-relaxed text-sm">
                {step.instruction}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Route completion message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">
            Zone-based route optimized!
          </p>
        </div>
        <p className="text-green-700 text-sm">
          Follow the highlighted path on the store map. Your route efficiently guides you through each store section to collect all selected items.
        </p>
      </div>
    </div>
  );
}