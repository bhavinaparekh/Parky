import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ParkingSpace } from '../../types';
import { spaceService } from '../../services/spaceService';

type SpaceDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SpaceDetails'>;
type SpaceDetailsScreenRouteProp = RouteProp<RootStackParamList, 'SpaceDetails'>;

const SpaceDetailsScreen: React.FC = () => {
  const navigation = useNavigation<SpaceDetailsScreenNavigationProp>();
  const route = useRoute<SpaceDetailsScreenRouteProp>();
  const { spaceId } = route.params;
  const [space, setSpace] = useState<ParkingSpace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpaceDetails();
  }, [spaceId]);

  const loadSpaceDetails = async () => {
    try {
      setLoading(true);
      const response = await spaceService.getSpaceById(spaceId);
      if (response.success && response.data) {
        setSpace(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load space details');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while loading space details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Navigate to booking flow
    Alert.alert('Book Now', 'Booking functionality will be implemented');
  };

  const handleContactHost = () => {
    Alert.alert('Contact Host', 'Messaging functionality will be implemented');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading space details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!space) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Space not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <View style={styles.placeholderImage}>
            <Ionicons name="car-outline" size={60} color="#666" />
          </View>
        </View>

        {/* Space Info */}
        <View style={styles.content}>
          <Text style={styles.title}>{space.title}</Text>
          <Text style={styles.location}>{space.address}</Text>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${space.hourlyRate}/hour</Text>
            <Text style={styles.priceLabel}>Starting from</Text>
          </View>

          {/* Space Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Space Type</Text>
            <View style={styles.spaceTypeContainer}>
              <Ionicons name="car-outline" size={20} color="#007AFF" />
              <Text style={styles.spaceTypeText}>
                {space.spaceType.charAt(0).toUpperCase() + space.spaceType.slice(1)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{space.description}</Text>
          </View>

          {/* Amenities */}
          {space.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesContainer}>
                {space.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={styles.amenityText}>
                      {amenity.replace('_', ' ').charAt(0).toUpperCase() + amenity.replace('_', ' ').slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Vehicle Restrictions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Restrictions</Text>
            <View style={styles.restrictionsContainer}>
              {space.vehicleTypes.map((type, index) => (
                <View key={index} style={styles.restrictionTag}>
                  <Text style={styles.restrictionText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          {space.instructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.instructions}>{space.instructions}</Text>
            </View>
          )}

          {/* Booking Options */}
          <View style={styles.bookingContainer}>
            <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactButton} onPress={handleContactHost}>
              <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
              <Text style={styles.contactButtonText}>Contact Host</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#f8f9fa',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  spaceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceTypeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  restrictionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  restrictionTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  restrictionText: {
    fontSize: 14,
    color: '#007AFF',
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bookingContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 40,
  },
  bookButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 20,
  },
  contactButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default SpaceDetailsScreen;
