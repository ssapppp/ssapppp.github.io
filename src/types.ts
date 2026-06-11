/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TrailID = 'seongpanak' | 'gwaneumsa' | 'yeongsil' | 'eorimok' | 'donnaeko';

export interface Checkpoint {
  id: string;
  name: string;
  elevation: number; // in meters
  distanceFromStart: number; // in km
  averageTime: number; // in minutes
  description: string;
  isBottleneck: boolean;
  bottleneckReason?: string;
}

export interface TrailInfo {
  id: TrailID;
  name: string;
  engName: string;
  length: number; // total km
  duration: number; // in hours, total ascent
  elevationGain: number; // in meters (max height - start height)
  startElevation: number;
  endElevation: number;
  difficulty: 'EASY' | 'MODERATE' | 'HARD' | 'EXPERT';
  difficultyKorean: string;
  description: string;
  reservationRequired: boolean;
  maxDailyCapacity?: number;
  checkpoints: Checkpoint[];
  parkingLotName: string;
  parkingTotal: number;
  busLines: string[];
}

export interface YearlyVisitorData {
  year: number;
  seongpanak: number;
  gwaneumsa: number;
  yeongsil: number;
  eorimok: number;
  donnaeko: number;
  total: number;
}

export interface MonthlyDistribution {
  month: number;
  ratio: number; // percentage of annual visits (0.05 to 0.15)
  avgTemp: number; // celsius
  avgRainfall: number; // mm
  remark: string;
}

export interface BusStatus {
  id: string;
  routeNumber: string;
  destination: string;
  currentStopKorean: string;
  etaMinutes: number;
  intervalMinutes: number;
  isDelayed: boolean;
}

export interface WeatherCondition {
  location: string;
  temp: number;
  condition: 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY';
  conditionKorean: string;
  windSpeed: number; // m/s
  humidity: number;
  visibility: number; // km
  statusText: string;
  ascentPermitted: boolean;
}

export interface RouteRecommendationRequest {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'FAMILY';
  goal: 'SUMMIT' | 'SCENIC' | 'EASY_WALK';
  transport: 'PUBLIC' | 'CAR' | 'TAXI';
  duration: number; // available hours (e.g., 3, 5, 8, 10)
}

export interface RouteRecommendationResult {
  trail: TrailInfo;
  ascentPath: string;
  descentPath: string;
  totalDistance: number;
  estimatedDuration: number; // hours
  difficultyKorean: string;
  suitabilityScore: number; // 0-100%
  justification: string;
  transitGuide: string;
  calorieEstimate: number;
}
