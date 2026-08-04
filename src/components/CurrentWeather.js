import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { formatTemp } from '../utils/formatters';

export const CurrentWeather = ({ currentWeather, dailyData, weatherInfo, unit }) => {
  const temp = currentWeather?.temperature;
  const feelsLike = currentWeather?.apparent_temperature ?? temp;
  const maxTemp = dailyData?.temperature_2m_max?.[0];
  const minTemp = dailyData?.temperature_2m_min?.[0];

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{todayDate}</Text>
      
      <View style={styles.heroIconContainer}>
        <WeatherIcon name={weatherInfo.icon} size={88} color="#FFFFFF" />
      </View>

      <Text style={styles.temperature}>{formatTemp(temp, unit)}</Text>
      
      <Text style={styles.conditionText}>{weatherInfo.label}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Text style={styles.metaLabel}>H: {formatTemp(maxTemp, unit)}</Text>
          <Text style={styles.metaLabel}>  L: {formatTemp(minTemp, unit)}</Text>
        </View>

        {feelsLike !== undefined && (
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>Feels like {formatTemp(feelsLike, unit)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroIconContainer: {
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  temperature: {
    fontSize: 76,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: -2,
    marginVertical: -6,
  },
  conditionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  metaPill: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
