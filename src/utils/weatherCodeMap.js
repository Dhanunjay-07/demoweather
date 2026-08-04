// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs

export const WEATHER_CODES = {
  0: { label: 'Clear Sky', category: 'clear', icon: 'sun', dayGradient: ['#3A7BD5', '#3a6073'], nightGradient: ['#0F2027', '#203A43', '#2C5364'] },
  1: { label: 'Mainly Clear', category: 'clear', icon: 'sun', dayGradient: ['#4A00E0', '#8E2DE2'], nightGradient: ['#141E30', '#243B55'] },
  2: { label: 'Partly Cloudy', category: 'cloudy', icon: 'cloud-sun', dayGradient: ['#2980B9', '#6DD5FA', '#FFFFFF'], nightGradient: ['#1F1C2C', '#928DAB'] },
  3: { label: 'Overcast', category: 'cloudy', icon: 'cloud', dayGradient: ['#606c88', '#3f4c6b'], nightGradient: ['#232526', '#414345'] },
  45: { label: 'Foggy', category: 'fog', icon: 'align-justify', dayGradient: ['#757F9A', '#D7DDE8'], nightGradient: ['#3E5151', '#DECBA4'] },
  48: { label: 'Depositing Rime Fog', category: 'fog', icon: 'align-justify', dayGradient: ['#606c88', '#3f4c6b'], nightGradient: ['#2C3E50', '#000000'] },
  51: { label: 'Light Drizzle', category: 'rain', icon: 'cloud-drizzle', dayGradient: ['#3a7bd5', '#3a6073'], nightGradient: ['#16222A', '#3A6073'] },
  53: { label: 'Moderate Drizzle', category: 'rain', icon: 'cloud-drizzle', dayGradient: ['#2b5876', '#4e4376'], nightGradient: ['#0f2027', '#203a43'] },
  55: { label: 'Dense Drizzle', category: 'rain', icon: 'cloud-rain', dayGradient: ['#1e3c72', '#2a5298'], nightGradient: ['#000000', '#434343'] },
  61: { label: 'Slight Rain', category: 'rain', icon: 'cloud-rain', dayGradient: ['#36D1DC', '#5B86E5'], nightGradient: ['#1F1C2C', '#928DAB'] },
  63: { label: 'Moderate Rain', category: 'rain', icon: 'cloud-rain', dayGradient: ['#2b5876', '#4e4376'], nightGradient: ['#0f2027', '#203a43'] },
  65: { label: 'Heavy Rain', category: 'rain', icon: 'cloud-rain', dayGradient: ['#1F1C2C', '#928DAB'], nightGradient: ['#000000', '#0f2027'] },
  71: { label: 'Slight Snow', category: 'snow', icon: 'snowflake', dayGradient: ['#E0EAFC', '#CFDEF3'], nightGradient: ['#2C3E50', '#4CA1AF'] },
  73: { label: 'Moderate Snow', category: 'snow', icon: 'snowflake', dayGradient: ['#83a4d4', '#b6fbff'], nightGradient: ['#1c92d2', '#f2fcfe'] },
  75: { label: 'Heavy Snow', category: 'snow', icon: 'snowflake', dayGradient: ['#E6DADA', '#274046'], nightGradient: ['#1F1C2C', '#928DAB'] },
  77: { label: 'Snow Grains', category: 'snow', icon: 'snowflake', dayGradient: ['#83a4d4', '#b6fbff'], nightGradient: ['#2C3E50', '#000000'] },
  80: { label: 'Light Showers', category: 'rain', icon: 'cloud-rain', dayGradient: ['#36D1DC', '#5B86E5'], nightGradient: ['#16222A', '#3A6073'] },
  81: { label: 'Moderate Showers', category: 'rain', icon: 'cloud-rain', dayGradient: ['#2b5876', '#4e4376'], nightGradient: ['#0f2027', '#203a43'] },
  82: { label: 'Violent Showers', category: 'rain', icon: 'cloud-lightning', dayGradient: ['#1F1C2C', '#928DAB'], nightGradient: ['#000000', '#141E30'] },
  85: { label: 'Slight Snow Showers', category: 'snow', icon: 'snowflake', dayGradient: ['#83a4d4', '#b6fbff'], nightGradient: ['#1c92d2', '#f2fcfe'] },
  86: { label: 'Heavy Snow Showers', category: 'snow', icon: 'snowflake', dayGradient: ['#E6DADA', '#274046'], nightGradient: ['#1F1C2C', '#928DAB'] },
  95: { label: 'Thunderstorm', category: 'thunderstorm', icon: 'zap', dayGradient: ['#373B44', '#4286f4'], nightGradient: ['#0F2027', '#203A43', '#2C5364'] },
  96: { label: 'Thunderstorm with Hail', category: 'thunderstorm', icon: 'zap', dayGradient: ['#232526', '#414345'], nightGradient: ['#000000', '#434343'] },
  99: { label: 'Heavy Thunderstorm', category: 'thunderstorm', icon: 'zap', dayGradient: ['#141E30', '#243B55'], nightGradient: ['#000000', '#0F2027'] },
};

export const getWeatherInfo = (code, isDay = 1) => {
  const weather = WEATHER_CODES[code] || {
    label: 'Unknown Weather',
    category: 'cloudy',
    icon: 'cloud',
    dayGradient: ['#3A7BD5', '#3a6073'],
    nightGradient: ['#0F2027', '#203A43', '#2C5364']
  };

  const gradients = isDay ? weather.dayGradient : weather.nightGradient;

  return {
    ...weather,
    gradient: gradients
  };
};
