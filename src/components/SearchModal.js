import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { WeatherIcon } from './WeatherIcon';
import { searchCities, DEFAULT_CITIES } from '../api/weatherApi';

export const SearchModal = ({ visible, onClose, onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text) => {
    setQuery(text);
    if (!text || text.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const searchRes = await searchCities(text);
      setResults(searchRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Select Location</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <WeatherIcon name="x" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Search Input Box */}
          <View style={styles.searchBox}>
            <WeatherIcon name="search" size={18} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.input}
              placeholder="Search city (e.g. London, Tokyo, Sydney)..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={query}
              onChangeText={handleSearch}
              autoFocus
              clearButtonMode="while-editing"
            />
            {isSearching && <ActivityIndicator size="small" color="#FFFFFF" />}
          </View>

          {/* Search Results or Popular Cities */}
          <Text style={styles.listSectionTitle}>
            {query.trim().length >= 2 ? 'SEARCH RESULTS' : 'POPULAR CITIES'}
          </Text>

          <FlatList
            data={query.trim().length >= 2 ? results : DEFAULT_CITIES}
            keyExtractor={(item, index) => item.id || `${item.latitude}-${item.longitude}-${index}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cityCard}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <WeatherIcon name="map-pin" size={18} color="#60A5FA" />
                <View style={styles.cityInfo}>
                  <Text style={styles.cityNameText}>{item.name}</Text>
                  <Text style={styles.citySubText}>
                    {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !isSearching && query.trim().length >= 2 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No matching cities found.</Text>
                </View>
              ) : null
            }
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '85%',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  listSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
    gap: 10,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cityInfo: {
    marginLeft: 12,
  },
  cityNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  citySubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});
