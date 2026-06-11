/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BUS_STATUSES, WEATHER_FORECAST } from '../data/jejuBigData';
import { BusStatus } from '../types';
import { Bus, Car, CloudSun, RefreshCw, Volume2, Timer, CheckCircle, Ban, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface TransitMonitorProps {
  selectedHour: number;
}

export default function TransitMonitor({ selectedHour }: TransitMonitorProps) {
  const [buses, setBuses] = useState<BusStatus[]>(BUS_STATUSES);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [systemLog, setSystemLog] = useState<string>('제주도 버스 정보 연동 정상 작동 중');

  // Dynamically calculate parking occupancy based on selected hour of the day
  const getParkingOccupancy = (trailId: string, hour: number) => {
    if (trailId === 'seongpanak') {
      if (hour < 6) return { pct: 60, status: '주차여유', style: 'text-emerald-800 bg-emerald-50 border border-emerald-500' };
      if (hour === 6) return { pct: 95, status: '만 차 직 전', style: 'text-amber-800 bg-amber-50 border border-amber-500' };
      return { pct: 100, status: '혼잡 만차 (대중교통 권장)', style: 'text-amber-800 bg-amber-50 border border-amber-500 font-bold' };
    }
    if (trailId === 'gwaneumsa') {
      if (hour < 6) return { pct: 20, status: '여유', style: 'text-emerald-800 bg-emerald-50 border border-emerald-500' };
      if (hour === 6) return { pct: 75, status: '보통', style: 'text-amber-800 bg-amber-50 border border-amber-500' };
      if (hour === 7) return { pct: 98, status: '만차대기', style: 'text-orange-800 bg-orange-50 border border-orange-500' };
      return { pct: 100, status: '혼잡 만차', style: 'text-amber-800 bg-amber-50 border border-amber-500 font-bold' };
    }
    if (trailId === 'yeongsil') {
      if (hour < 7) return { pct: 15, status: '매우 여유', style: 'text-emerald-800 bg-emerald-50 border border-emerald-500' };
      if (hour === 7) return { pct: 55, status: '보통', style: 'text-emerald-800 bg-emerald-50 border border-emerald-500' };
      if (hour === 8) return { pct: 92, status: '지체', style: 'text-amber-800 bg-amber-50 border border-amber-500' };
      return { pct: 100, status: '혼잡 만차 (우회 도로 정체)', style: 'text-amber-800 bg-amber-50 border border-amber-500 font-bold' };
    }
    // Eorimok
    if (hour < 8) return { pct: 10, status: '여유', style: 'text-emerald-800 bg-emerald-50 border border-emerald-500' };
    if (hour < 10) return { pct: 80, status: '보통', style: 'text-amber-800 bg-amber-50 border border-amber-500' };
    return { pct: 96, status: '거의 가득참', style: 'text-orange-800 bg-orange-50 border border-orange-500' };
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSystemLog('인접 BIS 버스 실시간 잔여시간 데이터를 수집하고 있습니다...');
    setTimeout(() => {
      const nextBuses = buses.map(b => {
        let nextEta = b.etaMinutes - 1;
        if (nextEta <= 0) {
          nextEta = b.intervalMinutes - Math.floor(Math.random() * 3);
        }
        return {
          ...b,
          etaMinutes: nextEta,
          isDelayed: Math.random() > 0.8
        };
      });
      setBuses(nextBuses);
      setIsRefreshing(false);
      setSystemLog('실시간 대중교통 및 BIS 피드 갱신 성공 (오차율 범위 ±1.5초)');
    }, 850);
  };

  return (
    <div className="bg-[#E4E3E0] border border-[#141414] overflow-hidden shadow-sm flex flex-col h-full" id="transit-monitor-panel">
      <div className="p-4 bg-[#D8D7D4] border-b border-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-[#141414]" />
          <h3 className="font-serif italic font-bold text-[#141414] text-sm">실시간 스마트 교통망 및 기상 상태</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-xs px-3 py-1 bg-white border border-[#141414] hover:bg-[#D8D7D4] font-mono font-bold text-[#141414] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          BIS 갱신 (BIS_SYNC)
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Weather Conditions Widget */}
        <div className="bg-white border border-[#141414] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#141414] font-mono font-bold flex items-center gap-1">
              <CloudSun className="w-4 h-4 text-[#141414]" />
              METEOROLOGICAL_CONDS
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider text-black bg-[#D8D7D4] px-2 py-0.5 border border-[#141414] flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-800" /> 탐방 승인 (정상)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1 font-mono">
            <div className="text-center md:text-left border border-[#141414]/15 p-2 bg-[#E4E3E0]/20">
              <span className="text-[8px] text-[#141414]/70 uppercase font-bold">백록담 온도</span>
              <p className="text-[#141414] font-bold text-sm mt-0.5">{WEATHER_FORECAST.temp} °C</p>
            </div>
            <div className="text-center md:text-left border border-[#141414]/15 p-2 bg-[#E4E3E0]/20">
              <span className="text-[8px] text-[#141414]/70 uppercase font-bold">정상 풍속</span>
              <p className="text-[#141414] font-bold text-sm mt-0.5">{WEATHER_FORECAST.windSpeed} m/s</p>
            </div>
            <div className="text-center md:text-left border border-[#141414]/15 p-2 bg-[#E4E3E0]/20">
              <span className="text-[8px] text-[#141414]/70 uppercase font-bold">가시 거리</span>
              <p className="text-[#141414] font-bold text-sm mt-0.5">{WEATHER_FORECAST.visibility} km</p>
            </div>
            <div className="text-center md:text-left border border-[#141414]/15 p-2 bg-[#E4E3E0]/20">
              <span className="text-[8px] text-[#141414]/70 uppercase font-bold">대기 습도</span>
              <p className="text-[#141414] font-bold text-sm mt-0.5">{WEATHER_FORECAST.humidity} %</p>
            </div>
          </div>
          <div className="text-[10px] text-[#141414] bg-[#D8D7D4]/30 border border-[#141414] px-2.5 py-1.5 font-mono">
            <strong>WEATHER_BULLETIN:</strong> {WEATHER_FORECAST.statusText}
          </div>
        </div>

        {/* Real-time Parking Occupancies */}
        <div>
          <span className="text-xs text-[#141414] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 select-none font-mono">
            <Car className="w-3.5 h-3.5 text-[#141414]" />
            시간대별 주요 탐방로 주차장 포화 지수 ({selectedHour}시 시점)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            {[
              { id: 'seongpanak', name: '성판악 주차장', spots: '총 78면' },
              { id: 'gwaneumsa', name: '관음사 주차장', spots: '총 120면' },
              { id: 'yeongsil', name: '영실 주차장', spots: '총 280면' },
              { id: 'eorimok', name: '어리목 주차장', spots: '총 154면' }
            ].map((p) => {
              const data = getParkingOccupancy(p.id, selectedHour);
              return (
                <div key={p.id} className="p-3 bg-white border border-[#141414] overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs text-[#141414] font-bold font-serif">{p.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 font-mono ${data.style}`}>{data.status}</span>
                    </div>
                    <span className="text-[9px] text-[#141414]/60 font-mono">{p.spots}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] text-[#141414]/65 font-mono">CAPACITY</span>
                      <span className="text-xs font-mono font-bold text-[#141414]">{data.pct}%</span>
                    </div>
                    <div className="w-full bg-[#E4E3E0] h-1.5 border border-[#141414] overflow-hidden mt-1">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          data.pct >= 90 ? 'bg-red-600' :
                          data.pct >= 70 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${data.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Bus Arrival tracker */}
        <div>
          <span className="text-xs text-[#141414] uppercase font-bold tracking-wider flex items-center gap-1.5 mb-2.5 select-none font-mono">
            <Timer className="w-3.5 h-3.5 text-[#141414]" />
            실시간 버스 도착 소요 안내 피드 (인접 실시간 BIS 연동)
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {buses.map((bus) => (
              <div 
                key={bus.id} 
                className="p-3 bg-white border border-[#141414] flex justify-between items-center relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white border border-[#141414] flex items-center justify-center text-[#141414] font-bold font-mono text-xs">
                    {bus.routeNumber}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#141414] block font-serif">{bus.destination}</span>
                    <span className="text-[9px] text-[#141414]/70 font-mono">CURRENT: {bus.currentStopKorean}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    {bus.isDelayed && (
                      <span className="text-[8px] bg-red-100 text-red-800 border border-red-700 px-1 font-mono font-bold uppercase tracking-wider">
                        DELAY
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-red-600">{bus.etaMinutes}분 후</span>
                  </div>
                  <span className="text-[9px] text-[#141414]/60 font-mono block mt-0.5">INTERVAL {bus.intervalMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Traffic Feed Status bar */}
        <div className="p-2.5 bg-[#D8D7D4] border border-[#141414] text-[9px] text-[#141414] flex justify-between items-center font-mono select-none">
          <span className="font-bold">{systemLog}</span>
          <span className="flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 block animate-ping" />
            BIS SENSOR FEED: ON
          </span>
        </div>
      </div>
    </div>
  );
}
