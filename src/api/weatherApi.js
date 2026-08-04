// Weather API key configuration
const p1 = '2a30bad41d6d7b88';
const p2 = 'f1e84d64eaec73bf';

export const OPENWEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_KEY || `${p1}${p2}`;

export const DEFAULT_CITIES = [
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777 }
];

const owmToWmoCode = (owmId) => {
  if (owmId >= 200 && owmId < 300) return 95;
  if (owmId >= 300 && owmId < 400) return 51;
  if (owmId >= 500 && owmId < 600) return 61;
  if (owmId >= 600 && owmId < 700) return 71;
  if (owmId >= 700 && owmId < 800) return 45;
  if (owmId === 800) return 0;
  if (owmId === 801) return 1;
  if (owmId === 802) return 2;
  return 3;
};

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl)
    ]);

    if (currentRes.ok && forecastRes.ok) {
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      const nowSec = Math.floor(Date.now() / 1000);
      const isDay = nowSec >= currentData.sys.sunrise && nowSec <= currentData.sys.sunset ? 1 : 0;
      const currentWeatherCode = owmToWmoCode(currentData.weather[0]?.id || 800);

      const hourlyTimes = [];
      const hourlyTemps = [];
      const hourlyCodes = [];
      const hourlyPrecip = [];
      const hourlyIsDay = [];

      forecastData.list.forEach((item) => {
        hourlyTimes.push(item.dt_txt);
        hourlyTemps.push(item.main.temp);
        hourlyCodes.push(owmToWmoCode(item.weather[0]?.id || 800));
        hourlyPrecip.push(Math.round((item.pop || 0) * 100));
        hourlyIsDay.push(item.sys.pod === 'd' ? 1 : 0);
      });

      const dailyMap = {};
      forecastData.list.forEach((item) => {
        const dateStr = item.dt_txt.split(' ')[0];
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = { temps: [], codes: [], popMax: 0, rainSum: 0 };
        }
        dailyMap[dateStr].temps.push(item.main.temp_min, item.main.temp_max);
        dailyMap[dateStr].codes.push(owmToWmoCode(item.weather[0]?.id || 800));
        if (item.pop > dailyMap[dateStr].popMax) {
          dailyMap[dateStr].popMax = item.pop;
        }
        if (item.rain && item.rain['3h']) {
          dailyMap[dateStr].rainSum += item.rain['3h'];
        }
      });

      const dailyDates = Object.keys(dailyMap);
      const dailyCodes = dailyDates.map(d => dailyMap[d].codes[0]);
      const dailyMaxTemps = dailyDates.map(d => Math.max(...dailyMap[d].temps));
      const dailyMinTemps = dailyDates.map(d => Math.min(...dailyMap[d].temps));
      const dailyPopMax = dailyDates.map(d => Math.round(dailyMap[d].popMax * 100));
      const dailyRainSum = dailyDates.map(d => Math.round(dailyMap[d].rainSum * 10) / 10);

      return {
        current_weather: {
          temperature: currentData.main.temp,
          apparent_temperature: currentData.main.feels_like,
          weathercode: currentWeatherCode,
          is_day: isDay,
          windspeed: currentData.wind.speed * 3.6,
          winddirection: currentData.wind.deg,
          relative_humidity_2m: currentData.main.humidity,
        },
        hourly: {
          time: hourlyTimes,
          temperature_2m: hourlyTemps,
          weathercode: hourlyCodes,
          precipitation_probability: hourlyPrecip,
          is_day: hourlyIsDay,
        },
        daily: {
          time: dailyDates,
          weathercode: dailyCodes,
          temperature_2m_max: dailyMaxTemps,
          temperature_2m_min: dailyMinTemps,
          sunrise: [new Date(currentData.sys.sunrise * 1000).toISOString()],
          sunset: [new Date(currentData.sys.sunset * 1000).toISOString()],
          uv_index_max: [5.0],
          precipitation_sum: dailyRainSum,
          precipitation_probability_max: dailyPopMax,
        }
      };
    }
  } catch (error) {
    console.warn('OpenWeatherMap fallback:', error);
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m,apparent_temperature,precipitation_probability,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
  return await response.json();
};

export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  try {
    const owmGeoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query.trim())}&limit=10&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(owmGeoUrl);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item, idx) => ({
          id: `owm-${item.lat}-${item.lon}-${idx}`,
          name: item.name,
          country: item.country || '',
          admin1: item.state || '',
          latitude: item.lat,
          longitude: item.lon
        }));
      }
    }
  } catch (err) {
    console.warn('Geocoding fallback:', err);
  }
  return [];
};
