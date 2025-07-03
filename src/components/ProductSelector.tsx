import React, { useState } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { Product } from "../types/store";

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productId: string) => void;
  onProductRemove: (productId: string) => void;
  onGenerateRoute: () => void;
}

export default function ProductSelector({
  products,
  selectedProducts,
  onProductSelect,
  onProductRemove,
  onGenerateRoute,
}: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedProductsData = products.filter((p) =>
    selectedProducts.includes(p.id)
  );

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#04b7cf]" />
          Shopping List
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04b7cf] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04b7cf] focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Products */}
      {selectedProductsData.length > 0 && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-700 mb-2">
            Selected Items ({selectedProductsData.length})
          </h3>
          <div className="max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            <div className="space-y-2">
              {selectedProductsData.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      {product.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.category})
                    </span>
                  </div>
                  <button
                    onClick={() => onProductRemove(product.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onGenerateRoute}
            className="w-full mt-3 bg-[#04b7cf] text-white py-2 rounded-lg hover:bg-[#0396b3] transition-colors font-medium"
          >
            Generate Route
          </button>
        </div>
      )}

      {/* Product List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onProductSelect(product.id)}
              disabled={selectedProducts.includes(product.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedProducts.includes(product.id)
                  ? "bg-[#04cf84] text-white border-[#04cf84]"
                  : "bg-white border-gray-200 hover:border-[#04b7cf] hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{product.name}</div>
              <div className="text-sm opacity-75">{product.category}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
