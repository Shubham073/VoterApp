import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SPACING, FONT_SIZES} from '../constants/theme';

const BackButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7}>
      <Text style={styles.icon}>←</Text>
      <Text style={styles.text}>Back</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  icon: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default BackButton;
