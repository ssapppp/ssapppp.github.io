/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrailID } from './types';
import { TRAILS, YEARLY_VISITORS } from './data/jejuBigData';
import HallaMap from './components/HallaMap';
import VisitorChart from './components/VisitorChart';
import RouteRecommender from './components/RouteRecommender';
import TransitMonitor from './components/TransitMonitor';
import AlertScheduler from './components/AlertScheduler';
import { Mountain, Compass, Calendar, Clock, Award, ShieldCheck, Bus, HelpCircle } from 'lucide-react';

export default function App() {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedTrailId, setSelectedTrailId] = useState<TrailID>('seongpanak');
  const [selectedHour, setSelectedHour] = useState<number>(9); // 09:00 AM default peak

  // Find visitors object for selected year
  const yearStats = YEARLY_VISITORS.find(v => v.year === selectedYear) || YEARLY_VISITORS[YEARLY_VISITORS.length - 1];

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans selection:bg-[#141414]/10 selection:text-[#141414]">
      
      {/* Technical Dashboard Header Banner */}
      <header className="border-b border-[#141414] bg-[#E4E3E0] sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Brand Core */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[#141414] flex items-center justify-center bg-white text-[#141414]">
            <Mountain className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-serif italic text-2xl leading-none uppercase tracking-tighter text-[#141414] flex items-baseline gap-2">
              HALLASAN_DATA.LOG [V2.6]
              <span className="text-[10px] text-[#141414] font-bold bg-[#D8D7D4] px-2 py-0.5 border border-[#141414] font-mono">
                JEJU BIG DATA
              </span>
            </h1>
            <p className="text-[10px] font-mono opacity-60 uppercase mt-0.5">Jeju Big Data Analysis Platform // Visitor Congestion Management</p>
          </div>
        </div>

        {/* Dashboard parameters slider & year toggle */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Year selector select box */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-[#141414]">
            <Calendar className="w-4 h-4 text-[#141414]" />
            <span className="text-xs text-[#141414] font-mono font-semibold select-none">ANALYSIS_YEAR:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent border-none text-xs text-[#141414] outline-none font-bold font-mono cursor-pointer"
            >
              {[2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((yr) => (
                <option key={yr} value={yr} className="bg-[#E4E3E0] text-[#141414]">{yr}년</option>
              ))}
            </select>
          </div>

          {/* System status node */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-[9px] font-mono opacity-60">SYSTEM STATUS</span>
              <span className="text-xs font-bold font-mono uppercase text-[#141414]">PRED_ENGINE: ACTIVE</span>
            </div>
            <div className="w-10 h-10 border border-[#141414] flex items-center justify-center bg-white">
              <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard Layout */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* Dynamic hour forecast prediction slider bar - Top central prominence */}
        <section className="bg-[#D8D7D4] border border-[#141414] p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 select-none">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#141414]" />
              <div>
                <h2 className="font-serif italic text-base text-[#141414]">시간대별 혼잡도 및 전 노선 정체 연동 예측기 (T+3H FORECAST)</h2>
                <p className="text-[11px] font-mono opacity-70">슬라이더를 드래그하면 지도상의 노선 색상과 주요 탐방로 주차장 포화 비율이 실시간 계산됩니다.</p>
              </div>
            </div>
            
            {/* Format Indicator */}
            <div className="text-right text-xs bg-[#141414] text-white border border-[#141414] px-4 py-2 font-bold font-mono">
              TIME_INDEX: {selectedHour.toString().padStart(2, '0')}:00 {selectedHour < 12 ? 'AM' : 'PM'}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 border border-[#141414]">
            <span className="text-xs text-[#141414] font-bold font-mono select-none">05:00 AM</span>
            <input
              type="range"
              min="5"
              max="18"
              step="1"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              className="w-full h-2 bg-[#E4E3E0] rounded-none appearance-none cursor-pointer accent-[#141414] border border-[#141414]"
            />
            <span className="text-xs text-[#141414] font-bold font-mono select-none">06:00 PM</span>
          </div>
        </section>

        {/* Big Data KPI Counters Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-[#141414] shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-mono text-[#141414]/60 uppercase tracking-wider">{selectedYear}년 총 탐방객 누계 [ANNUAL]</span>
            <div className="mt-2.5">
              <span className="text-2xl md:text-3xl font-bold font-mono text-[#141414]">
                {yearStats.total.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-[#141414]/60 block mt-1">NOMINAL_COUNT_YTD</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#141414] shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-mono text-[#141414]/60 uppercase tracking-wider">일일 병목 통제 구간 수 [SECTORS]</span>
            <div className="mt-2.5">
              <span className="text-2xl md:text-3xl font-bold font-mono text-red-600">
                12개소
              </span>
              <span className="text-[10px] font-mono text-red-600/70 block mt-1">BOTTLE_NECK DETECTED</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#141414] shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-mono text-[#141414]/60 uppercase tracking-wider">실시간 평균 주차 포화율 [PARKING]</span>
            <div className="mt-2.5">
              <span className="text-2xl md:text-3xl font-bold font-mono text-amber-700">
                {selectedHour >= 8 ? '100% (만차)' : '82.5% (주의)'}
              </span>
              <span className="text-[10px] font-mono text-amber-600 block mt-1">CONGESTION ALERT LIMIT</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-[#141414] shadow-sm flex flex-col justify-between">
            <span className="text-[9px] font-mono text-[#141414]/60 uppercase tracking-wider">주말 셔틀 배차 빈도수 [INTERVAL]</span>
            <div className="mt-2.5">
              <span className="text-2xl md:text-3xl font-bold font-mono text-green-700">
                12분 간격
              </span>
              <span className="text-[10px] font-mono text-green-700 block mt-1">BUS_ROUTE_281: SYNCED</span>
            </div>
          </div>
        </section>

        {/* Primary Dashboard Grid Panel (Map & Year Chart Grouped) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Block: Map representation (Span 7) */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <HallaMap
              selectedTrailId={selectedTrailId}
              onSelectTrail={setSelectedTrailId}
              selectedHour={selectedHour}
            />
          </div>

          {/* Right Block: Visitor Statistics Chart (Span 5) */}
          <div className="lg:col-span-5 h-full">
            <VisitorChart
              selectedYear={selectedYear}
              onSelectYear={setSelectedYear}
            />
          </div>
        </section>

        {/* Secondary Dashboard Grid Panel (Optimizer, Bus & Alerts Rules) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Sector: Algorithmic Trail Path Optimizer (Span 6) */}
          <div className="md:col-span-6 h-full">
            <RouteRecommender />
          </div>

          {/* Right Sector: Real-time traffic, Weather and alerting modules (Span 6) */}
          <div className="md:col-span-6 flex flex-col gap-6">
            <div className="flex-1">
              <TransitMonitor selectedHour={selectedHour} />
            </div>
            <div className="flex-1">
              <AlertScheduler />
            </div>
          </div>
        </section>

      </main>

      {/* Styled Footnote */}
      <footer className="border-t border-[#141414] mt-auto py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono bg-[#D8D7D4]/40 text-[#141414]/80">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-1 text-center md:text-left">
          <span>SOURCE: JEJU_BIGDATA_CENTER</span>
          <span>UPDATE_LATENCY: 142MS</span>
          <span>LAT: 33.3617° N | LONG: 126.5292° E</span>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right">
          <span>SYSTEM_UPTIME: 124D:12H:04M</span>
          <span className="opacity-60">© 2026 한라산 국립공원 국토지리 빅데이터 관제망 & 제주 BIS.</span>
        </div>
      </footer>
    </div>
  );
}
