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
import PaginationControls from '../components/PaginationControls';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BackButton from '../components/BackButton';
import {COLORS, SPACING} from '../constants/theme';

type VoterListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VoterList'
>;

interface Props {
  navigation: VoterListScreenNavigationProp;
}

const VoterListScreen: React.FC<Props> = ({navigation}) => {
  console.log('📋 VoterListScreen rendered');
  
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    console.log('📋 VoterListScreen useEffect triggered, page:', currentPage);
    fetchVoters(currentPage);
  }, [currentPage]);

  const fetchVoters = async (page: number) => {
    console.log('📋 fetchVoters started, page:', page);
    try {
      setLoading(true);
      const response = await voterService.getVoters(page);
      console.log('📋 fetchVoters success:', response);
      setVoters(response.voters);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('📋 fetchVoters error:', error);
      Alert.alert('Error', 'Failed to fetch voters');
      console.error(error);
    } finally {
      setLoading(false);
      console.log('📋 fetchVoters completed');
    }
  };

  const handleVoterPress = (voter: Voter) => {
    navigation.navigate('VoterDetails', {voter, isEditable: false});
  };

  if (loading && voters.length === 0) {
    return <LoadingSpinner message="Loading voters..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackButton />
        
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
              onPageChange={setCurrentPage}
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
  listContent: {
    padding: SPACING.md,
  },
});

export default VoterListScreen;
