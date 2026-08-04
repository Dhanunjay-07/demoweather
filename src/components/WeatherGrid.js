import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { formatWindSpeed, getUvLevel, getWindDirection, formatTime } from '../utils/formatters';

export const WeatherGrid = ({ currentWeather, dailyData, unit }) => {
  if (!currentWeather) return null;

  const windSpeed = currentWeather.windspeed;
  const windDir = currentWeather.winddirection;
  const humidity = currentWeather.relative_humidity_2m;
  const uvIndex = dailyData?.uv_index_max?.[0];
  const sunrise = dailyData?.sunrise?.[0];
  const sunset = dailyData?.sunset?.[0];
  const precipSum = dailyData?.precipitation_sum?.[0];

  const cards = [
    {
      title: 'WIND',
      icon: 'wind',
      value: formatWindSpeed(windSpeed, unit),
      subtext: windDir !== undefined ? `Direction: ${getWindDirection(windDir)} (${windDir}°)` : 'Gentle Breeze',
    },
    {
      title: 'HUMIDITY',
      icon: 'droplets',
      value: humidity !== undefined ? `${humidity}%` : '--',
      subtext: humidity > 70 ? 'High moisture in air' : humidity < 30 ? 'Dry air conditions' : 'Comfortable',
    },
    {
      title: 'UV INDEX',
      icon: 'sun',
      value: uvIndex !== undefined ? `${Math.round(uvIndex)}` : '--',
      subtext: `${getUvLevel(uvIndex)} risk of harm`,
    },
    {
      title: 'SUNSET & SUNRISE',
      icon: 'sunrise',
      value: sunrise ? formatTime(sunrise) : '--',
      subtext: sunset ? `Sunset at ${formatTime(sunset)}` : 'Daylight hours',
    },
    {
      title: 'PRECIPITATION',
      icon: 'umbrella',
      value: precipSum !== undefined ? `${precipSum} mm` : '0 mm',
      subtext: 'Expected today',
    },
    {
      title: 'AIR STATUS',
      icon: 'gauge',
      value: 'Normal',
      subtext: 'Optimal pressure level',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>WEATHER DETAILS</Text>
      <View style={styles.grid}>
        {cards.map((card, idx) => (
          <View key={idx} style={styles.gridCard}>
            <View style={styles.cardHeader}>
              <WeatherIcon name={card.icon} size={16} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>

            <Text style={styles.cardValue}>{card.value}</Text>
            <Text style={styles.cardSubtext}>{card.subtext}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'space-between',
    minHeight: 115,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 6,
  },
  cardSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '400',
  },
});
