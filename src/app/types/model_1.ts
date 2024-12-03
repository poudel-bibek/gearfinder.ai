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

export const activityImages: Record<string, string> = {
  'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2400',
  'Volleyball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2400',
  'Tennis': 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2400',
  'Pickleball': 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2400',
  'Golf': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2400',
  'Rock Climbing': 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2400',
  'Hiking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2400',
  'Camping': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2400',
  'Swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2400',
  'Surfing': 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2400',
  'Kayaking': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2400',
  'Fishing': 'https://images.unsplash.com/photo-1493787039806-2edcbe808750?q=80&w=2400',
  'Skiing': 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?q=80&w=2400',
  'Biking': 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?q=80&w=2400',
  'Fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2400'
}; 