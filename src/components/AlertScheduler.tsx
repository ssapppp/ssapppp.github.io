/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TRAILS } from '../data/jejuBigData';
import { TrailID } from '../types';
import { Bell, Mail, Phone, CalendarDays, Check, History, Sparkles, X, ShieldAlert, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActiveAlert {
  id: string;
  trailId: TrailID;
  trailName: string;
  thresholdType: 'congestion' | 'weather' | 'parking';
  targetValue: string;
  contactMethod: 'sms' | 'email';
  contactVal: string;
  timestamp: string;
}

export default function AlertScheduler() {
  const [trailId, setTrailId] = useState<TrailID>('seongpanak');
  const [thresholdType, setThresholdType] = useState<'congestion' | 'weather' | 'parking'>('congestion');
  const [targetValue, setTargetValue] = useState<string>('75% 이상');
  const [contactMethod, setContactMethod] = useState<'sms' | 'email'>('sms');
  const [contactVal, setContactVal] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([
    {
      id: 'alert_1',
      trailId: 'yeongsil',
      trailName: '영실 코스',
      thresholdType: 'parking',
      targetValue: '상부 등산로 정차 마감시',
      contactMethod: 'sms',
      contactVal: '010-4820-XXXX',
      timestamp: '2026-06-10 10:45'
    },
    {
      id: 'alert_2',
      trailId: 'seongpanak',
      trailName: '성판악 코스',
      thresholdType: 'congestion',
      targetValue: '혼잡인원 80% 상회시',
      contactMethod: 'email',
      contactVal: 'bugewj@gmail.com',
      timestamp: '2026-06-10 10:12'
    }
  ]);

  // Alert simulation events logs
  const [logs, setLogs] = useState<Array<{ id: string; msg: string; time: string; type: 'success' | 'warn' | 'info' }>>([
    { id: 'l1', msg: '영실 주차장 실시간 센서포화 관측: 하부 매표소 대우회 지시 발동', time: '10:52:13', type: 'warn' },
    { id: 'l2', msg: '국립공원 청사 실시간 혼잡도: 성판악 정상비 대기선 240명 밀림', time: '10:35:05', type: 'info' },
    { id: 'l3', msg: 'sms 경보 발송 완료: [영실코스 주차 가득참] 010-4820-XXXX 알림 전송', time: '08:15:00', type: 'success' }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactVal.trim()) return;

    let targetValStr = '';
    if (thresholdType === 'congestion') targetValStr = `혼잡지수 ${targetValue} 이상 시`;
    else if (thresholdType === 'weather') targetValStr = '풍속 8m/s 이상 및 대설주의보 발동 시';
    else targetValStr = '주차장 포화도 95% 돌파 시';

    const newAlert: ActiveAlert = {
      id: `alert_${Date.now()}`,
      trailId,
      trailName: TRAILS[trailId].name,
      thresholdType,
      targetValue: targetValStr,
      contactMethod,
      contactVal: contactVal.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setActiveAlerts([newAlert, ...activeAlerts]);
    setIsSuccess(true);
    setLogs([
      {
         id: `l_${Date.now()}`,
         msg: `[알림 생성 성공] ${TRAILS[trailId].name} - ${targetValStr} - ${contactVal} 등록 완료`,
         time: new Date().toLocaleTimeString(),
         type: 'success'
      },
      ...logs
    ]);
    
    setContactVal('');
    setTimeout(() => {
      setIsSuccess(false);
    }, 4000);
  };

  const handleDeleteAlert = (id: string) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
    setLogs([
      {
        id: `l_${Date.now()}`,
        msg: '가전 등록 알림 정지 조치',
        time: new Date().toLocaleTimeString(),
        type: 'info'
      },
      ...logs
    ]);
  };

  return (
    <div className="bg-[#E4E3E0] border border-[#141414] overflow-hidden shadow-sm flex flex-col h-full" id="alert-scheduler-panel">
      <div className="p-4 bg-[#D8D7D4] border-b border-[#141414] flex items-center justify-between font-mono">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#141414]" />
          <h3 className="font-serif italic font-bold text-[#141414] text-sm">실시간 한라산 탐방 알림 서비스 (정체/기상 경보)</h3>
        </div>
      </div>

      <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Form to Register Rules */}
        <div className="md:col-span-7 bg-[#D8D7D4]/20 p-4 border border-[#141414] flex flex-col justify-between font-mono">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <span className="text-xs text-[#141414] font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              탐방 알림 신규 신청 양식 (ALERT_FORM)
            </span>

            {/* Trail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#141414]/80 font-bold">대상 탐방로 선택</label>
              <select
                value={trailId}
                onChange={(e) => setTrailId(e.target.value as TrailID)}
                className="bg-white border border-[#141414] font-bold text-xs p-2 text-[#141414] outline-none"
              >
                {Object.values(TRAILS).map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Threshold parameter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#141414]/80 font-bold">경보 발동 임계 기준값 (THRESHOLD_TYPE)</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'congestion', text: '🚶 정체 유발' },
                  { id: 'weather', text: '🌪️ 기상 악재' },
                  { id: 'parking', text: '🚗 만차 포화' }
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setThresholdType(th.id as any);
                      if (th.id === 'congestion') setTargetValue('75% 이상');
                      else if (th.id === 'weather') setTargetValue('기상경보 발동');
                      else setTargetValue('상하부 만차 포장 마감');
                    }}
                    className={`text-xs p-2 font-bold border text-center transition-all cursor-pointer ${
                      thresholdType === th.id
                        ? 'bg-[#141414] border-[#141414] text-white'
                        : 'bg-white border-[#141414] text-[#141414]/85 hover:bg-[#D8D7D4]'
                    }`}
                  >
                    {th.text}
                  </button>
                ))}
              </div>
            </div>

            {thresholdType === 'congestion' && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-[#141414]/85 font-bold">정체 비율 임계 설정 (CONGEST_LEVEL)</label>
                <select
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="bg-white border border-[#141414] text-xs p-2 text-[#141414] font-bold cursor-pointer outline-none focus:border-black"
                >
                  <option value="60% 이상">완만 혼잡 (60% 수준 돌파시)</option>
                  <option value="75% 이상">주의 정체 (75% 입구 병목 심화시)</option>
                  <option value="90% 이상">심각 정체 한계 (90% 대피소 대기선 최장시)</option>
                </select>
              </div>
            )}

            {/* Contact validation parameters */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#141414] font-bold">알림 수신 연락망 설정 (RECIPIENT_CONFIG)</label>
              <div className="flex bg-white p-0.5 border border-[#141414] w-fit">
                <button
                  type="button"
                  onClick={() => { setContactMethod('sms'); setContactVal(''); }}
                  className={`text-[10px] px-2.5 py-1 font-bold transition-all cursor-pointer ${
                    contactMethod === 'sms' ? 'bg-[#141414] text-white' : 'text-[#141414]/70 hover:bg-[#D8D7D4]/30'
                  }`}
                >
                  SMS 휴대폰
                </button>
                <button
                  type="button"
                  onClick={() => { setContactMethod('email'); setContactVal(''); }}
                  className={`text-[10px] px-2.5 py-1 font-bold transition-all cursor-pointer ${
                    contactMethod === 'email' ? 'bg-[#141414] text-white' : 'text-[#141414]/70 hover:bg-[#D8D7D4]/30'
                  }`}
                >
                  이메일 수신
                </button>
              </div>

              <input
                type={contactMethod === 'email' ? 'email' : 'tel'}
                required
                placeholder={contactMethod === 'email' ? 'your-email@gmail.com' : '010-XXXX-XXXX'}
                value={contactVal}
                onChange={(e) => setContactVal(e.target.value)}
                className="bg-white border border-[#141414] text-xs p-2.5 text-[#141414]/90 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#141414] hover:bg-[#141414]/90 text-white font-bold py-2.5 px-3 text-xs border border-[#141414] transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              알림 예약 가이드 발송 신청 (SUBMIT_ALERT)
            </button>
          </form>

          {/* Success Dialog Animation */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="mt-3 p-2.5 bg-emerald-50 border border-emerald-700 text-emerald-900 text-[10px] flex items-center gap-2 font-bold"
              >
                <Check className="w-4 h-4 text-emerald-800 flex-shrink-0" />
                <span>성공적으로 경보 알림 채널에 예약 등록이 완료되었습니다!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* List of Registered Guides and Live Event log */}
        <div className="md:col-span-5 flex flex-col gap-4 font-mono">
          {/* Active Alerts */}
          <div>
            <span className="text-xs text-[#141414] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2 select-none">
              <History className="w-3.5 h-3.5" />
              현재 대기 중인 나의 알림망 ({activeAlerts.length})
            </span>

            {activeAlerts.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="p-2.5 bg-white border border-[#141414] flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#141414] font-serif">{alert.trailName}</span>
                        <span className="text-[8px] bg-[#D8D7D4] border border-[#141414] px-1.5 py-0.2 text-[#141414] font-mono">
                          {alert.thresholdType === 'congestion' ? '정체경보' : alert.thresholdType === 'weather' ? '기상경보' : '만차감지'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#141414]/80 block mt-0.5">{alert.targetValue}</span>
                      <span className="text-[9px] text-[#141414]/60 font-mono block">ADDR: {alert.contactVal}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-[#141414]/60 hover:text-red-700 hover:bg-[#D8D7D4]/40 p-1.5 border border-transparent hover:border-[#141414]/20 transition-colors cursor-pointer"
                      title="알림 등록 정지"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-white border border-dashed border-[#141414]/60 text-center text-xs text-[#141414]/60">
                현재 활성화된 스마트 경보 배치가 없습니다.
              </div>
            )}
          </div>

          {/* Simulated Sensors logs */}
          <div className="flex-1 flex flex-col min-h-[145px]">
            <span className="text-xs text-[#141414] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-1.5 select-none">
              <ShieldAlert className="w-3.5 h-3.5" />
              국립공원 실시간 무인 통제 및 경보 발신망 로그 (SYS_LOG)
            </span>
            <div className="flex-1 bg-white text-[10px] p-3 border border-[#141414] overflow-y-auto font-mono flex flex-col gap-1.5 max-h-[145px] max-w-full">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2 leading-tight">
                  <span className="text-[#141414]/50 flex-shrink-0">[{log.time}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-800 font-bold' :
                    log.type === 'warn' ? 'text-amber-800 font-bold' : 'text-[#141414]/90'
                  }>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
