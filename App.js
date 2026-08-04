import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  RefreshControl, 
  ActivityIndicator, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchWeatherData, DEFAULT_CITIES } from './src/api/weatherApi';
import { getWeatherInfo } from './src/utils/weatherCodeMap';
import { HeaderBar } from './src/components/HeaderBar';
import { CurrentWeather } from './src/components/CurrentWeather';
import { HourlyForecast } from './src/components/HourlyForecast';
import { DailyForecast } from './src/components/DailyForecast';
import { WeatherGrid } from './src/components/WeatherGrid';
import { SearchModal } from './src/components/SearchModal';
import { WeatherIcon } from './src/components/WeatherIcon';

export default function App() {
  const [city, setCity] = useState(DEFAULT_CITIES[0]); // Default to New York
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);

  const loadWeather = useCallback(async (location = city, showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(location.latitude, location.longitude);
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError('Unable to fetch weather data. Please check your connection.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [city]);

  useEffect(() => {
    loadWeather(city, true);
  }, [city]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWeather(city, false);
  };

  const toggleUnit = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  // Determine current weather code & gradient theme
  const currentWeather = weatherData?.current_weather;
  const weatherCode = currentWeather?.weathercode ?? 0;
  const isDay = currentWeather?.is_day ?? 1;
  const weatherInfo = getWeatherInfo(weatherCode, isDay);

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={weatherInfo.gradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <HeaderBar
            city={city}
            unit={unit}
            onToggleUnit={toggleUnit}
            onOpenSearch={() => setSearchVisible(true)}
          />

          {isLoading ? (
            <View style={styles.centeredContent}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Fetching latest weather...</Text>
            </View>
          ) : error ? (
            <View style={styles.centeredContent}>
              <WeatherIcon name="cloud-rain" size={60} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={() => loadWeather(city, true)}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#FFFFFF"
                  colors={['#FFFFFF']}
                />
              }
            >
              <CurrentWeather
                currentWeather={weatherData?.current_weather}
                dailyData={weatherData?.daily}
                weatherInfo={weatherInfo}
                unit={unit}
              />

              <HourlyForecast
                hourlyData={weatherData?.hourly}
                unit={unit}
              />

              <DailyForecast
                dailyData={weatherData?.daily}
                unit={unit}
              />

              <WeatherGrid
                currentWeather={weatherData?.current_weather}
                dailyData={weatherData?.daily}
                unit={unit}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Powered by Open-Meteo Weather API</Text>
              </View>
            </ScrollView>
          )}

          <SearchModal
            visible={searchVisible}
            onClose={() => setSearchVisible(false)}
            onSelectCity={(newCity) => setCity(newCity)}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F2027',
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  errorText: {
    marginTop: 14,
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '400',
  },
});
