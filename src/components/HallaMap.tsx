/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRAILS, HOURLY_CONGESTION_PROFILES } from '../data/jejuBigData';
import { TrailID, TrailInfo, Checkpoint } from '../types';
import { Map, MapPin, Compass, Eye, AlertTriangle, CloudSun, Calendar, Clock, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HallaMapProps {
  selectedTrailId: TrailID | null;
  onSelectTrail: (id: TrailID) => void;
  selectedHour: number;
}

export default function HallaMap({ selectedTrailId, onSelectTrail, selectedHour }: HallaMapProps) {
  const [hoveredTrailId, setHoveredTrailId] = useState<TrailID | null>(null);
  const [showBottlenecksOnly, setShowBottlenecksOnly] = useState<boolean>(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [isElevationExpanded, setIsElevationExpanded] = useState<boolean>(true);

  // Helper to determine color based on congestion index (0 to 1)
  const getCongestionColor = (factor: number) => {
    if (factor <= 0.25) return '#10b981'; // Green - Smooth/쾌적
    if (factor <= 0.55) return '#f59e0b'; // Amber - Mild/보통
    if (factor <= 0.82) return '#f97316'; // Orange - Congested/혼잡
    return '#ef4444'; // Red - Severely Congested/매우 혼잡
  };

  const getCongestionLabel = (factor: number) => {
    if (factor <= 0.25) return { text: '쾌적', style: 'text-emerald-400 bg-emerald-900/40 border border-emerald-500/20' };
    if (factor <= 0.55) return { text: '보통', style: 'text-amber-400 bg-amber-900/40 border border-amber-500/20' };
    if (factor <= 0.82) return { text: '혼잡', style: 'text-orange-400 bg-orange-950/40 border border-orange-500/20' };
    return { text: '정체 정점', style: 'text-rose-400 bg-rose-950/40 border border-rose-500/20' };
  };

  // Trail Coordinates for drawing the custom SVG Map
  // SVG Canvas Center: (350, 250) represents Baengnokdam Summit
  // Witse Oreum Node: (250, 280) represents the high plateau junction
  // Southern Wall Junction: (330, 310)
  const mapTrails = {
    seongpanak: {
      path: 'M 350 250 L 420 280 L 490 270 L 550 310 L 620 330', // From Summit (350,250) to start (620,330)
      checkpoints: [
        { cx: 620, cy: 330, label: 'sp_start' },
        { cx: 550, cy: 310, label: 'sp_sokbat' },
        { cx: 490, cy: 270, label: 'sp_sara' },
        { cx: 420, cy: 280, label: 'sp_jindallae' },
        { cx: 350, cy: 250, label: 'sp_summit' }
      ]
    },
    gwaneumsa: {
      path: 'M 350 250 L 320 180 L 350 140 L 300 110 L 320 60', // From Summit (350,250) to start (320,60)
      checkpoints: [
        { cx: 320, cy: 60, label: 'gw_start' },
        { cx: 300, cy: 110, label: 'gw_tamna' },
        { cx: 350, cy: 140, label: 'gw_samgak' },
        { cx: 320, cy: 180, label: 'gw_wangwan' },
        { cx: 350, cy: 250, label: 'gw_summit' }
      ]
    },
    yeongsil: {
      path: 'M 250 280 L 210 260 L 170 300 L 120 330 L 70 370', // From Witse Oreum (250,280) to start (70,370)
      checkpoints: [
        { cx: 70, cy: 370, label: 'ys_start_low' },
        { cx: 120, cy: 330, label: 'ys_start_up' },
        { cx: 170, cy: 300, label: 'ys_giam' },
        { cx: 210, cy: 260, label: 'ys_slope' },
        { cx: 250, cy: 280, label: 'ys_witse' }
      ]
    },
    eorimok: {
      path: 'M 250 280 L 210 220 L 150 190 L 110 150 L 90 95', // From Witse Oreum (250,280) to start (90,95)
      checkpoints: [
        { cx: 90, cy: 95, label: 'er_start' },
        { cx: 110, cy: 150, label: 'er_forest' },
        { cx: 150, cy: 190, label: 'er_sajebi' },
        { cx: 210, cy: 220, label: 'er_manse' },
        { cx: 250, cy: 280, label: 'er_witse' }
      ]
    },
    donnaeko: {
      path: 'M 250 280 L 330 310 L 370 360 L 400 410 L 450 450', // From Witse Oreum to SouthWall to start (450,450)
      checkpoints: [
        { cx: 450, cy: 450, label: 'dn_start' },
        { cx: 400, cy: 410, label: 'dn_salogi' },
        { cx: 370, cy: 360, label: 'dn_pyeonggwe' },
        { cx: 330, cy: 310, label: 'dn_southwall' }
      ]
    }
  };

  const activeTrail = selectedTrailId ? TRAILS[selectedTrailId] : null;

  return (
    <div className="bg-[#E4E3E0] border border-[#141414] overflow-hidden shadow-sm flex flex-col h-full" id="halla-map-panel">
      {/* Map Interactive Controls */}
      <div className="p-5 border-b border-[#141414] bg-[#D8D7D4] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#141414]" />
          <div>
            <h3 className="font-serif italic text-base text-[#141414] flex flex-wrap items-center gap-2">
              한라산 실시간 탐방로 혼잡 지형도 (TRAIL MAP)
              <span className="text-[10px] text-[#141414] font-bold font-mono tracking-wider bg-white px-2 py-0.5 border border-[#141414]">
                T: {selectedHour.toString().padStart(2, '0')}:00 INDEX
              </span>
            </h3>
            <p className="text-xs text-[#141414]/75 font-mono">Select a trail to synchronize with the real-time prediction and elevation profiles.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBottlenecksOnly(!showBottlenecksOnly)}
            className={`text-xs px-3 py-1.5 border font-semibold font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              showBottlenecksOnly
                ? 'bg-[#141414] border-[#141414] text-white'
                : 'bg-white border-[#141414] text-[#141414] hover:bg-[#D8D7D4]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            병목구간 필터
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 relative min-h-[460px]">
        {/* Interactive Topographic SVG Stage */}
        <div className="lg:col-span-8 bg-[#D8D7D4] relative flex items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-[#141414] overflow-hidden">
          {/* Topography Grid & Mountains Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[radial-gradient(#141414_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Compass Rose */}
          <div className="absolute top-4 right-4 text-xs text-[#141414]/80 font-mono flex flex-col items-center select-none pointer-events-none">
            <div className="font-bold border border-[#141414] bg-white p-1 w-6 h-6 flex items-center justify-center">N</div>
            <div className="text-[9px] mt-0.5 font-bold">NORTH</div>
          </div>

          <svg
            viewBox="0 0 700 500"
            className="w-full max-w-[620px] h-auto drop-shadow-sm relative z-10"
            id="halla-trail-canvas"
          >
            <defs>
              {/* Radial Elevation Gradients */}
              <radialGradient id="mountain-base" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C4C3C0" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#D8D7D4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#E4E3E0" stopOpacity="1" />
              </radialGradient>
              {/* Glow filter for highlighted paths */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Simulated Contour Rings for Topographic Effect */}
            <circle cx="350" cy="250" r="230" fill="url(#mountain-base)" stroke="#141414" strokeWidth="0.5" strokeDasharray="4,4" className="opacity-30" />
            <circle cx="350" cy="250" r="180" fill="transparent" stroke="#141414" strokeWidth="0.5" strokeDasharray="3,3" className="opacity-35" />
            <circle cx="350" cy="250" r="120" fill="transparent" stroke="#141414" strokeWidth="0.5" strokeDasharray="2,2" className="opacity-40" />
            <circle cx="350" cy="250" r="60" fill="transparent" stroke="#141414" strokeWidth="0.5" className="opacity-50" />
            
            {/* Altitudes Markers */}
            <text x="350" y="490" fill="#141414" fontSize="10" textAnchor="middle" fontFamily="monospace" opacity="0.6">Outer Basin (해발 500m)</text>
            <text x="350" y="380" fill="#141414" fontSize="10" textAnchor="middle" fontFamily="monospace" opacity="0.7">Oreum Fields (해발 1,000m)</text>
            <text x="350" y="318" fill="#141414" fontSize="10" textAnchor="middle" fontFamily="monospace" opacity="0.8">Witse Plateau (해발 1,500m)</text>
            <text x="350" y="235" fill="#141414" fontSize="11" fontWeight="bold" textAnchor="middle">백록담 (1,950m)</text>

            {/* Draw Path Lines for Each Trail */}
            {(Object.keys(mapTrails) as TrailID[]).map((trailId) => {
              const info = TRAILS[trailId];
              const mapData = mapTrails[trailId];
              const flowFactor = HOURLY_CONGESTION_PROFILES[trailId][selectedHour] || 0.1;
              const color = getCongestionColor(flowFactor);
              
              const isSelected = selectedTrailId === trailId;
              const isHovered = hoveredTrailId === trailId;
              
              return (
                <g key={trailId} className="cursor-pointer">
                  {/* Invisible broad hover catchment zone */}
                  <path
                    d={mapData.path}
                    fill="transparent"
                    stroke="transparent"
                    strokeWidth="24"
                    onClick={() => {
                      onSelectTrail(trailId);
                      setSelectedCheckpoint(null);
                    }}
                    onMouseEnter={() => setHoveredTrailId(trailId)}
                    onMouseLeave={() => setHoveredTrailId(null)}
                  />

                  {/* Pulsing glow background for selected trail */}
                  {isSelected && (
                    <path
                      d={mapData.path}
                      fill="transparent"
                      stroke={color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                      className="opacity-40"
                    />
                  )}

                  {/* Core Trail Line */}
                  <path
                    d={mapData.path}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={isSelected ? '6' : isHovered ? '4.5' : '3.5'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                    onClick={() => {
                      onSelectTrail(trailId);
                      setSelectedCheckpoint(null);
                    }}
                    onMouseEnter={() => setHoveredTrailId(trailId)}
                    onMouseLeave={() => setHoveredTrailId(null)}
                  />
                </g>
              );
            })}

            {/* Checkpoints & Labels */}
            {(Object.keys(mapTrails) as TrailID[]).map((trailId) => {
              const info = TRAILS[trailId];
              const mapData = mapTrails[trailId];
              
              const isTrailSelected = selectedTrailId === trailId;

              return mapData.checkpoints.map((cpNode) => {
                const fullCheckpoint = info.checkpoints.find(c => c.id === cpNode.label);
                if (!fullCheckpoint) return null;

                // Filter logic
                if (showBottlenecksOnly && !fullCheckpoint.isBottleneck) return null;

                const isSelectedCp = selectedCheckpoint?.id === fullCheckpoint.id;
                
                // Highlight point if trail is active or selected CP is matching
                const pointRadius = isSelectedCp ? 7.5 : fullCheckpoint.isBottleneck ? 5.5 : 4.5;
                const pointColor = fullCheckpoint.isBottleneck 
                  ? '#df5310' // Bold red/amber
                  : isTrailSelected ? '#15803d' : '#4b5563';

                return (
                  <g 
                    key={fullCheckpoint.id}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTrail(trailId);
                      setSelectedCheckpoint(fullCheckpoint);
                    }}
                  >
                    {/* Ring for Bottlenecks & Selected states */}
                    {(fullCheckpoint.isBottleneck || isSelectedCp) && (
                      <circle
                        cx={cpNode.cx}
                        cy={cpNode.cy}
                        r={pointRadius + 4}
                        fill="transparent"
                        stroke={pointColor}
                        strokeWidth="1.5"
                        className="animate-ping opacity-35"
                        style={{ animationDuration: '2s' }}
                      />
                    )}

                    {/* Outer hover area */}
                    <circle
                      cx={cpNode.cx}
                      cy={cpNode.cy}
                      r={pointRadius + 6}
                      fill="transparent"
                      className="group-hover:fill-[#141414]/10 transition-colors"
                    />

                    {/* Main Node Dot */}
                    <circle
                      cx={cpNode.cx}
                      cy={cpNode.cy}
                      r={pointRadius}
                      fill={pointColor}
                      stroke={isSelectedCp ? '#ffffff' : '#141414'}
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />

                    {/* Highly descriptive tooltip labels for primary trail checkpoints */}
                    {(isTrailSelected || isSelectedCp || fullCheckpoint.isBottleneck) && (
                      <g className="pointer-events-none">
                        <rect
                          x={cpNode.cx - 50}
                          y={cpNode.cy - 25}
                          width="100"
                          height="16"
                          rx="0"
                          fill="#141414"
                          stroke={fullCheckpoint.isBottleneck ? '#ea580c' : '#ffffff'}
                          strokeWidth="1"
                        />
                        <text
                          x={cpNode.cx}
                          y={cpNode.cy - 14}
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight={fullCheckpoint.isBottleneck ? 'bold' : 'normal'}
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {fullCheckpoint.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              });
            })}

            {/* Core Centers Labels */}
            <g className="pointer-events-none">
              {/* Baengnokdam Center Star Node */}
              <polygon points="350,238 353,245 361,245 354,249 357,256 350,251 343,256 346,249 339,245 347,245" fill="#df5310" stroke="#141414" strokeWidth="0.5" />
              <text x="350" y="267" fill="#141414" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">백록담 분화구</text>
              
              {/* Witse Oreum Junction */}
              <circle cx="250" cy="280" r="5" fill="#6b21a8" stroke="#141414" strokeWidth="1" />
              <text x="250" y="297" fill="#6b21a8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">윗세오름 대피소</text>
            </g>
          </svg>

          {/* Quick legend scale */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 p-3 border border-[#141414] bg-white text-xs select-none">
            <span className="text-[10px] text-[#141414]/70 font-mono font-bold uppercase tracking-wider mb-1">혼잡 수준 범례</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 bg-emerald-500 border border-[#141414] block" />
              <span className="text-[#141414] font-mono text-[10px]">원활 (0% ~ 25%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 bg-amber-500 border border-[#141414] block" />
              <span className="text-[#141414] font-mono text-[10px]">보통 (26% ~ 55%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 bg-orange-500 border border-[#141414] block" />
              <span className="text-[#141414] font-mono text-[10px]">혼잡 (56% ~ 82%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1.5 bg-red-500 border border-[#141414] block" />
              <span className="text-[#141414] font-mono text-[10px]">정체 (83% 이상)</span>
            </div>
          </div>
        </div>

        {/* Trail / Checkpoint Detail Sidebar */}
        <div className="lg:col-span-4 bg-white p-5 flex flex-col gap-4 overflow-y-auto border-t lg:border-t-0 border-[#141414]">
          <AnimatePresence mode="wait">
            {activeTrail ? (
              <motion.div
                key={activeTrail.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-4 h-full justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-[#141414]/60">SELECTED TRAIL</span>
                      <h4 className="font-serif italic font-bold text-lg text-[#141414] flex items-center gap-2 mt-0.5">
                        {activeTrail.name}
                        {activeTrail.reservationRequired && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-white text-[#141414] font-semibold border border-[#141414] font-mono">
                            RESERVATION_REQ
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-[#141414]/70 mt-0.5 font-mono">{activeTrail.engName.toUpperCase()}</p>
                    </div>
                  </div>

                  <hr className="border-[#141414]/20 my-3" />

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3 font-mono">
                    <div className="p-2 border border-[#141414] bg-[#E4E3E0]/20">
                      <span className="text-[#141414]/60 text-[9px] block">TOTAL_LENGTH</span>
                      <p className="text-[#141414] font-bold text-sm mt-0.5">{activeTrail.length} km</p>
                    </div>
                    <div className="p-2 border border-[#141414] bg-[#E4E3E0]/20">
                      <span className="text-[#141414]/60 text-[9px] block">DIFFICULTY_GRADE</span>
                      <p className={`font-bold text-sm mt-0.5 ${
                        activeTrail.difficulty === 'EXPERT' ? 'text-red-700' :
                        activeTrail.difficulty === 'HARD' ? 'text-amber-700' :
                        activeTrail.difficulty === 'MODERATE' ? 'text-amber-600' : 'text-green-700'
                      }`}>{activeTrail.difficultyKorean}</p>
                    </div>
                    <div className="p-2 border border-[#141414] bg-[#E4E3E0]/20">
                      <span className="text-[#141414]/60 text-[9px] block">ETA_DURATION</span>
                      <p className="text-[#141414] font-bold text-sm mt-0.5">{activeTrail.duration} Hours</p>
                    </div>
                    <div className="p-2 border border-[#141414] bg-[#E4E3E0]/20">
                      <span className="text-[#141414]/60 text-[9px] block">ELEVATION_GAIN</span>
                      <p className="text-[#141414] font-bold text-sm mt-0.5">▲ {activeTrail.elevationGain}m</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#141414] leading-relaxed bg-[#E4E3E0]/40 p-3 border border-[#141414]">
                    {activeTrail.description}
                  </p>

                  {/* Selected Checkpoint Information Block */}
                  {selectedCheckpoint && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-[#141414]">
                      <h5 className="text-xs font-bold text-[#141414] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        CHECKPOINT: {selectedCheckpoint.name}
                      </h5>
                      <span className="text-[9px] text-[#141414]/70 font-mono block mt-0.5">
                        ALTITUDE {selectedCheckpoint.elevation}M | DISTANCE {selectedCheckpoint.distanceFromStart}KM
                      </span>
                      <p className="text-xs text-[#141414] mt-1.5">{selectedCheckpoint.description}</p>
                      
                      {selectedCheckpoint.isBottleneck && (
                        <div className="mt-2 text-[11px] text-red-800 leading-tight bg-red-100 p-2 border border-red-600 font-mono">
                          <strong>BOTTLENECK_FACTOR:</strong> {selectedCheckpoint.bottleneckReason}
                        </div>
                      )}
                    </div>
                  )}

                  {!selectedCheckpoint && (
                    <div className="mt-4 p-3 bg-[#E4E3E0]/20 border border-dashed border-[#141414] text-center font-mono">
                      <p className="text-[10px] text-[#141414]/70">SELECT_A_NODE_FOR_SENSORY_Breakdowns</p>
                    </div>
                  )}
                </div>

                {/* Elevation Profile widget */}
                {isElevationExpanded && (
                  <div className="mt-4 bg-[#E4E3E0]/30 border border-[#141414] p-3">
                    <span className="text-[9px] text-[#141414]/70 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Eye className="w-3.5 h-3.5 text-[#141414]" />
                      ELEVATION PROFILE (고도 단면)
                    </span>
                    
                    {/* SVG Elevation Graphic */}
                    <div className="h-24 w-full bg-white border border-[#141414] relative flex items-end overflow-hidden p-1">
                      <svg className="w-full h-full" viewBox="0 0 300 80" preserveAspectRatio="none">
                        {/* Shaded Area for Elevation */}
                        <path
                          d={`M 0,80 
                             L 60,${80 - (activeTrail.checkpoints[1]?.elevation - activeTrail.startElevation) / activeTrail.elevationGain * 60 - 5}
                             L 120,${80 - (activeTrail.checkpoints[2]?.elevation - activeTrail.startElevation) / activeTrail.elevationGain * 60 - 5}
                             L 200,${80 - (activeTrail.checkpoints[3]?.elevation - activeTrail.startElevation) / activeTrail.elevationGain * 60 - 5}
                             L 300,${80 - (activeTrail.checkpoints[4]?.elevation - activeTrail.startElevation) / activeTrail.elevationGain * 60 - 5}
                             L 300,80 Z`}
                          fill="url(#elevation-grad)"
                          stroke="#141414"
                          strokeWidth="2"
                        />
                        <defs>
                          <linearGradient id="elevation-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#141414" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#141414" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Hover lines represent markers */}
                        {activeTrail.checkpoints.map((cp, idx) => {
                          const x = (idx / (activeTrail.checkpoints.length - 1)) * 300;
                          return (
                            <line
                              key={cp.id}
                              x1={x}
                              y1={0}
                              x2={x}
                              y2={80}
                              stroke="#141414"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                              opacity="0.30"
                            />
                          );
                        })}
                      </svg>
                      {/* Interactive labels inside coordinate range */}
                      <div className="absolute top-1 left-2 text-[8px] text-[#141414] font-mono bg-white px-1 border border-[#141414]/30">PEAK: {activeTrail.endElevation}m</div>
                      <div className="absolute bottom-1 left-2 text-[8px] text-[#141414] font-mono bg-white px-1 border border-[#141414]/30">BASE: {activeTrail.startElevation}m</div>
                      <div className="absolute bottom-1 right-2 text-[8px] text-[#141414] font-mono">{activeTrail.length}km</div>
                    </div>

                    <div className="flex justify-between items-center mt-2 text-[8px] text-[#141414]/80 font-mono px-0.5">
                      <span>{activeTrail.checkpoints[0]?.name}</span>
                      <span>{activeTrail.checkpoints[activeTrail.checkpoints.length - 1]?.name}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full text-[#141414]/60 p-8 font-mono">
                <Map className="w-12 h-12 text-[#141414] mb-3 opacity-60" />
                <p className="text-xs font-bold text-[#141414]">NO_ACTIVE_TRAIL_SELECTION</p>
                <p className="text-[10px] text-[#141414]/70 mt-1 max-w-[200px]">
                  Click on any trail on the sensory graphic layout to mount telemetry metadata.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
