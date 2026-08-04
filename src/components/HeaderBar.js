import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WeatherIcon } from './WeatherIcon';

export const HeaderBar = ({ city, unit, onToggleUnit, onOpenSearch }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationButton} onPress={onOpenSearch} activeOpacity={0.7}>
        <WeatherIcon name="map-pin" size={20} color="#FFFFFF" />
        <View style={styles.locationTextContainer}>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.countryName}>
            {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.rightActions}>
        <TouchableOpacity 
          style={styles.unitToggle} 
          onPress={onToggleUnit}
          activeOpacity={0.8}
        >
          <Text style={[styles.unitText, unit === 'C' && styles.activeUnit]}>°C</Text>
          <Text style={styles.unitDivider}>|</Text>
          <Text style={[styles.unitText, unit === 'F' && styles.activeUnit]}>°F</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onOpenSearch}
          activeOpacity={0.8}
        >
          <WeatherIcon name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  locationTextContainer: {
    marginLeft: 8,
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  countryName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '400',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  activeUnit: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  unitDivider: {
    color: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
    fontSize: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
