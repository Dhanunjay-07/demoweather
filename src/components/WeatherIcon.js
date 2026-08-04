import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudLightning, 
  Snowflake, 
  AlignJustify, 
  Zap, 
  Wind, 
  Droplets, 
  Eye, 
  Compass, 
  Sunrise, 
  Sunset, 
  Search, 
  MapPin, 
  RefreshCw, 
  X, 
  Thermometer, 
  Umbrella,
  Gauge
} from 'lucide-react-native';

const ICON_MAP = {
  'sun': Sun,
  'cloud-sun': CloudSun,
  'cloud': Cloud,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-lightning': CloudLightning,
  'snowflake': Snowflake,
  'align-justify': AlignJustify,
  'zap': Zap,
  'wind': Wind,
  'droplets': Droplets,
  'eye': Eye,
  'compass': Compass,
  'sunrise': Sunrise,
  'sunset': Sunset,
  'search': Search,
  'map-pin': MapPin,
  'refresh': RefreshCw,
  'x': X,
  'thermometer': Thermometer,
  'umbrella': Umbrella,
  'gauge': Gauge
};

export const WeatherIcon = ({ name, size = 24, color = '#FFFFFF', style }) => {
  const IconComponent = ICON_MAP[name] || Cloud;
  return <IconComponent size={size} color={color} style={style} />;
};
