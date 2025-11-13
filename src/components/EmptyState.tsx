import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, SPACING, FONT_SIZES} from '../constants/theme';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon = '📭',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
