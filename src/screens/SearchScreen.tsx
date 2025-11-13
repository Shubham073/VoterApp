import React, {useState} from 'react';
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
import BackButton from '../components/BackButton';
import {COLORS, SPACING} from '../constants/theme';

type SearchScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Search'
>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

const SearchScreen: React.FC<Props> = ({navigation}) => {
  console.log('🔍 SearchScreen rendered');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (page: number = 1) => {
    console.log('🔍 handleSearch called:', {searchQuery, page});
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const response = await voterService.searchVotersByName(searchQuery, page);
      console.log('🔍 Search response:', response);
      setVoters(response.voters);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setSearched(true);
    } catch (error) {
      console.error('🔍 Search error:', error);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackButton />
        
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={() => handleSearch()}
            placeholder="Search by name..."
          />
        </View>

        {loading ? (
          <LoadingSpinner message="Searching..." />
        ) : searched && voters.length === 0 ? (
          <EmptyState message="No voters found" icon="🔍" />
        ) : voters.length > 0 ? (
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
        ) : (
          <EmptyState message="Enter a name to search" icon="🔍" />
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

export default SearchScreen;
