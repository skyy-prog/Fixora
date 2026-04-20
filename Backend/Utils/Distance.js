const toNumber = (value) => Number(value);
const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const calculateDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  const lat1 = toNumber(fromLat);
  const lng1 = toNumber(fromLng);
  const lat2 = toNumber(toLat);
  const lng2 = toNumber(toLng);

  if ([lat1, lng1, lat2, lng2].some((value) => Number.isNaN(value))) {
    return null;
  }

  const EARTH_RADIUS_KM = 6371;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const haversine =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return Number((EARTH_RADIUS_KM * angularDistance).toFixed(2));
};
