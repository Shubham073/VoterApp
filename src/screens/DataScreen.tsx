import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {voterService} from '../services/api';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

type DataScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Data'
>;

interface Props {
  navigation: DataScreenNavigationProp;
}

const DataScreen: React.FC<Props> = ({navigation}) => {
  const [isExporting, setIsExporting] = useState(false);

  const convertToCSV = (data: any[]): string => {
    if (data.length === 0) return '';

    // Get all possible keys from all objects
    const allKeys = new Set<string>();
    data.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });

    const headers = Array.from(allKeys);
    
    // Create CSV header
    const csvHeader = headers.join(',');
    
    // Create CSV rows
    const csvRows = data.map(item => {
      return headers.map(header => {
        const value = item[header] || '';
        // Escape commas and quotes in values
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',');
    });

    return [csvHeader, ...csvRows].join('\n');
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      // Fetch all voters
      const voters = await voterService.getAllVoters();
      
      if (voters.length === 0) {
        Alert.alert('No Data', 'There are no voters to export');
        return;
      }

      // Convert to CSV
      const csvData = convertToCSV(voters);
      
      // Create file path
      const fileName = `voters_${new Date().getTime()}.csv`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      // Write file
      await RNFS.writeFile(filePath, csvData, 'utf8');
      
      // Share file
      await Share.open({
        title: 'Export Voter Data',
        message: 'Voter data CSV file',
        url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
        type: 'text/csv',
        subject: 'Voter Data Export',
      });

      Alert.alert(
        'Success',
        `Exported ${voters.length} voters successfully`,
      );
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to export data');
        console.error(error);
      }
    } finally {
      setIsExporting(false);
    }
  };

  if (isExporting) {
    return <LoadingSpinner message="Exporting data..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackButton />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.title}>Export Data</Text>
            <Text style={styles.subtitle}>
              Download all voter data as CSV file
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>What will be exported?</Text>
            <Text style={styles.infoText}>
              • All voter information{'\n'}
              • Assembly constituency details{'\n'}
              • Polling station information{'\n'}
              • Personal details (name, age, gender){'\n'}
              • Contact information (if available)
            </Text>
          </View>

          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              ⚠️ This may take a few moments for large datasets
            </Text>
          </View>

          <Button
            title="Export to CSV"
            onPress={handleExportData}
            style={styles.exportButton}
          />
        </View>
      </View>
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
    paddingTop: SPACING.lg,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: SPACING.md,
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
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  warningCard: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  warningText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  exportButton: {
    marginTop: 'auto',
  },
});

export default DataScreen;
