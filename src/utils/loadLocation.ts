import locationData from '../data/location.json';

export interface Location {
  regionCode: string;
  label: string;
  latitude: number;
  longitude: number;
}

export interface CountryLocation {
  name: string;
  cities: Location[];
}

// ✅ 加入這段：取得所有國家名稱
export const getAllCountryNames = (): string[] => {
  return locationData.map((c: CountryLocation) => c.name);
};

export const getAllLocations = (): Location[] => {
  return locationData.flatMap((c: CountryLocation) => c.cities);
};

export const getLocationsByCountry = (countryName: string): Location[] => {
  const country = locationData.find((c: CountryLocation) => c.name === countryName);
  return country ? country.cities : [];
};

export const isTaiwanLocation = (lat: number, lng: number): boolean => {
  return lat >= 20 && lat <= 26 && lng >= 119 && lng <= 123;
};

export const isChinaLocation = (lat: number, lng: number): boolean => {
  return lat >= 18 && lat <= 54 && lng >= 73 && lng <= 135;
};

export const detectCountryFromCoordinates = (lat: number, lng: number): '台灣' | '中國' | '其他' => {
  if (isTaiwanLocation(lat, lng)) return '台灣';
  if (isChinaLocation(lat, lng)) return '中國';
  return '其他';
};

export const findMatchingCity = (
  cities: Location[],
  lat: number,
  lng: number
): Location | null => {
  return cities.find(c => c.latitude === lat && c.longitude === lng) || null;
};
