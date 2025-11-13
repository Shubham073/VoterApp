import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Voter} from '../types';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';

interface VoterCardProps {
  voter: Voter;
  onPress: () => void;
  style?: ViewStyle;
}

const VoterCard: React.FC<VoterCardProps> = ({voter, onPress, style}) => {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {voter.Name || 'N/A'}
        </Text>
        {voter.mobileNumber && (
          <View style={styles.mobileBadge}>
            <Text style={styles.mobileBadgeText}>📱</Text>
          </View>
        )}
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>EPIC No:</Text>
        <Text style={styles.value}>{voter['EPIC No'] || 'N/A'}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Age/Gender:</Text>
        <Text style={styles.value}>
          {voter.Age || 'N/A'} / {voter.Gender || 'N/A'}
        </Text>
      </View>
      
      {voter['House No'] && (
        <View style={styles.row}>
          <Text style={styles.label}>House No:</Text>
          <Text style={styles.value}>{voter['House No']}</Text>
        </View>
      )}
      
      {voter['Part No'] && (
        <View style={styles.row}>
          <Text style={styles.label}>Part No:</Text>
          <Text style={styles.value}>{voter['Part No']}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  mobileBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.round,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileBadgeText: {
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    width: 100,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    flex: 1,
    fontWeight: '500',
  },
});

export default VoterCard;
