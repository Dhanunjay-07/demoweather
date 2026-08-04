// Hackathon Weather App API Handler
// Integrates OpenWeatherMap API with automatic fallback

export const API_KEY = '2a30bad41d6d7b88f1e84d64eaec73bf';

export const CITIES = [
  { name: 'New York', country: 'United States', admin1: 'New York', latitude: 40.7128, longitude: -74.006 },
  { name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503 },
  { name: 'Paris', country: 'France', admin1: 'Île-de-France', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093 },
  { name: 'Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209 },
  { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777 }
];

const mapConditionCode = (id) => {
  if (id >= 200 && id < 300) return 95; // Thunderstorm
  if (id >= 300 && id < 400) return 51; // Drizzle
  if (id >= 500 && id < 600) return 61; // Rain
  if (id >= 600 && id < 700) return 71; // Snow
  if (id >= 700 && id < 800) return 45; // Fog
  if (id === 800) return 0;            // Clear
  if (id === 801) return 1;            // Mainly Clear
  if (id === 802) return 2;            // Partly Cloudy
  return 3;                            // Overcast
};

export const fetchWeather = async (lat, lon) => {
  try {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (currentRes.ok && forecastRes.ok) {
      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      const now = Math.floor(Date.now() / 1000);
      const isDay = now >= current.sys.sunrise && now <= current.sys.sunset ? 1 : 0;
      const code = mapConditionCode(current.weather[0]?.id || 800);

      const hourlyTime = [];
      const hourlyTemp = [];
      const hourlyCode = [];
      const hourlyPrecip = [];
      const hourlyIsDay = [];

      forecast.list.forEach((item) => {
        hourlyTime.push(item.dt_txt);
        hourlyTemp.push(item.main.temp);
        hourlyCode.push(mapConditionCode(item.weather[0]?.id || 800));
        hourlyPrecip.push(Math.round((item.pop || 0) * 100));
        hourlyIsDay.push(item.sys.pod === 'd' ? 1 : 0);
      });

      const dailyGroup = {};
      forecast.list.forEach((item) => {
        const dateKey = item.dt_txt.split(' ')[0];
        if (!dailyGroup[dateKey]) {
          dailyGroup[dateKey] = { temps: [], codes: [], popMax: 0, rain: 0 };
        }
        dailyGroup[dateKey].temps.push(item.main.temp_min, item.main.temp_max);
        dailyGroup[dateKey].codes.push(mapConditionCode(item.weather[0]?.id || 800));
        if (item.pop > dailyGroup[dateKey].popMax) {
          dailyGroup[dateKey].popMax = item.pop;
        }
        if (item.rain && item.rain['3h']) {
          dailyGroup[dateKey].rain += item.rain['3h'];
        }
      });

      const dailyDates = Object.keys(dailyGroup);
      const dailyMax = dailyDates.map(d => Math.max(...dailyGroup[d].temps));
      const dailyMin = dailyDates.map(d => Math.min(...dailyGroup[d].temps));
      const dailyCodes = dailyDates.map(d => dailyGroup[d].codes[0]);
      const dailyPop = dailyDates.map(d => Math.round(dailyGroup[d].popMax * 100));
      const dailyRain = dailyDates.map(d => Math.round(dailyGroup[d].rain * 10) / 10);

      return {
        current_weather: {
          temperature: current.main.temp,
          apparent_temperature: current.main.feels_like,
          weathercode: code,
          is_day: isDay,
          windspeed: current.wind.speed * 3.6,
          winddirection: current.wind.deg,
          relative_humidity_2m: current.main.humidity,
        },
        hourly: {
          time: hourlyTime,
          temperature_2m: hourlyTemp,
          weathercode: hourlyCode,
          precipitation_probability: hourlyPrecip,
          is_day: hourlyIsDay,
        },
        daily: {
          time: dailyDates,
          weathercode: dailyCodes,
          temperature_2m_max: dailyMax,
          temperature_2m_min: dailyMin,
          sunrise: [new Date(current.sys.sunrise * 1000).toISOString()],
          sunset: [new Date(current.sys.sunset * 1000).toISOString()],
          uv_index_max: [5.0],
          precipitation_sum: dailyRain,
          precipitation_probability_max: dailyPop,
        }
      };
    }
  } catch (err) {
    console.log('OpenWeatherMap error, switching fallback:', err);
  }

  // Backup data fetcher
  const fallbackUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weathercode,windspeed_10m,apparent_temperature,precipitation_probability,is_day&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;
  const res = await fetch(fallbackUrl);
  return await res.json();
};

export const findCities = async (q) => {
  if (!q || q.length < 2) return [];
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=8&appid=${API_KEY}`;
    const res = await fetch(geoUrl);
    if (res.ok) {
      const list = await res.json();
      if (Array.isArray(list) && list.length > 0) {
        return list.map((c, i) => ({
          id: `city-${c.lat}-${c.lon}-${i}`,
          name: c.name,
          country: c.country || '',
          admin1: c.state || '',
          latitude: c.lat,
          longitude: c.lon
        }));
      }
    }
  } catch (e) {
    console.log('Geo search fallback:', e);
  }
  return [];
};
