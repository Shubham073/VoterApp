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
      console.log('🚀 Starting export process...');
      
      // Fetch all voters
      const voters = await voterService.getAllVoters();
      console.log(`📊 Fetched ${voters.length} voters`);
      
      if (voters.length === 0) {
        Alert.alert('No Data', 'There are no voters to export');
        return;
      }

      // Convert to CSV
      const csvData = convertToCSV(voters);
      console.log('✅ CSV data created, length:', csvData.length);
      
      // Create file path - use DownloadDirectoryPath for better Android compatibility
      const fileName = `voters_${new Date().getTime()}.csv`;
      const filePath = Platform.OS === 'android' 
        ? `${RNFS.DownloadDirectoryPath}/${fileName}`
        : `${RNFS.DocumentDirectoryPath}/${fileName}`;
      
      console.log('📝 Writing to file:', filePath);
      
      // Write file
      await RNFS.writeFile(filePath, csvData, 'utf8');
      
      console.log('📁 CSV file created successfully');
      
      // Verify file exists
      const fileExists = await RNFS.exists(filePath);
      console.log('🔍 File exists:', fileExists);
      
      if (!fileExists) {
        throw new Error('File was not created successfully');
      }

      // Share file - try different approaches for Android
      try {
        const shareOptions = {
          title: 'Export Voter Data',
          subject: 'Voter Data Export',
          url: `file://${filePath}`,
          type: 'text/csv',
          failOnCancel: false,
        };

        console.log('📤 Attempting to share with options:', shareOptions);
        
        await Share.open(shareOptions);
        
        Alert.alert(
          'Success',
          `Exported ${voters.length} voters successfully!\n\nFile saved at:\n${fileName}`,
        );
      } catch (shareError: any) {
        console.log('⚠️ Share error:', shareError);
        // If sharing fails, at least inform user file was created
        if (!shareError.message?.includes('User did not share')) {
          Alert.alert(
            'File Created',
            `CSV file created successfully with ${voters.length} voters.\n\nFile location:\n${filePath}\n\nYou can find it in your app's documents folder.`,
          );
        }
      }
    } catch (error: any) {
      console.error('❌ Export error:', error);
      Alert.alert('Error', `Failed to export data: ${error.message || 'Unknown error'}`);
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
