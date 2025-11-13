import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Voter, FilterParams} from '../types';
import {voterService} from '../services/api';
import VoterCard from '../components/VoterCard';
import Button from '../components/Button';
import PaginationControls from '../components/PaginationControls';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BackButton from '../components/BackButton';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';

type AdvanceSearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AdvanceSearch'
>;

interface Props {
  navigation: AdvanceSearchScreenNavigationProp;
}

const AdvanceSearchScreen: React.FC<Props> = ({navigation}) => {
  const [filters, setFilters] = useState<FilterParams>({});
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  const filterFields = [
    {key: 'Name', label: 'Name', placeholder: 'Enter name'},
    {key: 'EPIC No', label: 'EPIC No', placeholder: 'Enter EPIC number'},
    {key: 'Age', label: 'Age', placeholder: 'Enter age'},
    {key: 'Gender', label: 'Gender', placeholder: 'Male/Female/Other'},
    {key: 'House No', label: 'House No', placeholder: 'Enter house number'},
    {key: 'Part No', label: 'Part No', placeholder: 'Enter part number'},
    {key: 'Assembly Constituency Name', label: 'Constituency', placeholder: 'Enter constituency'},
    {key: 'Polling Station Name', label: 'Polling Station', placeholder: 'Enter polling station'},
  ];

  const handleSearch = async (page: number = 1) => {
    const hasFilters = Object.values(filters).some(val => val && val.trim());
    
    if (!hasFilters) {
      Alert.alert('Error', 'Please enter at least one search criteria');
      return;
    }

    try {
      setLoading(true);
      const searchParams = {...filters, page, limit: 10};
      const response = await voterService.filterVoters(searchParams);
      setVoters(response.voters);
      setTotalPages(Number(response.totalPages));
      setCurrentPage(Number(response.currentPage));
      setSearched(true);
      setIsFilterExpanded(false); // Collapse after first search
    } catch (error) {
      Alert.alert('Error', 'Failed to search voters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(page);
  };

  const handleVoterPress = (voter: Voter) => {
    navigation.navigate('VoterDetails', {voter, isEditable: false});
  };

  const handleClear = () => {
    setFilters({});
    setVoters([]);
    setSearched(false);
    setCurrentPage(1);
    setIsFilterExpanded(true); // Expand when cleared
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackButton />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <TouchableOpacity 
              style={styles.filterHeader}
              onPress={() => setIsFilterExpanded(!isFilterExpanded)}
              activeOpacity={0.7}>
              <Text style={styles.title}>Advanced Search</Text>
              <Text style={styles.expandIcon}>
                {isFilterExpanded ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            {isFilterExpanded && (
              <>
                {filterFields.map(field => (
                  <View key={field.key} style={styles.inputContainer}>
                    <Text style={styles.label}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      value={filters[field.key as keyof FilterParams] as string || ''}
                      onChangeText={text =>
                        setFilters({...filters, [field.key]: text})
                      }
                      placeholder={field.placeholder}
                      placeholderTextColor={COLORS.textSecondary}
                    />
                  </View>
                ))}

                <View style={styles.buttonRow}>
                  <Button
                    title="Search"
                    onPress={() => handleSearch()}
                    style={styles.searchButton}
                  />
                  <Button
                    title="Clear"
                    onPress={handleClear}
                    variant="outline"
                    style={styles.clearButton}
                  />
                </View>
              </>
            )}
          </View>

          {loading ? (
            <LoadingSpinner message="Searching..." />
          ) : searched && voters.length === 0 ? (
            <EmptyState message="No voters found" icon="🔍" />
          ) : voters.length > 0 ? (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>
                Search Results ({voters.length})
              </Text>
              
              {voters.map(voter => (
                <VoterCard
                  key={voter._id}
                  voter={voter}
                  onPress={() => handleVoterPress(voter)}
                />
              ))}
              
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </View>
          ) : null}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  filterSection: {
    padding: SPACING.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  expandIcon: {
    fontSize: 18,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    ...SHADOWS.small,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  searchButton: {
    flex: 1,
  },
  clearButton: {
    flex: 1,
  },
  resultsSection: {
    padding: SPACING.md,
  },
  resultsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
});

export default AdvanceSearchScreen;
