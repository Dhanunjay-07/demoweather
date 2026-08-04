export const formatTemp = (celsius, unit = 'C') => {
  if (celsius === undefined || celsius === null) return '--°';
  if (unit === 'F') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°`;
  }
  return `${Math.round(celsius)}°`;
};

export const formatTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 hour should be 12
  return `${hours} ${ampm}`;
};

export const formatDay = (dateString, index) => {
  if (index === 0) return 'Today';
  if (!dateString) return '';
  
  const date = new Date(dateString + 'T00:00:00');
  if (isNaN(date.getTime())) return dateString;
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};

export const formatWindSpeed = (speedKmH, unit = 'C') => {
  if (speedKmH === undefined || speedKmH === null) return '--';
  if (unit === 'F') {
    const mph = Math.round(speedKmH * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(speedKmH)} km/h`;
};

export const getUvLevel = (uvIndex) => {
  if (uvIndex === undefined || uvIndex === null) return 'N/A';
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
};

export const getWindDirection = (degree) => {
  if (degree === undefined || degree === null) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degree %= 360) / 45) % 8;
  return directions[index];
};
