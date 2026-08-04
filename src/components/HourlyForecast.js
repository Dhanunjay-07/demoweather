import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodeMap';
import { formatTemp, formatTime } from '../utils/formatters';

export const HourlyForecast = ({ hourlyData, unit }) => {
  if (!hourlyData || !hourlyData.time) return null;

  // Take the next 24 hours starting from current hour
  const currentIsoHour = new Date().toISOString().substring(0, 13);
  let startIndex = hourlyData.time.findIndex(t => t.startsWith(currentIsoHour));
  if (startIndex === -1) startIndex = 0;
  
  const hourlyItems = hourlyData.time.slice(startIndex, startIndex + 24).map((time, idx) => {
    const realIndex = startIndex + idx;
    return {
      time,
      temp: hourlyData.temperature_2m[realIndex],
      code: hourlyData.weathercode[realIndex],
      precip: hourlyData.precipitation_probability ? hourlyData.precipitation_probability[realIndex] : 0,
      isDay: hourlyData.is_day ? hourlyData.is_day[realIndex] : 1,
      isNow: idx === 0,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>24-HOUR FORECAST</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyItems.map((item, index) => {
          const weather = getWeatherInfo(item.code, item.isDay);
          return (
            <View 
              key={index} 
              style={[
                styles.hourlyCard, 
                item.isNow && styles.nowCard
              ]}
            >
              <Text style={[styles.timeText, item.isNow && styles.nowText]}>
                {item.isNow ? 'Now' : formatTime(item.time)}
              </Text>
              
              <View style={styles.iconContainer}>
                <WeatherIcon name={weather.icon} size={28} color="#FFFFFF" />
              </View>

              <Text style={styles.tempText}>{formatTemp(item.temp, unit)}</Text>

              {item.precip > 0 ? (
                <View style={styles.precipRow}>
                  <WeatherIcon name="droplets" size={10} color="#60A5FA" />
                  <Text style={styles.precipText}>{item.precip}%</Text>
                </View>
              ) : (
                <View style={{ height: 16 }} />
              )}
            </View>
          );
        })}
      </ScrollView>
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
  scrollContent: {
    paddingRight: 20,
    gap: 10,
  },
  hourlyCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 68,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.26)',
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  nowText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconContainer: {
    marginVertical: 8,
  },
  tempText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  precipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  precipText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#60A5FA',
  },
});
