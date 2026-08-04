import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodeMap';
import { formatTemp, formatDay } from '../utils/formatters';

export const DailyForecast = ({ dailyData, unit }) => {
  if (!dailyData || !dailyData.time) return null;

  // Calculate week min and max to render temperature proportion bars
  const weekMin = Math.min(...dailyData.temperature_2m_min);
  const weekMax = Math.max(...dailyData.temperature_2m_max);
  const weekRange = weekMax - weekMin || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>7-DAY FORECAST</Text>
      
      <View style={styles.cardContainer}>
        {dailyData.time.map((dateStr, index) => {
          const code = dailyData.weathercode[index];
          const weather = getWeatherInfo(code, 1);
          const minT = dailyData.temperature_2m_min[index];
          const maxT = dailyData.temperature_2m_max[index];
          const precipProb = dailyData.precipitation_probability_max ? dailyData.precipitation_probability_max[index] : 0;

          // Bar offset and width calculations
          const leftPercent = ((minT - weekMin) / weekRange) * 100;
          const widthPercent = Math.max(((maxT - minT) / weekRange) * 100, 10);

          return (
            <View key={dateStr} style={[styles.dayRow, index < dailyData.time.length - 1 && styles.borderBottom]}>
              <Text style={[styles.dayText, index === 0 && styles.todayText]}>
                {formatDay(dateStr, index)}
              </Text>

              <View style={styles.iconAndPrecip}>
                <WeatherIcon name={weather.icon} size={22} color="#FFFFFF" />
                {precipProb > 0 && (
                  <Text style={styles.precipText}>{precipProb}%</Text>
                )}
              </View>

              <Text style={styles.minTemp}>{formatTemp(minT, unit)}</Text>

              <View style={styles.barTrack}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      left: `${leftPercent}%`, 
                      width: `${widthPercent}%` 
                    }
                  ]} 
                />
              </View>

              <Text style={styles.maxTemp}>{formatTemp(maxT, unit)}</Text>
            </View>
          );
        })}
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
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayText: {
    width: 65,
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  todayText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  iconAndPrecip: {
    width: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  precipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
  },
  minTemp: {
    width: 38,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 3,
    marginHorizontal: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  maxTemp: {
    width: 38,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
  },
});
