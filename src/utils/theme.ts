export const theme = {
  colors: {
    // Primary colors - Professional blue palette
    primary: '#1E3A8A', // Deep blue
    primaryLight: '#3B82F6', // Lighter blue
    primaryDark: '#1E40AF', // Darker blue
    
    // Secondary colors - Neutral grays
    secondary: '#6B7280', // Medium gray
    secondaryLight: '#9CA3AF', // Light gray
    secondaryDark: '#374151', // Dark gray
    
    // Background colors
    background: '#F8FAFC', // Very light gray
    surface: '#FFFFFF', // White
    surfaceSecondary: '#F1F5F9', // Light gray
    
    // Text colors
    textPrimary: '#1F2937', // Dark gray
    textSecondary: '#6B7280', // Medium gray
    textLight: '#9CA3AF', // Light gray
    textWhite: '#FFFFFF',
    
    // Status colors
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    info: '#3B82F6', // Blue
    
    // Border colors
    border: '#E5E7EB', // Light gray
    borderLight: '#F3F4F6', // Very light gray
    
    // Shadow colors
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

export type Theme = typeof theme;
