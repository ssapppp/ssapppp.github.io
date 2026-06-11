/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculateRecommendation } from '../data/jejuBigData';
import { RouteRecommendationRequest, RouteRecommendationResult } from '../types';
import { Sparkles, MapPin, Bus, Car, Flame, ArrowRight, ShieldAlert, Navigation, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function RouteRecommender() {
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'FAMILY'>('BEGINNER');
  const [goal, setGoal] = useState<'SUMMIT' | 'SCENIC' | 'EASY_WALK'>('SUMMIT');
  const [transport, setTransport] = useState<'PUBLIC' | 'CAR' | 'TAXI'>('PUBLIC');
  const [duration, setDuration] = useState<number>(8);
  const [result, setResult] = useState<RouteRecommendationResult | null>(null);

  const handleRecommend = (e: React.FormEvent) => {
    e.preventDefault();
    const req: RouteRecommendationRequest = { level, goal, transport, duration };
    const res = calculateRecommendation(req);
    setResult(res);
  };

  return (
    <div className="bg-[#E4E3E0] border border-[#141414] overflow-hidden shadow-sm flex flex-col h-full" id="trail-recommender-panel">
      <div className="p-4 bg-[#D8D7D4] border-b border-[#141414] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#141414]" />
          <h3 className="font-serif italic font-bold text-[#141414] text-sm">한라산 인공지능 최적 탐방 경로 추천</h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        <form onSubmit={handleRecommend} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Level selection */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[#141414]/80 font-mono font-bold select-none">신체 조건 및 등산 경험 (PHYSICAL_STATS)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'BEGINNER', text: '🚶 초보 등산가' },
                { id: 'INTERMEDIATE', text: '⛰️ 일반 산행 숙련' },
                { id: 'ADVANCED', text: '🧗 베테랑 등반가' },
                { id: 'FAMILY', text: '👨‍👩‍👧‍👦 어린이/가족동반' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLevel(item.id as any)}
                  className={`text-xs p-2.5 border text-left transition-all cursor-pointer font-bold font-mono ${
                    level === item.id 
                      ? 'bg-[#141414] border-[#141414] text-white' 
                      : 'bg-white border-[#141414] text-[#141414]/80 hover:bg-[#D8D7D4]'
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Goal selection */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[#141414]/80 font-mono font-bold select-none">희망하는 등산 목표 (GOAL_TARGET)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'SUMMIT', text: '정상 완등\n(백록담)' },
                { id: 'SCENIC', text: '경관 중심\n(아름다운 절경)' },
                { id: 'EASY_WALK', text: '가벼운 산책\n(사제비 쉼터)' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as any)}
                  className={`text-xs p-2 border text-center transition-all flex flex-col justify-center items-center h-[54px] whitespace-pre-line cursor-pointer leading-tight font-bold font-mono ${
                    goal === item.id 
                      ? 'bg-[#141414] border-[#141414] text-white' 
                      : 'bg-white border-[#141414] text-[#141414]/80 hover:bg-[#D8D7D4]'
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Transport mode */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs text-[#141414]/80 font-mono font-bold select-none">이동 수단 유형 (TRANSIT_MODE)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'PUBLIC', text: '🚌 대중교통 버스' },
                { id: 'CAR', text: '🚗 개인 자가용' },
                { id: 'TAXI', text: '🚕 합승/택시' }
              ].map((item) => {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTransport(item.id as any)}
                    className={`text-xs p-2.5 border text-center transition-all flex flex-col justify-center items-center gap-1 cursor-pointer font-bold font-mono ${
                      transport === item.id 
                        ? 'bg-[#141414] border-[#141414] text-white' 
                        : 'bg-white border-[#141414] text-[#141414]/80 hover:bg-[#D8D7D4]'
                    }`}
                  >
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration slider */}
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex justify-between items-center text-xs text-[#141414]/80 font-mono font-bold select-none">
              <span>투입 가능한 등반 시간</span>
              <span className="text-[#141414] font-mono font-bold uppercase">{duration}시간 기한</span>
            </div>
            <div className="bg-[#D8D7D4]/30 p-3 border border-[#141414] flex items-center gap-3">
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full h-1 bg-[#141414]/20 rounded-none appearance-none cursor-pointer accent-[#141414]"
              />
              <span className="text-xs text-[#141414] font-mono font-bold">{duration}H</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#141414] hover:bg-[#141414]/90 text-white font-mono font-bold py-3 px-4 shadow-sm border border-[#141414] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <Navigation className="w-4 h-4 text-white" />
              최적 경로 산출 모델 실행 (RUN_OPTIMIZER)
            </button>
          </div>
        </form>

        {/* Output Results Container */}
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-[#141414] p-4 flex flex-col gap-4 mt-1"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white bg-[#141414] px-2 py-0.5 border border-[#141414] font-mono">
                    추천 경로: {result.trail.name} 기점
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#141414]/80">
                  <span className="font-mono">FIT_ACCURACY:</span>
                  <span className="font-mono font-bold text-[#141414] text-sm">{result.suitabilityScore}%</span>
                </div>
              </div>

              {/* Path visually mapped using arrows */}
              <div className="p-3 bg-[#E4E3E0]/30 border border-[#141414] relative overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-[#141414] tracking-wider flex items-center gap-1.5 mb-2.5 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  상행 추천 경로 흐름 (ASCENT_NODE_SEQUENCE)
                </span>
                
                {/* Responsive horizontal/vertical grid path display with arrow indicators */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#141414]">
                  {result.ascentPath.split(' ➡️ ').map((checkpoint, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className={`px-2.5 py-1.5 border leading-none font-mono ${
                        idx === 0 ? 'bg-[#141414] text-white border-[#141414] font-bold' :
                        idx === arr.length - 1 ? 'bg-[#D8D7D4] border-[#141414] font-bold text-[#141414]' :
                        'bg-white border-[#141414]'
                      }`}>
                        {checkpoint}
                      </span>
                      {idx < arr.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#141414] flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <hr className="border-[#141414]/20 my-3" />

                <span className="text-[10px] uppercase font-bold text-[#141414] tracking-wider flex items-center gap-1.5 mb-2.5 font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  하행 추천 경로 흐름 (DESCENT_NODE_SEQUENCE)
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#141414]">
                  {result.descentPath.split(' ➡️ ').map((checkpoint, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className={`px-2.5 py-1.5 border leading-none font-mono ${
                        idx === 0 ? 'bg-white border-[#141414] font-semibold text-[#141414]/70' :
                        idx === arr.length - 1 ? 'bg-[#D8D7D4] border-[#141414] font-bold text-[#141414]' :
                        'bg-white border-[#141414]'
                      }`}>
                        {checkpoint}
                      </span>
                      {idx < arr.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-[#141414] flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Justification summary */}
              <div className="text-xs text-[#141414] leading-relaxed p-3 bg-[#D8D7D4]/30 border border-[#141414] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#141414] flex-shrink-0 mt-0.5" />
                <p className="font-serif italic">{result.justification}</p>
              </div>

              {/* Metrics (Calories, Distance, time) */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 border border-[#141414] bg-white">
                  <span className="text-[9px] text-[#141414]/75 uppercase font-bold font-mono">TOTAL_DISTANCE</span>
                  <p className="text-[#141414] font-bold text-sm mt-0.5 font-mono">{result.totalDistance} km</p>
                </div>
                <div className="p-2 border border-[#141414] bg-white">
                  <span className="text-[9px] text-[#141414]/75 uppercase font-bold font-mono">ESTIMATED_TIME</span>
                  <p className="text-[#141414] font-bold text-sm mt-0.5 font-mono">~ {result.estimatedDuration}H</p>
                </div>
                <div className="p-2 border border-[#141414] bg-white flex flex-col justify-center items-center">
                  <span className="text-[9px] text-[#141414]/75 uppercase font-bold font-mono flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#141414] fill-[#141414]/20" /> CALORIES
                  </span>
                  <p className="text-[#141414] font-bold text-sm mt-0.5 font-mono">{result.calorieEstimate} kcal</p>
                </div>
              </div>

              {/* Transit Advice alert */}
              <div className="text-xs bg-amber-500/10 border border-[#141414] text-amber-900 p-3 flex gap-2 w-full">
                <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold font-mono">TRANSIT_ADVISORY:</span>
                  <p className="text-[#141414] mt-0.5 font-serif italic">{result.transitGuide}</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-[#141414] rounded-none min-h-[160px] font-mono">
              <Sparkles className="w-8 h-8 text-[#141414]/40 mb-2.5" />
              <p className="text-xs text-[#141414] font-bold uppercase">AWAITING_MODEL_PARAMETERS</p>
              <p className="text-[10px] text-[#141414]/70 mt-1 max-w-[280px]">
                Fill out the metrics block above and trigger route optimization query.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
