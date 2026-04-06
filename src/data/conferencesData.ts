export interface Conference {
  title: string;
  location: string;
  country: string;
  year: string;
  description: string;
  icon: string;
  type: 'conference' | 'backpacking';
  coordinates: { lat: number; lng: number };
}

export const conferences: Conference[] = [
  {
    title: 'BazelCon 2024',
    location: 'Mountain View, CA',
    country: 'USA',
    year: '2024',
    description: 'Attended BazelCon 2024 at Google HQ, engaging with the Bazel open-source community and learning about build system innovations.',
    icon: '🇺🇸',
    type: 'conference',
    coordinates: { lat: 37.3861, lng: -122.0839 },
  },
  {
    title: 'OpenSearch Korea 2025',
    location: 'Seoul',
    country: 'South Korea',
    year: '2025',
    description: 'Attended OpenSearchCon Korea, connecting with the open-source search and analytics community across the Asia-Pacific region.',
    icon: '🇰🇷',
    type: 'conference',
    coordinates: { lat: 37.5665, lng: 126.978 },
  },
  {
    title: 'OpenSearch Japan 2025',
    location: 'Tokyo',
    country: 'Japan',
    year: '2025',
    description: 'Attended OpenSearchCon Japan, exploring enterprise search solutions and contributing to open-source discussions in Tokyo.',
    icon: '🇯🇵',
    type: 'conference',
    coordinates: { lat: 35.6762, lng: 139.6503 },
  },
  {
    title: 'Singapore',
    location: 'Singapore City',
    country: 'Singapore',
    year: '2024',
    description: 'Explored the Garden City — from Marina Bay Sands to hawker centres. Experienced the intersection of technology and culture.',
    icon: '🇸🇬',
    type: 'backpacking',
    coordinates: { lat: 1.3521, lng: 103.8198 },
  },
  {
    title: 'China',
    location: 'Multiple Cities',
    country: 'China',
    year: '2024',
    description: 'Backpacked across China — experiencing its rich history, modern tech hubs, and incredible landscapes from the Great Wall to Shenzhen.',
    icon: '🇨🇳',
    type: 'backpacking',
    coordinates: { lat: 39.9042, lng: 116.4074 },
  },
  {
    title: 'Thailand',
    location: 'Bangkok & Beyond',
    country: 'Thailand',
    year: '2024',
    description: 'Explored Thailand from the temples of Bangkok to the beaches of the south. A perfect blend of culture, food, and adventure.',
    icon: '🇹🇭',
    type: 'backpacking',
    coordinates: { lat: 13.7563, lng: 100.5018 },
  },
];
