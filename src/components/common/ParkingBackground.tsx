import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

interface ParkingBackgroundProps {
  children: React.ReactNode;
  variant?: 'home' | 'auth';
}

const ParkingBackground: React.FC<ParkingBackgroundProps> = ({ 
  children, 
  variant = 'home' 
}) => {
  const getGradientColors = () => {
    if (variant === 'auth') {
      return [theme.colors.primary, theme.colors.primaryLight, theme.colors.background];
    }
    return [theme.colors.background, theme.colors.surfaceSecondary, theme.colors.background];
  };

  const getParkingIcons = () => {
    const icons = [];
    for (let i = 0; i < 8; i++) {
      icons.push(
        <View key={i} style={[styles.parkingIcon, { 
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          opacity: 0.1 + Math.random() * 0.1
        }]}>
          <Ionicons 
            name="car-outline" 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
      );
    }
    return icons;
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Parking-themed decorative elements */}
      <View style={styles.decorativeContainer}>
        {getParkingIcons()}
        
        {/* Parking lines pattern */}
        <View style={styles.parkingLines}>
          {[...Array(6)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.parkingLine, 
                { 
                  top: 20 + i * 15 + '%',
                  opacity: 0.05 + Math.random() * 0.05
                }
              ]} 
            />
          ))}
        </View>
      </View>
      
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  decorativeContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  parkingIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  parkingLines: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  parkingLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.primary,
    opacity: 0.1,
  },
});

export default ParkingBackground;
