import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {COLORS, SPACING, BORDER_RADIUS, SHADOWS} from '../constants/theme';

interface Props {
  onPress: () => void;
}

const MenuButton: React.FC<Props> = ({onPress}) => {
  return (
    <TouchableOpacity 
      style={styles.menuButton} 
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...SHADOWS.medium,
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
});

export default MenuButton;
