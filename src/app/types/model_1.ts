export interface Model1Response {
  result: {
    response: string;
  };
}

export interface GearItem {
  name: string;
  description: string;
}

export interface APIResponse {
  result: {
    response: Record<string, GearItem>;
  };
  query?: string;
} 