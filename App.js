import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  StatusBar, 
  RefreshControl, 
  ActivityIndicator, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchWeather, CITIES } from './src/api';
import { getWeatherInfo } from './src/utils/weatherCodeMap';
import { HeaderBar } from './src/components/HeaderBar';
import { CityChips } from './src/components/CityChips';
import { CurrentWeather } from './src/components/CurrentWeather';
import { HourlyForecast } from './src/components/HourlyForecast';
import { DailyForecast } from './src/components/DailyForecast';
import { WeatherGrid } from './src/components/WeatherGrid';
import { SearchModal } from './src/components/SearchModal';
import { WeatherIcon } from './src/components/WeatherIcon';

export default function App() {
  const [currentCity, setCurrentCity] = useState(CITIES[0]);
  const [unit, setUnit] = useState('C');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCityData = useCallback(async (targetCity = currentCity, isInitial = true) => {
    if (isInitial) setLoading(true);
    setErrorMsg(null);

    try {
      const data = await fetchWeather(targetCity.latitude, targetCity.longitude);
      setWeather(data);
    } catch (err) {
      console.log('Error fetching weather:', err);
      setErrorMsg('Could not update weather. Please check connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentCity]);

  useEffect(() => {
    loadCityData(currentCity, true);
  }, [currentCity]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCityData(currentCity, false);
  };

  const handleUnitToggle = () => {
    setUnit(prev => (prev === 'C' ? 'F' : 'C'));
  };

  const currentCondition = weather?.current_weather;
  const weatherCode = currentCondition?.weathercode ?? 0;
  const isDay = currentCondition?.is_day ?? 1;
  const info = getWeatherInfo(weatherCode, isDay);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={info.gradient}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.safeContainer}>
          <HeaderBar
            city={currentCity}
            unit={unit}
            onToggleUnit={handleUnitToggle}
            onOpenSearch={() => setModalOpen(true)}
          />

          <CityChips
            selectedCity={currentCity}
            onSelectCity={(city) => setCurrentCity(city)}
          />

          {loading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading weather...</Text>
            </View>
          ) : errorMsg ? (
            <View style={styles.centerBox}>
              <WeatherIcon name="cloud-rain" size={54} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.errorText}>{errorMsg}</Text>
              <TouchableOpacity 
                style={styles.retryBtn} 
                onPress={() => loadCityData(currentCity, true)}
                activeOpacity={0.8}
              >
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollArea}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#FFFFFF"
                  colors={['#FFFFFF']}
                />
              }
            >
              <CurrentWeather
                currentWeather={weather?.current_weather}
                dailyData={weather?.daily}
                weatherInfo={info}
                unit={unit}
              />

              <HourlyForecast
                hourlyData={weather?.hourly}
                unit={unit}
              />

              <DailyForecast
                dailyData={weather?.daily}
                unit={unit}
              />

              <WeatherGrid
                currentWeather={weather?.current_weather}
                dailyData={weather?.daily}
                unit={unit}
              />
            </ScrollView>
          )}

          <SearchModal
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
            onSelectCity={(selected) => setCurrentCity(selected)}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2027',
  },
  gradientBg: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 28 : 10,
  },
  scrollArea: {
    paddingBottom: 40,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
