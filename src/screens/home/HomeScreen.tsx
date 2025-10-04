import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, User, ParkingSpace } from '../../types';
import { authService } from '../../services/authService';
import { spaceService } from '../../services/spaceService';
import { theme } from '../../utils/theme';
import ParkingBackground from '../../components/common/ParkingBackground';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbySpaces, setNearbySpaces] = useState<ParkingSpace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadNearbySpaces();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadNearbySpaces = async () => {
    try {
      setLoading(true);
      const response = await spaceService.getNearbySpaces();
      if (response.success && response.data) {
        setNearbySpaces(response.data);
      }
    } catch (error) {
      console.error('Error loading nearby spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Search' as any, { query: searchQuery });
    }
  };

  const handleSpacePress = (spaceId: string) => {
    navigation.navigate('SpaceDetails', { spaceId });
  };

  const handleAddSpace = () => {
    navigation.navigate('AddSpace');
  };

  const handleMySpaces = () => {
    navigation.navigate('MySpaces');
  };

  const handleMyBookings = () => {
    navigation.navigate('MyBookings');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ParkingBackground variant="home">
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>
                {user ? `${user.firstName} ${user.lastName}` : 'Welcome'}
              </Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for parking spaces..."
                placeholderTextColor={theme.colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity onPress={handleSearch}>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={handleMyBookings}>
                <View style={styles.actionIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.actionText}>My Bookings</Text>
              </TouchableOpacity>

              {user?.userType === 'host' || user?.userType === 'both' ? (
                <>
                  <TouchableOpacity style={styles.actionButton} onPress={handleMySpaces}>
                    <View style={styles.actionIconContainer}>
                      <Ionicons name="car-outline" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.actionText}>My Spaces</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={handleAddSpace}>
                    <View style={styles.actionIconContainer}>
                      <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.actionText}>Add Space</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.actionButton} onPress={handleAddSpace}>
                  <View style={styles.actionIconContainer}>
                    <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.actionText}>List Space</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

        {/* Nearby Spaces */}
        <View style={styles.nearbySpaces}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Spaces</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading nearby spaces...</Text>
            </View>
          ) : nearbySpaces.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {nearbySpaces.map((space) => (
                <TouchableOpacity
                  key={space.id}
                  style={styles.spaceCard}
                  onPress={() => handleSpacePress(space.id)}
                >
                  <View style={styles.spaceImage}>
                    <Ionicons name="car-outline" size={40} color="#666" />
                  </View>
                  <View style={styles.spaceInfo}>
                    <Text style={styles.spaceTitle} numberOfLines={1}>
                      {space.title}
                    </Text>
                    <Text style={styles.spaceLocation} numberOfLines={1}>
                      {space.address}
                    </Text>
                    <Text style={styles.spacePrice}>
                      ${space.hourlyRate}/hour
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No nearby spaces found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try searching in a different area
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        {user && (user.userType === 'host' || user.userType === 'both') && (
          <View style={styles.stats}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Active Listings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Total Bookings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>$0</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
            </View>
          </View>
          )}
        </ScrollView>
      </ParkingBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  greeting: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  profileButton: {
    padding: theme.spacing.xs,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    borderRadius: theme.borderRadius.full,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 56,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  quickActions: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(30, 58, 138, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  nearbySpaces: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    ...theme.typography.body,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  spaceCard: {
    width: 220,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginRight: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  spaceImage: {
    height: 100,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  spaceLocation: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  spacePrice: {
    ...theme.typography.body,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  stats: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statNumber: {
    ...theme.typography.h3,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
