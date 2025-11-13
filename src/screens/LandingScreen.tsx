import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';

type LandingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Landing'
>;

interface Props {
  navigation: LandingScreenNavigationProp;
}

interface OptionCard {
  title: string;
  icon: string;
  screen: keyof RootStackParamList;
  description: string;
}

const options: OptionCard[] = [
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

const LandingScreen: React.FC<Props> = ({navigation}) => {
  console.log('🏠 LandingScreen rendered');
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ECM Political Campaign</Text>
          <Text style={styles.subtitle}>Select an option to continue</Text>
        </View>

        <View style={styles.grid}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(option.screen as any)}
              activeOpacity={0.7}>
              <Text style={styles.icon}>{option.icon}</Text>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingTop: SPACING.md,
  },
  header: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default LandingScreen;
