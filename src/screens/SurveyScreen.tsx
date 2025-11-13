import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Voter} from '../types';
import {voterService} from '../services/api';
import VoterCard from '../components/VoterCard';
import SearchBar from '../components/SearchBar';
import PaginationControls from '../components/PaginationControls';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import NavigationHeader from '../components/NavigationHeader';
import {COLORS, SPACING} from '../constants/theme';

type SurveyScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Survey'
>;

interface Props {
  navigation: SurveyScreenNavigationProp;
}

const SurveyScreen: React.FC<Props> = ({navigation}) => {
  console.log('📝 SurveyScreen rendered');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    console.log('📝 SurveyScreen useEffect triggered, page:', currentPage);
    fetchVoters(currentPage);
  }, [currentPage]);

  const fetchVoters = async (page: number) => {
    console.log('📝 fetchVoters started, page:', page);
    try {
      setLoading(true);
      const response = await voterService.getVoters(page);
      console.log('📝 fetchVoters response:', response);
      setVoters(response.voters);
      setTotalPages(Number(response.totalPages));
      setCurrentPage(Number(response.currentPage));
      setIsSearchMode(false);
    } catch (error) {
      console.error('📝 fetchVoters error:', error);
      Alert.alert('Error', 'Failed to fetch voters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (page: number = 1) => {
    if (!searchQuery.trim()) {
      fetchVoters(1);
      return;
    }

    try {
      setLoading(true);
      const response = await voterService.searchVotersByName(searchQuery, page);
      setVoters(response.voters);
      setTotalPages(Number(response.totalPages));
      setCurrentPage(Number(response.currentPage));
      setIsSearchMode(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to search voters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (isSearchMode) {
      handleSearch(page);
    } else {
      setCurrentPage(page);
    }
  };

  const handleVoterPress = (voter: Voter) => {
    navigation.navigate('VoterDetails', {voter, isEditable: true});
  };

  if (loading && voters.length === 0) {
    return <LoadingSpinner message="Loading voters..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <NavigationHeader />
        
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={() => handleSearch()}
            placeholder="Search by name..."
          />
        </View>

        {voters.length === 0 ? (
          <EmptyState message="No voters found" icon="👥" />
        ) : (
          <>
            <FlatList
              data={voters}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <VoterCard
                  voter={item}
                  onPress={() => handleVoterPress(item)}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
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
  searchContainer: {
    padding: SPACING.md,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
  },
});

export default SurveyScreen;
