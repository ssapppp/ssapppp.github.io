/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { YEARLY_VISITORS, MONTHLY_DISTRIBUTIONS, TRAILS } from '../data/jejuBigData';
import { BarChart3, TrendingUp, CalendarDays, Filter, HelpCircle, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface VisitorChartProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export default function VisitorChart({ selectedYear, onSelectYear }: VisitorChartProps) {
  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly'>('yearly');
  const [selectedTrailFilter, setSelectedTrailFilter] = useState<'all' | 'seongpanak' | 'gwaneumsa' | 'yeongsil' | 'eorimok' | 'donnaeko'>('all');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any | null>(null);

  // Parse max values for chart scaling
  const maxTotal = Math.max(...YEARLY_VISITORS.map(d => d.total));
  const maxSingle = Math.max(...YEARLY_VISITORS.map(d => {
    return Math.max(d.seongpanak, d.gwaneumsa, d.yeongsil, d.eorimok, d.donnaeko);
  }));

  const getTrailColor = (id: string) => {
    switch(id) {
      case 'seongpanak': return '#10b981'; // Emerald
      case 'gwaneumsa': return '#8b5cf6'; // Violet
      case 'yeongsil': return '#f59e0b'; // Amber
      case 'eorimok': return '#3b82f6'; // Blue
      case 'donnaeko': return '#ec4899'; // Pink
      default: return '#64748b';
    }
  };

  const getTrailKorean = (id: string) => {
    if (id === 'seongpanak') return '성판악';
    if (id === 'gwaneumsa') return '관음사';
    if (id === 'yeongsil') return '영실';
    if (id === 'eorimok') return '어리목';
    if (id === 'donnaeko') return '돈내코';
    return '전체';
  };

  // Policy annotation highlights by year
  const getYearAnnotation = (year: number) => {
    if (year === 2020) return '🦠 코로나19 경제위축 감소';
    if (year === 2021) return '🎟️ 주말 사전 예약제(성판악/관음사) 최초 실시';
    if (year === 2022) return '🔄 당일 대기인원 우회로 영실/어리목 풍선효과';
    if (year === 2025) return '🌲 사계절 웰니스 야외활동 급증';
    if (year === 2026) return '📈 2026 빅데이터 인공지능 예측 정점';
    return null;
  };

  return (
    <div className="bg-[#E4E3E0] border border-[#141414] overflow-hidden shadow-sm flex flex-col h-full" id="visitor-chart-panel">
      {/* Tab Selectors */}
      <div className="p-4 bg-[#D8D7D4] border-b border-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#141414]" />
          <h3 className="font-serif italic font-bold text-[#141414] text-sm">연간 한라산 탐방 빅데이터 추이 (VISITOR RUNTIME)</h3>
        </div>
        <div className="flex bg-white p-0.5 border border-[#141414] rounded-none">
          <button
            onClick={() => setActiveTab('yearly')}
            className={`text-xs px-3 py-1 font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'yearly' ? 'bg-[#141414] text-white' : 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#D8D7D4]/40'
            }`}
          >
            연도별 추이 분석
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`text-xs px-3 py-1 font-mono font-semibold transition-all cursor-pointer ${
              activeTab === 'monthly' ? 'bg-[#141414] text-white' : 'text-[#141414]/70 hover:text-[#141414] hover:bg-[#D8D7D4]/40'
            }`}
          >
            월별 시즌 인파
          </button>
        </div>
      </div>

      {activeTab === 'yearly' ? (
        <div className="p-5 flex-1 flex flex-col gap-4">
          {/* Chart Controls & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#D8D7D4]/30 p-3 border border-[#141414] font-mono">
            <span className="text-xs text-[#141414]/80 flex items-center gap-1.5 font-bold">
              <Filter className="w-3.5 h-3.5 text-[#141414]" />
              등산로 필터 (TRAILS_FILTER):
            </span>
            <div className="flex flex-wrap gap-1">
              {(['all', 'seongpanak', 'gwaneumsa', 'yeongsil', 'eorimok', 'donnaeko'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedTrailFilter(filter)}
                  className={`text-[10px] px-2.5 py-1 border transition-all cursor-pointer font-bold ${
                    selectedTrailFilter === filter
                      ? 'bg-[#141414] border-[#141414] text-white'
                      : 'bg-white border-[#141414] text-[#141414]/75 hover:bg-[#D8D7D4]'
                  }`}
                >
                  {getTrailKorean(filter).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Multi-axis Chart */}
          <div className="flex-1 min-h-[220px] relative mt-2 flex items-end">
            <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-[0.12]">
              {/* grid lines */}
              <div className="border-t border-dashed border-[#141414] w-full" />
              <div className="border-t border-dashed border-[#141414] w-full" />
              <div className="border-t border-dashed border-[#141414] w-full" />
              <div className="border-t border-dashed border-[#141414] w-full" />
              <div className="border-t border-dashed border-[#141414] w-full" />
            </div>

            {/* Custom SVG Coordinate Space */}
            <svg viewBox="0 0 500 180" className="w-full h-full min-h-[180px] overflow-visible relative z-10">
              {YEARLY_VISITORS.map((data, idx) => {
                const x = 32 + idx * 52;
                const isSelectedYear = data.year === selectedYear;

                // Determine height based on filter
                let val = data.total;
                let heightScaler = maxTotal;

                if (selectedTrailFilter !== 'all') {
                  val = (data as any)[selectedTrailFilter];
                  heightScaler = maxSingle;
                }

                // 140 max pixels high
                const height = (val / heightScaler) * 125;
                const y = 145 - height;
                const barWidth = 24;

                return (
                  <g 
                    key={data.year}
                    className="cursor-pointer group"
                    onClick={() => onSelectYear(data.year)}
                    onMouseEnter={() => setHoveredDataPoint({ ...data, x, y, val })}
                    onMouseLeave={() => setHoveredDataPoint(null)}
                  >
                    {/* Shadow overlay/glow for active year selection */}
                    {isSelectedYear && (
                      <rect
                        x={x - 4}
                        y={10}
                        width={barWidth + 8}
                        height="140"
                        fill="rgba(20,20,20,0.06)"
                        stroke="#141414"
                        strokeDasharray="2,2"
                        strokeWidth="1"
                      />
                    )}

                    {/* Stacking rendering vs Single trail bar representation */}
                    {selectedTrailFilter === 'all' ? (
                      // Stacked trails bar segment
                      <g>
                        {/* Donnaeko */}
                        <rect
                          x={x}
                          y={145 - (data.total / maxTotal) * 125}
                          width={barWidth}
                          height={(data.total / maxTotal) * 125}
                          fill={getTrailColor('donnaeko')}
                          stroke="#141414"
                          strokeWidth="0.5"
                        />
                        {/* Eorimok */}
                        <rect
                          x={x}
                          y={145 - ((data.seongpanak + data.gwaneumsa + data.yeongsil + data.eorimok) / maxTotal) * 125}
                          width={barWidth}
                          height={((data.seongpanak + data.gwaneumsa + data.yeongsil + data.eorimok) / maxTotal) * 125}
                          fill={getTrailColor('eorimok')}
                          stroke="#141414"
                          strokeWidth="0.5"
                        />
                        {/* Yeongsil */}
                        <rect
                          x={x}
                          y={145 - ((data.seongpanak + data.gwaneumsa + data.yeongsil) / maxTotal) * 125}
                          width={barWidth}
                          height={((data.seongpanak + data.gwaneumsa + data.yeongsil) / maxTotal) * 125}
                          fill={getTrailColor('yeongsil')}
                          stroke="#141414"
                          strokeWidth="0.5"
                        />
                        {/* Gwaneumsa */}
                        <rect
                          x={x}
                          y={145 - ((data.seongpanak + data.gwaneumsa) / maxTotal) * 125}
                          width={barWidth}
                          height={((data.seongpanak + data.gwaneumsa) / maxTotal) * 125}
                          fill={getTrailColor('gwaneumsa')}
                          stroke="#141414"
                          strokeWidth="0.5"
                        />
                        {/* Seongpanak */}
                        <rect
                          x={x}
                          y={145 - (data.seongpanak / maxTotal) * 125}
                          width={barWidth}
                          height={(data.seongpanak / maxTotal) * 125}
                          fill={getTrailColor('seongpanak')}
                          stroke="#141414"
                          strokeWidth="0.5"
                        />
                      </g>
                    ) : (
                      // Single solid bar representing specified trail
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={height}
                        fill={getTrailColor(selectedTrailFilter)}
                        stroke="#141414"
                        strokeWidth="1"
                        className="transition-all duration-300"
                      />
                    )}

                    {/* Interactive Selection Highlight Circle on top */}
                    {isSelectedYear && (
                      <circle
                        cx={x + barWidth / 2}
                        cy={y - 6}
                        r="4"
                        fill="#ffffff"
                        stroke="#141414"
                        strokeWidth="2"
                      />
                    )}

                    {/* Year Label */}
                    <text
                      x={x + barWidth / 2}
                      y="160"
                      fill="#141414"
                      fontSize="9.5"
                      fontWeight={isSelectedYear ? 'bold' : 'normal'}
                      textAnchor="middle"
                      className="font-mono transition-all"
                    >
                      {data.year}
                    </text>
                  </g>
                );
              })}

              {/* Base Axis Line */}
              <line x1="15" y1="145" x2="490" y2="145" stroke="#141414" strokeWidth="1.5" />
            </svg>

            {/* Float Tooltip */}
            {hoveredDataPoint && (
              <div 
                className="absolute shadow-sm p-2.5 bg-[#141414] text-white text-xs z-50 pointer-events-none flex flex-col gap-1 min-w-[155px] font-mono border border-white/20"
                style={{ 
                  left: `${(hoveredDataPoint.x / 500) * 100}%`, 
                  bottom: '160px',
                  transform: 'translateX(-50%)'
                }}
              >
                <span className="font-bold border-b border-white/20 pb-1 mb-1 block text-center">
                  YEAR {hoveredDataPoint.year} RECORD
                </span>
                {selectedTrailFilter === 'all' ? (
                  <div className="flex flex-col gap-0.5 text-[10px]">
                    <div className="flex justify-between gap-4 text-emerald-400">
                      <span>성판악:</span>
                      <span>{hoveredDataPoint.seongpanak.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-violet-400">
                      <span>관음사:</span>
                      <span>{hoveredDataPoint.gwaneumsa.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-amber-400">
                      <span>영실:</span>
                      <span>{hoveredDataPoint.yeongsil.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-blue-400">
                      <span>어리목:</span>
                      <span>{hoveredDataPoint.eorimok.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-pink-400">
                      <span>돈내코:</span>
                      <span>{hoveredDataPoint.donnaeko.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/20 mt-1 pt-1 flex justify-between font-bold text-white text-xs">
                      <span>TOTAL:</span>
                      <span>{hoveredDataPoint.total.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/70 font-medium">{getTrailKorean(selectedTrailFilter)}:</span>
                    <span className="font-bold text-emerald-400">{hoveredDataPoint.val.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Annotation Bar */}
          {getYearAnnotation(selectedYear) && (
            <div className="text-xs bg-[#D8D7D4] px-3 py-2 border border-[#141414] flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-[#141414] flex-shrink-0 fill-[#141414]/20" />
              <span className="text-[#141414] font-bold font-mono">{selectedYear}_MOMENTUM:</span>
              <span className="text-[#141414]/90 font-serif italic">{getYearAnnotation(selectedYear)}</span>
            </div>
          )}

          {/* Stacked color keys */}
          {selectedTrailFilter === 'all' && (
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-1 text-[11px] font-mono font-bold select-none text-[#141414]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#10b981] border border-[#141414] rounded-sm" /> 
                <span>성판악</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#8b5cf6] border border-[#141414] rounded-sm" /> 
                <span>관음사</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#f59e0b] border border-[#141414] rounded-sm" /> 
                <span>영실</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#3b82f6] border border-[#141414] rounded-sm" /> 
                <span>어리목</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ec4899] border border-[#141414] rounded-sm" /> 
                <span>돈내코</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-5 flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#141414] flex items-center gap-1 font-mono font-bold">
              <CalendarDays className="w-3.5 h-3.5 text-[#141414]" />
              PARTITIONED SEASONAL DISPERSION (10월 및 1-2월 절정 구간)
            </span>
          </div>

          {/* Responsive grid of Monthly Distribution Cards */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {MONTHLY_DISTRIBUTIONS.map((m) => {
              // Highlight peak months
              const isPeak = m.ratio >= 0.11;
              const ratioPercent = Math.round(m.ratio * 100);

              return (
                <div 
                  key={m.month}
                  className={`p-2.5 border flex flex-col justify-between transition-all ${
                    isPeak 
                      ? 'bg-red-50 border-red-700' 
                      : 'bg-white border-[#141414] hover:bg-[#D8D7D4]/40'
                  }`}
                  title={m.remark}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#141414] font-serif">{m.month}월</span>
                    {isPeak && (
                      <span className="text-[8px] bg-red-100 text-red-800 font-bold px-1 border border-red-700 uppercase tracking-wider font-mono">
                        PEAK
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2.5">
                    <div className="text-[10px] font-mono font-bold text-[#141414]">
                      {ratioPercent}% RATIO
                    </div>
                    {/* Visual Bar representation */}
                    <div className="w-full bg-[#E4E3E0] h-1.5 border border-[#141414] overflow-hidden mt-1">
                      <div 
                        className={`h-full ${isPeak ? 'bg-red-600' : 'bg-[#141414]'}`}
                        style={{ width: `${ratioPercent * 6}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 text-[9px] text-[#141414]/70 flex flex-col gap-0.5 border-t border-[#141414]/20 pt-1.5 font-mono">
                    <span>TEMP: {m.avgTemp}°C</span>
                    <span>RAIN: {m.avgRainfall}mm</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#141414] leading-relaxed bg-[#D8D7D4] p-3 border border-[#141414]/75 mt-2">
            💡 한라산의 가을 단풍이 절정에 닿는 <strong>10월(14%)</strong>과 하얀 눈꽃 상고대 조망을 즐길 수 있는 <strong>1월(12%)</strong>에 관광객 밀집도가 대피소 및 등반 게이트에 기하급수적으로 밀집하게 되며 미끄럼 안전사고 예방 조치가 필수적입니다.
          </p>
        </div>
      )}
    </div>
  );
}
