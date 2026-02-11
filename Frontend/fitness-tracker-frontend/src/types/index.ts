// Activity Types
export interface ActivityMetrics {
  [key: string]: number | string | undefined;
}

export interface Activity {
  id: string;
  userId: string;
  type: 'RUNNING' | 'CYCLING' | 'WALKING';
  duration: number;
  caloriesBurned: number;
  startTime: string;
  additionalMetric: ActivityMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRequest {
  type: 'RUNNING' | 'CYCLING' | 'WALKING';
  duration: number;
  calories: number;
  additionalMetric: ActivityMetrics;
  startTime: string;
  userId?: string;
}

export interface ActivityResponse extends Activity {}

// Recommendation Types
export interface Recommendation {
  id: string;
  activityId: string;
  userId: string;
  recommendation: string;
  improvements?: string[];
  suggestions?: string[];
  safety?: string[];
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface TokenData {
  sub: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  token: string | null;
  tokenData: TokenData | null;
  logIn: () => void;
  logOut: () => void;
}

export interface AuthState {
  user: TokenData | null;
  token: string | null;
  userId: string | null;
}

// API Client Types
export interface ApiConfig {
  baseURL: string;
  [key: string]: unknown;
}
