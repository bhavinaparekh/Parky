import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ParkingSpace, SearchFilters } from '../../types';
import { spaceService } from '../../services/spaceService';

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [spaces, setSpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search location');
      return;
    }

    setLoading(true);
    try {
      const searchFilters: SearchFilters = {
        ...filters,
        // You would typically geocode the search query here
        // For now, we'll use a default location
        location: {
          latitude: 37.7749, // San Francisco coordinates
          longitude: -122.4194,
          radius: 5, // 5 miles radius
        },
      };

      const response = await spaceService.searchSpaces(searchFilters);
      if (response.success && response.data) {
        setSpaces(response.data.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to search spaces');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during search');
    } finally {
      setLoading(false);
    }
  };

  const handleSpacePress = (spaceId: string) => {
    navigation.navigate('SpaceDetails', { spaceId });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const renderSpaceCard = ({ item }: { item: ParkingSpace }) => (
    <TouchableOpacity
      style={styles.spaceCard}
      onPress={() => handleSpacePress(item.id)}
    >
      <View style={styles.spaceImage}>
        <Ionicons name="car-outline" size={40} color="#666" />
      </View>
      <View style={styles.spaceInfo}>
        <Text style={styles.spaceTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.spaceLocation} numberOfLines={2}>
          {item.address}
        </Text>
        <View style={styles.spaceDetails}>
          <View style={styles.spaceType}>
            <Ionicons name="car-outline" size={16} color="#666" />
            <Text style={styles.spaceTypeText}>{item.spaceType}</Text>
          </View>
          <Text style={styles.spacePrice}>
            ${item.hourlyRate}/hour
          </Text>
        </View>
        {item.amenities.length > 0 && (
          <View style={styles.amenities}>
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
            {item.amenities.length > 3 && (
              <Text style={styles.moreAmenities}>+{item.amenities.length - 3} more</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Space Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['driveway', 'garage', 'lot', 'street', 'covered'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                filters.spaceType?.includes(type) && styles.filterChipActive,
              ]}
              onPress={() => {
                const currentTypes = filters.spaceType || [];
                const newTypes = currentTypes.includes(type)
                  ? currentTypes.filter(t => t !== type)
                  : [...currentTypes, type];
                handleFilterChange('spaceType', newTypes);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.spaceType?.includes(type) && styles.filterChipTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Amenities</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['security', 'lighting', 'ev_charging', 'covered', 'camera'].map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.filterChip,
                filters.amenities?.includes(amenity) && styles.filterChipActive,
              ]}
              onPress={() => {
                const currentAmenities = filters.amenities || [];
                const newAmenities = currentAmenities.includes(amenity)
                  ? currentAmenities.filter(a => a !== amenity)
                  : [...currentAmenities, amenity];
                handleFilterChange('amenities', newAmenities);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.amenities?.includes(amenity) && styles.filterChipTextActive,
                ]}
              >
                {amenity.replace('_', ' ').charAt(0).toUpperCase() + amenity.replace('_', ' ').slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Price Range</Text>
        <View style={styles.priceRangeContainer}>
          <TextInput
            style={styles.priceInput}
            placeholder="Min"
            keyboardType="numeric"
            value={filters.priceRange?.min?.toString() || ''}
            onChangeText={(text) => {
              const min = text ? parseFloat(text) : undefined;
              handleFilterChange('priceRange', {
                ...filters.priceRange,
                min,
              });
            }}
          />
          <Text style={styles.priceRangeText}>to</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Max"
            keyboardType="numeric"
            value={filters.priceRange?.max?.toString() || ''}
            onChangeText={(text) => {
              const max = text ? parseFloat(text) : undefined;
              handleFilterChange('priceRange', {
                ...filters.priceRange,
                max,
              });
            }}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filters.instantBook && styles.filterChipActive,
          ]}
          onPress={() => handleFilterChange('instantBook', !filters.instantBook)}
        >
          <Text
            style={[
              styles.filterChipText,
              filters.instantBook && styles.filterChipTextActive,
            ]}
          >
            Instant Book
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
        <Text style={styles.clearFiltersText}>Clear All Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where do you need parking?"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch} disabled={loading}>
            <Ionicons name="arrow-forward" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && renderFilters()}

      {/* Results */}
      <View style={styles.resultsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching for spaces...</Text>
          </View>
        ) : spaces.length > 0 ? (
          <>
            <Text style={styles.resultsCount}>
              {spaces.length} space{spaces.length !== 1 ? 's' : ''} found
            </Text>
            <FlatList
              data={spaces}
              renderItem={renderSpaceCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.spacesList}
            />
          </>
        ) : searchQuery ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No spaces found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search criteria or location
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>Search for parking spaces</Text>
            <Text style={styles.emptyStateSubtext}>
              Enter a location to find available parking
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterRow: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  priceRangeText: {
    marginHorizontal: 12,
    color: '#666',
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearFiltersText: {
    color: '#007AFF',
    fontSize: 14,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  resultsCount: {
    fontSize: 16,
    color: '#666',
    marginVertical: 16,
  },
  spacesList: {
    paddingBottom: 20,
  },
  spaceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spaceImage: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  spaceLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  spaceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spaceType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceTypeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  spacePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  amenityTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 12,
    color: '#007AFF',
  },
  moreAmenities: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchScreen;
