import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';

const {width} = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface MenuItem {
  title: string;
  icon: string;
  screen: keyof RootStackParamList;
  description: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Voter List',
    icon: '📋',
    screen: 'VoterList',
    description: 'View all registered voters',
  },
  {
    title: 'Search',
    icon: '🔍',
    screen: 'Search',
    description: 'Find voters by name',
  },
  {
    title: 'Advance Search',
    icon: '🔎',
    screen: 'AdvanceSearch',
    description: 'Search with multiple filters',
  },
  {
    title: 'Survey',
    icon: '📝',
    screen: 'Survey',
    description: 'Update voter information',
  },
  {
    title: 'Data',
    icon: '📊',
    screen: 'Data',
    description: 'Export voter data',
  },
  {
    title: 'Publish',
    icon: '📢',
    screen: 'Publish',
    description: 'Send bulk messages',
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<Props> = ({visible, onClose}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigate = (screen: keyof RootStackParamList) => {
    onClose();
    navigation.navigate(screen as any);
  };

  const handleHome = () => {
    onClose();
    navigation.navigate('Landing');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Home Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleHome}
            activeOpacity={0.7}>
            <Text style={styles.homeIcon}>🏠</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.homeTitle}>Home</Text>
              <Text style={styles.homeDescription}>Back to main page</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Menu Items */}
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.screen)}
                activeOpacity={0.7}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>ECM Political Campaign</Text>
            <Text style={styles.footerVersion}>v1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: COLORS.cardBackground,
    paddingTop: SPACING.md,
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + '15',
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  homeIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  homeTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  homeDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '30',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
    width: 32,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
});

export default Sidebar;
