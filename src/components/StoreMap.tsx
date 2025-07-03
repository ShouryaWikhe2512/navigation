import React, { useEffect, useRef } from "react";
import { Position, PathStep, Aisle } from "../types/store";
import { entrance, checkout } from "../data/storeData";

interface StoreMapProps {
  aisles: Aisle[];
  highlightedAisles: string[];
  path: PathStep[];
  onPathComplete: () => void;
}

const CELL_SIZE = 24;

export default function StoreMap({
  aisles,
  highlightedAisles,
  path,
  onPathComplete,
}: StoreMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (path.length > 0) {
      // Animate path drawing
      const pathElements = svgRef.current?.querySelectorAll(".path-segment");
      if (pathElements) {
        pathElements.forEach((element, index) => {
          const pathElement = element as SVGElement;
          pathElement.style.strokeDasharray = "5,5";
          pathElement.style.strokeDashoffset = "10";
          pathElement.style.animation = `drawPath 0.5s ease-in-out ${
            index * 0.1
          }s forwards`;
        });
      }

      // Complete animation after all segments are drawn
      setTimeout(() => {
        onPathComplete();
      }, path.length * 100 + 500);
    }
  }, [path, onPathComplete]);

  const renderPath = () => {
    if (path.length < 2) return null;

    const pathSegments = [];
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];

      pathSegments.push(
        <line
          key={`path-${i}`}
          className="path-segment"
          x1={current.position.x * CELL_SIZE + CELL_SIZE / 2}
          y1={current.position.y * CELL_SIZE + CELL_SIZE / 2}
          x2={next.position.x * CELL_SIZE + CELL_SIZE / 2}
          y2={next.position.y * CELL_SIZE + CELL_SIZE / 2}
          stroke="#04b7cf"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    }

    return pathSegments;
  };

  const renderPathDots = () => {
    return path.map((step, index) => (
      <circle
        key={`dot-${index}`}
        cx={step.position.x * CELL_SIZE + CELL_SIZE / 2}
        cy={step.position.y * CELL_SIZE + CELL_SIZE / 2}
        r="4"
        fill="#04b7cf"
        className="animate-pulse"
        style={{
          animationDelay: `${index * 0.1}s`,
        }}
      />
    ));
  };

  return (
    <div className="relative bg-gray-100 p-6 rounded-lg">
      <svg
        ref={svgRef}
        width={20 * CELL_SIZE}
        height={15 * CELL_SIZE}
        className="border-2 border-gray-300 rounded-lg bg-white"
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width={CELL_SIZE}
            height={CELL_SIZE}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${CELL_SIZE} 0 L 0 0 0 ${CELL_SIZE}`}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Aisles */}
        {aisles.map((aisle) => (
          <g key={aisle.id}>
            <rect
              x={aisle.position.x * CELL_SIZE}
              y={aisle.position.y * CELL_SIZE}
              width={aisle.width * CELL_SIZE}
              height={aisle.height * CELL_SIZE}
              fill={
                highlightedAisles.includes(aisle.id) ? aisle.color : "#e5e7eb"
              }
              stroke={
                highlightedAisles.includes(aisle.id) ? "#374151" : "#9ca3af"
              }
              strokeWidth="2"
              rx="4"
              className={`transition-all duration-300 ${
                highlightedAisles.includes(aisle.id) ? "shadow-lg" : ""
              }`}
            />
            <text
              x={aisle.position.x * CELL_SIZE + (aisle.width * CELL_SIZE) / 2}
              y={aisle.position.y * CELL_SIZE + (aisle.height * CELL_SIZE) / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-semibold fill-white"
              style={{ userSelect: "none" }}
            >
              {aisle.name}
            </text>
          </g>
        ))}

        {/* Entrance */}
        <g>
          <rect
            x={entrance.x * CELL_SIZE}
            y={entrance.y * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#10b981"
            stroke="#065f46"
            strokeWidth="2"
            rx="4"
          />
          <text
            x={entrance.x * CELL_SIZE + CELL_SIZE / 2}
            y={entrance.y * CELL_SIZE + CELL_SIZE / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-white"
            style={{ userSelect: "none" }}
          >
            IN
          </text>
        </g>

        {/* Checkout */}
        <g>
          <rect
            x={checkout.x * CELL_SIZE}
            y={checkout.y * CELL_SIZE}
            width={CELL_SIZE}
            height={CELL_SIZE}
            fill="#ef4444"
            stroke="#7f1d1d"
            strokeWidth="2"
            rx="4"
          />
          <text
            x={checkout.x * CELL_SIZE + CELL_SIZE / 2}
            y={checkout.y * CELL_SIZE + CELL_SIZE / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-bold fill-white"
            style={{ userSelect: "none" }}
          >
            OUT
          </text>
        </g>

        {/* Path */}
        {renderPath()}
        {renderPathDots()}
      </svg>

      {/* Pulse animation background */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-16 h-16 bg-[#51c995] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-12 right-12 w-12 h-12 bg-[#04b7cf] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-[#04cf84] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div> */}
    </div>
  );
}
