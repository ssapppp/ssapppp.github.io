/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrailInfo, YearlyVisitorData, MonthlyDistribution, BusStatus, WeatherCondition, RouteRecommendationRequest, RouteRecommendationResult } from '../types';

export const TRAILS: Record<string, TrailInfo> = {
  seongpanak: {
    id: 'seongpanak',
    name: '성판악 코스',
    engName: 'Seongpanak Trail',
    length: 9.6,
    duration: 4.5, // ascent one-way (approx 4.5 hours)
    elevationGain: 1200, // 750m to 1950m
    startElevation: 750,
    endElevation: 1950,
    difficulty: 'HARD',
    difficultyKorean: '어려움',
    description: '한라산 동쪽 능선을 따라 백록담 정상으로 향하는 평탄하지만 긴 등산로입니다. 완만한 경사 덕분에 가장 많은 탐방객들이 찾으며, 돌길이 많아 발목 피로도가 높습니다. 정상 진입을 위해서는 반드시 탐방 예약을 해야 합니다.',
    reservationRequired: true,
    maxDailyCapacity: 1000,
    parkingLotName: '성판악 탐방로 주차장',
    parkingTotal: 78,
    busLines: ['281', '181', '881-1'],
    checkpoints: [
      { id: 'sp_start', name: '성판악 입구', elevation: 750, distanceFromStart: 0, averageTime: 0, description: '탐방안내소, 주차장, 버스정류장 위치.', isBottleneck: false },
      { id: 'sp_sokbat', name: '속밭 대피소', elevation: 1100, distanceFromStart: 4.1, averageTime: 80, description: '화장실 및 휴식공간. 완만한 숲길 구간의 끝.', isBottleneck: false },
      { id: 'sp_sara', name: '사라오름 갈림길', elevation: 1215, distanceFromStart: 5.8, averageTime: 40, description: '전망대와 산정호수로 유명한 사라오름 입구.', isBottleneck: true, bottleneckReason: '사라오름 방문객과 정상 합류 인원이 겹침 (오전 10시~12시 혼잡)' },
      { id: 'sp_jindallae', name: '진달래밭 대피소', elevation: 1500, distanceFromStart: 7.3, averageTime: 60, description: '대피소 및 무인통제소 운영. 정상 등반을 위해 동절기 12:00 / 하절기 13:00 통과 제한시간 있음.', isBottleneck: true, bottleneckReason: '통제 시간 이전 체력 소진 대기 및 화장실 대기줄 심각 (오전 11시~13시 혼잡)' },
      { id: 'sp_summit', name: '백록담 정상', elevation: 1950, distanceFromStart: 9.6, averageTime: 90, description: '한라산 최고봉 백록담 동릉 정상. 비석 인증샷 대기 발생.', isBottleneck: true, bottleneckReason: '정상 인증석 대기 시간 최대 1시간 발생 (예약제 인원 정상 집중, 오전 11시~오후 2시 혼잡)' }
    ]
  },
  gwaneumsa: {
    id: 'gwaneumsa',
    name: '관음사 코스',
    engName: 'Gwaneumsa Trail',
    length: 8.7,
    duration: 5.0, // ascent one-way (approx 5 hours)
    elevationGain: 1330, // 620m to 1950m
    startElevation: 620,
    endElevation: 1950,
    difficulty: 'EXPERT',
    difficultyKorean: '매우 어려움',
    description: '한라산 북쪽 면을 타고 올라가는 가장 가파르고 도전적인 코스입니다. 깊은 계곡, 아름다운 삼각봉, 장엄한 왕관릉 등 최고의 비경을 자랑하지만 경사가 극도로 심해 고도의 체력이 요구됩니다. 백록담 대피소 통제시간이 존재합니다.',
    reservationRequired: true,
    maxDailyCapacity: 500,
    parkingLotName: '관음사 야영장 주차장',
    parkingTotal: 120,
    busLines: ['477'],
    checkpoints: [
      { id: 'gw_start', name: '관음사 지구 입구', elevation: 620, distanceFromStart: 0, averageTime: 0, description: '야영장, 안내소, 공영주차장 위치.', isBottleneck: false },
      { id: 'gw_tamna', name: '탐라계곡 목교', elevation: 975, distanceFromStart: 3.2, averageTime: 80, description: '가파른 계곡 목교 및 화장실 위치. 이후 수백 개의 수직 계단 지옥 시작.', isBottleneck: true, bottleneckReason: '가파른 계단 진입 전 호흡 조절 및 급경사 병목 구간' },
      { id: 'gw_samgak', name: '삼각봉 대피소', elevation: 1500, distanceFromStart: 6.0, averageTime: 100, description: '독특한 모양의 삼각봉 전망. 정상 통제를 위한 통과 시간제한 있음 (동절기 12:00 / 하절기 13:00).', isBottleneck: true, bottleneckReason: '급경사 오르막 직전 최종 휴식처로 피크 타임 의자 부족 현상' },
      { id: 'gw_wangwan', name: '왕관릉 고개', elevation: 1670, distanceFromStart: 7.2, averageTime: 50, description: '한라산 최고의 암석 지형 뷰포인트. 바람이 매우 불어 저체온증 유의.', isBottleneck: false },
      { id: 'gw_summit', name: '백록담 정상', elevation: 1950, distanceFromStart: 8.7, averageTime: 70, description: '한라산 정상공간. 성판악 코스 하산객들과 교행하는 좁은 목재 테크길.', isBottleneck: true, bottleneckReason: '정물 사진 촬영 및 성판악 방면 하산 인원 상호 병목 발생' }
    ]
  },
  yeongsil: {
    id: 'yeongsil',
    name: '영실 코스',
    engName: 'Yeongsil Trail',
    length: 5.8,
    duration: 2.5, // ascent to Witse Oreum (2.5 hours)
    elevationGain: 720, // 1280m to 1700m (Witse Oreum)
    startElevation: 1280, // Upper parking
    endElevation: 1700,
    difficulty: 'MODERATE',
    difficultyKorean: '보통',
    description: '한라산 영실기암(오백나한)의 절경을 옆에 보며 해발 1,700m 윗세오름 대피소까지 가는 코스입니다. 한라산에서 가장 아름답고 수려한 가을 단풍과 겨울 눈꽃 풍경을 보여주며, 비교적 경사가 수월해 일반 관광객들에게 가장 인기가 높습니다. 백록담 정상은 갈 수 없습니다.',
    reservationRequired: false,
    parkingLotName: '영실 매표소 주차장(하부) & 영실 등산로 주차장(상부)',
    parkingTotal: 280, // Upper is 80, Lower is 200
    busLines: ['240'],
    checkpoints: [
      { id: 'ys_start_low', name: '영실 매표소 (하부주차)', elevation: 1000, distanceFromStart: -2.5, averageTime: 40, description: '버스정류장 및 대규모 하부 주차장. 상부주차장까지 도보 40분 소요.', isBottleneck: true, bottleneckReason: '상부 주차 공간 매진 시 택시 합승 및 차량 정체 극심 (오전 8시~오후 2시 진입 도로 정체)' },
      { id: 'ys_start_up', name: '영sil 등산로 입구 (상부)', elevation: 1280, distanceFromStart: 0, averageTime: 0, description: '소형 전용 상부주차장, 오백나한 화장실 및 매점.', isBottleneck: true, bottleneckReason: '주차 경쟁 유발 및 상하부 셔틀/택시 혼선' },
      { id: 'ys_giam', name: '영실기암 전망대', elevation: 1450, distanceFromStart: 1.5, averageTime: 50, description: '기암괴석 병풍바위 조망. 가파른 계단 구간.', isBottleneck: true, bottleneckReason: '경관 사진 촬영으로 인한 계단 지연 발생' },
      { id: 'ys_slope', name: '구상나무 숲길', elevation: 1600, distanceFromStart: 3.1, averageTime: 40, description: '경사가 완화되며 광활한 고원(선작지왓) 평원이 펼쳐지는 초입부.', isBottleneck: false },
      { id: 'ys_witse', name: '윗se오름 대피소', elevation: 1700, distanceFromStart: 5.8, averageTime: 60, description: '돈내코, 어리목 코스와 연결되는 허브 대피소. 영실 코스 종점.', isBottleneck: true, bottleneckReason: '식사/정비하는 등산객 전원 집중 (오전 11시~오후 2시 대피소 광장 극도 혼잡)' }
    ]
  },
  eorimok: {
    id: 'eorimok',
    name: '어리목 코스',
    engName: 'Eorimok Trail',
    length: 6.8,
    duration: 3.0, // to Witse Oreum
    elevationGain: 730, // 970m to 1700m
    startElevation: 970,
    endElevation: 1700,
    difficulty: 'MODERATE',
    difficultyKorean: '보통',
    description: '어리목광장에서 시작하여 사제비동산, 만세동산을 거쳐 윗세오름 대피소로 연결되는 완만하고 쾌적한 코스입니다. 숲을 지나 고원에 들어서면 한라산 백록담 화구벽의 서쪽 벽이 웅장하게 펼쳐집니다. 하산길로 애용되며 안전 인프라가 훌륭합니다.',
    reservationRequired: false,
    parkingLotName: '어리목 공영 주차장',
    parkingTotal: 154,
    busLines: ['240'],
    checkpoints: [
      { id: 'er_start', name: '어리목 광장', elevation: 970, distanceFromStart: 0, averageTime: 0, description: '한라산 국립공원 관리소 주차장, 버스정류장에서 도보 10분 진입.', isBottleneck: false },
      { id: 'er_forest', name: '목교 갈림길', elevation: 1050, distanceFromStart: 1.2, averageTime: 30, description: '어리목 계곡을 건너는 다리로 이후 가파른 사제비 숲길 경사 시작.', isBottleneck: false },
      { id: 'er_sajebi', name: '사제비약수터', elevation: 1420, distanceFromStart: 2.4, averageTime: 50, description: '사제비 동산 샘물터. 가파른 삼림욕 오르막 코스의 끝 휴식처.', isBottleneck: true, bottleneckReason: '가쁜 숨을 고르는 의자 공간 정체 및 약수터 이용 병목' },
      { id: 'er_manse', name: '만세동산 전망대', elevation: 1600, distanceFromStart: 4.7, averageTime: 50, description: '한라산 백록담 화구 서벽이 눈앞에 탁 트이는 장관 제공.', isBottleneck: false },
      { id: 'er_witse', name: '윗세오름 대피소', elevation: 1700, distanceFromStart: 6.8, averageTime: 50, description: '해발 1,700m 평원의 식수대 겸 휴식 광장. 영실/돈내코 연계.', isBottleneck: true, bottleneckReason: '정오 시간대 대피소 이용객 및 영실 방면 이동 교행 병목' }
    ]
  },
  donnaeko: {
    id: 'donnaeko',
    name: '돈내코 코스',
    engName: 'Donnaeko Trail',
    length: 7.0, // to Southern Wall Junction (7.0km)
    duration: 3.5,
    elevationGain: 1100, // 500m to 1600m
    startElevation: 500,
    endElevation: 1600,
    difficulty: 'HARD',
    difficultyKorean: '어려움',
    description: '서귀포시 돈내코 관광지구 근처의 안내소에서 출발하여 평궤대피소를 거쳐 윗세오름 뒤편 남벽분기점까지 가는 고즈넉한 코스입니다. 한라산 남벽의 화려하고 압도적인 경관을 조망할 수 있으나, 탐방객이 제일 적어 고용한 산행을 즐기기에 완벽합니다.',
    reservationRequired: false,
    parkingLotName: '돈내코 탐방로 간량 주차장',
    parkingTotal: 50,
    busLines: ['611', '612'],
    checkpoints: [
      { id: 'dn_start', name: '돈내코 탐방안내소', elevation: 500, distanceFromStart: 0, averageTime: 0, description: '남부지역 출발점. 무료 주차장 제공.', isBottleneck: false },
      { id: 'dn_salogi', name: '살오름 전망대 갈림길', elevation: 1050, distanceFromStart: 3.5, averageTime: 90, description: '긴 완경사 숲길 끝 쉼터.', isBottleneck: false },
      { id: 'dn_pyeonggwe', name: '평궤 대피소', elevation: 1450, distanceFromStart: 5.3, averageTime: 60, description: '울창한 숲에서 고원지대로 나가는 돌 가마터 흔적 대피소.', isBottleneck: false },
      { id: 'dn_southwall', name: '남벽분기점 전망대', elevation: 1600, distanceFromStart: 7.0, averageTime: 60, description: '돈내코 코스의 종점. 거대한 한라산 남벽의 직벽이 솟아있어 장관 연출. 윗세오름까지 추가 2.1km 연결 가능.', isBottleneck: false }
    ]
  }
};

// Year-over-Year Big Data: Annual hikers (2018 ~ 2026 forecast)
// Reflects real tendencies (e.g., pandemic slowdown, reservation impact, mountain congestion redistribution)
export const YEARLY_VISITORS: YearlyVisitorData[] = [
  { year: 2018, seongpanak: 350500, gwaneumsa: 85200, yeongsil: 245300, eorimok: 218400, donnaeko: 12100, total: 911500 },
  { year: 2019, seongpanak: 362400, gwaneumsa: 91100, yeongsil: 261800, eorimok: 224600, donnaeko: 13500, total: 953400 },
  { year: 2020, seongpanak: 298100, gwaneumsa: 76000, yeongsil: 220200, eorimok: 195000, donnaeko: 10400, total: 799700 }, // COVID lowest
  { year: 2021, seongpanak: 310200, gwaneumsa: 124300, yeongsil: 288400, eorimok: 247000, donnaeko: 21500, total: 991400 }, // Reservation system launched; Gwaneumsa/Yeongsil surged due to overflow/outdoor tourism boom
  { year: 2022, seongpanak: 264000, gwaneumsa: 128000, yeongsil: 345000, eorimok: 271200, donnaeko: 26200, total: 1034400 }, // Peak reservation limits enforced (Seongpanak drops, Yeongsil surges dramatically as reservation overflow redirects to non-reservation trails)
  { year: 2023, seongpanak: 259500, gwaneumsa: 135600, yeongsil: 378200, eorimok: 282100, donnaeko: 22400, total: 1077800 },
  { year: 2024, seongpanak: 261800, gwaneumsa: 141200, yeongsil: 394500, eorimok: 298400, donnaeko: 23100, total: 1119000 },
  { year: 2025, seongpanak: 263100, gwaneumsa: 146500, yeongsil: 412000, eorimok: 310800, donnaeko: 24200, total: 1156600 },
  { year: 2026, seongpanak: 265000, gwaneumsa: 152000, yeongsil: 435000, eorimok: 325000, donnaeko: 25500, total: 1202500 }, // 2026 Project Forecasted data, continuing the trend.
];

// Monthly Visitor Distribution Pattern
export const MONTHLY_DISTRIBUTIONS: MonthlyDistribution[] = [
  { month: 1, ratio: 0.12, avgTemp: -2.3, avgRainfall: 68, remark: '눈꽃 산행 절정기. 아이젠 착용 필수.' },
  { month: 2, ratio: 0.11, avgTemp: -1.7, avgRainfall: 54, remark: '잔설 산행 및 대설 특보 잦음.' },
  { month: 3, ratio: 0.07, avgTemp: 3.1, avgRainfall: 85, remark: '해빙기 진흙 낙상 주의, 정상 얼음 조심.' },
  { month: 4, ratio: 0.08, avgTemp: 8.5, avgRainfall: 110, remark: '봄 야생화 및 진달래 피는 완연한 봄철.' },
  { month: 5, ratio: 0.11, avgTemp: 13.2, avgRainfall: 140, remark: '선작지왓 한라산 털진달래 및 산철쭉 만개기.' },
  { month: 6, ratio: 0.08, avgTemp: 17.5, avgRainfall: 210, remark: '장마 시즌 시작, 고원 안개 및 구름 속 도보.' },
  { month: 7, ratio: 0.05, avgTemp: 21.0, avgRainfall: 320, remark: '여름 고온 및 대기 불안정 소나기, 자외선 경보.' },
  { month: 8, ratio: 0.05, avgTemp: 21.8, avgRainfall: 340, remark: '태풍 철 영향, 기상 변경 확인 필수.' },
  { month: 9, ratio: 0.07, avgTemp: 16.9, avgRainfall: 195, remark: '초가을 선선한 산행 가능, 억새 풍경 시작.' },
  { month: 10, ratio: 0.14, avgTemp: 11.2, avgRainfall: 90, remark: '연중 최고의 성수기. 오백나한 계곡 단풍 인파 극치.' },
  { month: 11, ratio: 0.09, avgTemp: 5.4, avgRainfall: 75, remark: '늦가을 고지대 급격한 결빙, 초겨울 복장 구비.' },
  { month: 12, ratio: 0.08, avgTemp: -0.8, avgRainfall: 62, remark: '한라산 첫눈 적설, 연말 은빛 대설경.' }
];

// Hour of day congestion ratios (Index 5 to 18) for each trail.
// Value is scale 0..1 (0 being empty, 1 being extreme congestion)
export const HOURLY_CONGESTION_PROFILES: Record<string, Record<number, number>> = {
  seongpanak: {
    5: 0.40, 6: 0.85, 7: 0.95, 8: 0.70, 9: 0.50, 10: 0.35, 11: 0.45, 12: 0.75, 13: 0.80, 14: 0.65, 15: 0.45, 16: 0.20, 17: 0.10, 18: 0.02
  }, // Early AM sunrise starters (6-7), Peak summit photo queuing (11-13), Descent fatigue bottlenecks (13-15)
  gwaneumsa: {
    5: 0.30, 6: 0.75, 7: 0.85, 8: 0.60, 9: 0.45, 10: 0.30, 11: 0.40, 12: 0.70, 13: 0.75, 14: 0.55, 15: 0.35, 16: 0.15, 17: 0.05, 18: 0.01
  }, // Extreme steep terrain, early starts.
  yeongsil: {
    5: 0.05, 6: 0.15, 7: 0.35, 8: 0.65, 9: 0.90, 10: 1.00, 11: 0.95, 12: 0.85, 13: 0.80, 14: 0.70, 15: 0.50, 16: 0.25, 17: 0.08, 18: 0.01
  }, // Standard tourist wake-up. 9-11 is pure chaos at lower tickets & trailhead, parking completely full.
  eorimok: {
    5: 0.05, 6: 0.10, 7: 0.30, 8: 0.55, 9: 0.80, 10: 0.85, 11: 0.80, 12: 0.75, 13: 0.70, 14: 0.60, 15: 0.45, 16: 0.20, 17: 0.05, 18: 0.01
  }, // High daytime hiking.
  donnaeko: {
    5: 0.01, 6: 0.05, 7: 0.10, 8: 0.15, 9: 0.20, 10: 0.22, 11: 0.25, 12: 0.20, 13: 0.18, 14: 0.12, 15: 0.08, 16: 0.04, 17: 0.01, 18: 0.00
  } // Peaceful, almost zero bottlenecking.
};

// Simulated Real-Time Bus Data (Jeju Bus System linked to Hallasan points)
export const BUS_STATUSES: BusStatus[] = [
  { id: 'b1', routeNumber: '281', destination: '제주공항 / 제주시 서귀포행', currentStopKorean: '제주대학교 입구', etaMinutes: 4, intervalMinutes: 12, isDelayed: false },
  { id: 'b2', routeNumber: '181', destination: '제주국제공항 급행특급', currentStopKorean: '교래사거리', etaMinutes: 11, intervalMinutes: 20, isDelayed: false },
  { id: 'b3', routeNumber: '240', destination: '영실코스 / 어리목공원 순환', currentStopKorean: '한라산천중사', etaMinutes: 9, intervalMinutes: 30, isDelayed: true },
  { id: 'b4', routeNumber: '477', destination: '관음사정류장 / 제주시청', currentStopKorean: '아라주공아파트', etaMinutes: 14, intervalMinutes: 40, isDelayed: false },
];

// Simulated Mt. Halla Weather Forecast by trailhead
export const WEATHER_FORECAST: WeatherCondition = {
  location: '백록담 정상 부근 (해발 1,950m)',
  temp: 11.5,
  condition: 'CLOUDY',
  conditionKorean: '안개 및 흐림',
  windSpeed: 7.2, // Strong winds
  humidity: 92,
  visibility: 0.8, // Low visibility (foggy)
  statusText: '남벽 및 정상부 상시 안개 자욱. 미끄럼 사고 주의.',
  ascentPermitted: true
};

// Algorithmic optimal hiking route recommended logic
export function calculateRecommendation(req: RouteRecommendationRequest): RouteRecommendationResult {
  const { level, goal, transport } = req;
  
  if (goal === 'SUMMIT') {
    // Seongpanak vs Gwaneumsa
    if (level === 'BEGINNER') {
      const trail = TRAILS.seongpanak;
      return {
        trail,
        ascentPath: '성판악 탐방안내소 ➡️ 속밭대피소 ➡️ 진달래밭 대피소 ➡️ 백록담 동릉',
        descentPath: '백록담 동릉 ➡️ 진달래밭 대피소 ➡️ 속밭대피소 ➡️ 성판악 하산 (차량 연계 완벽)',
        totalDistance: 19.2,
        estimatedDuration: 9.0,
        difficultyKorean: '어려움 (길이가 길고 발목 주의)',
        suitabilityScore: 85,
        justification: '정상 완등 목적이지만 초보자이므로 경사가 가파른 관음사보다는, 완만하고 중간 쉼터 및 대피소 체계가 우수한 성판악 왕복 코스가 안전합니다.',
        transitGuide: transport === 'CAR' 
          ? '⚠️ 성판악 주차 마감은 오전 6시 10분입니다. 반드시 281번 버스(제주시/서귀포 출발)나 택시 이용을 강력 추천합니다.' 
          : '쾌속 281번 버스를 타시면 성판악 정류장 정문앞 고속 승하차가 가능합니다.',
        calorieEstimate: 2350
      };
    } else {
      // ADVANCED or INTERMEDIATE
      const trail = TRAILS.gwaneumsa;
      return {
        trail,
        ascentPath: '관음사 안내소 ➡️ 탐라계곡 ➡️ 삼각봉 대피소 ➡️ 백록담 정상 완등',
        descentPath: '백록담 정상 ➡️ 진달래밭 대피소 ➡️ 사오름 갈림길 ➡️ 성판악 하산 (교차 하산 최고 추천)',
        totalDistance: 18.3,
        estimatedDuration: 9.5,
        difficultyKorean: '최고 난이도 (급경사 암반, 무릎 주의)',
        suitabilityScore: 95,
        justification: '한라산 등정의 참맛을 느끼고 싶으신 우수 등산객에게 가장 알맞은 루트입니다. 비경이 화려한 관음사 코스로 가파르게 올라 정상을 밟고, 내려올 때는 비교적 충격이 덜한 성판악의 완만한 능선을 타서 다차원적 풍경을 즐길 수 있는 최고의 연계 등반 경로입니다.',
        transitGuide: '관음사로 올라가 성판악으로 내려오는 크로스 산행이므로 대중교통 이용이 강제됩니다. 관음사 기점인 477번 버스 탑승 혹은 제주시청에서 택시를 이용해 초입 진공 후, 성판악에서 281번 버스로 복귀하세요.',
        calorieEstimate: 2800
      };
    }
  } else if (goal === 'SCENIC') {
    // Beautiful scenic views - Yeongsil is number one.
    const trail = TRAILS.yeongsil;
    return {
      trail,
      ascentPath: '영실 매표소 ➡️ 오백나한 병풍바위 ➡️ 구상나무 숲 ➡️ 윗세오름 대피소',
      descentPath: '윗세오름 ➡️ 만세동산 ➡️ 사제비동산 ➡️ 어리목 광장 하산',
      totalDistance: 12.6,
      estimatedDuration: 5.5,
      difficultyKorean: '보통 (환상적인 절경 가득)',
      suitabilityScore: 98,
      justification: '백록담 정상은 갈 수 없지만 기암괴석과 선작지왓 철쭉 고원, 그리고 서벽 분기점의 미려한 봉우리를 만날 수 있는 최상의 절경 코스입니다. 영실의 웅장한 바위 지프라이드를 보며 올라가서, 시야가 탁 ட்인 평원으로 나와 어리목의 우거진 신갈나무 원시림으로 기분 좋은 피톤치드 하산길을 구축합니다.',
      transitGuide: '영실-어리목 교차 코스로서 240번 버스 연동이 훌륭합니다. 영실 상부 주차공간의 매진 리스크를 회피하고 주차가 간편한 어리목에 주차 후 버스나 합승택시로 이동하여 이용할 수 있습니다.',
      calorieEstimate: 1420
    };
  } else {
    // EASY_WALK or FAMILY
    const trail = TRAILS.eorimok;
    return {
      trail,
      ascentPath: '어리목 광장 ➡️ 어리목교 ➡️ 목공원 쉼터 ➡️ 사제비약수터 (반환)',
      descentPath: '사제비약수터 ➡️ 사제비동산 삼림욕로 ➡️ 어리목 광장 원점회귀',
      totalDistance: 4.8,
      estimatedDuration: 2.5,
      difficultyKorean: '쉬움 / 가족 친화적',
      suitabilityScore: 90,
      justification: '어린이나 고령 동반 가족, 가벼운 단풍 구경에 집중하고 싶은 분들을 위해 설계되었습니다. 사제비까지 가파르지 않은 넓은 바닥 목조 데크길이 그늘을 드리워 시원하며 목을 기르는 사제비 천연 약수로 가볍게 힐링하고 복귀하는 맞춤형 반환 코스입니다.',
      transitGuide: '어리목 공영 주차장은 154대로 꽤 여유롭습니다. 오전 9시 전후 도착 시 무난한 주차가 가능하며 제주대-영실 순환선 240번 버스 정류장도 편리합니다.',
      calorieEstimate: 580
    };
  }
}
