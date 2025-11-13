import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList, Voter} from '../types';
import {voterService} from '../services/api';
import VoterCard from '../components/VoterCard';
import Button from '../components/Button';
import PaginationControls from '../components/PaginationControls';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import BackButton from '../components/BackButton';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';

type PublishScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Publish'
>;

interface Props {
  navigation: PublishScreenNavigationProp;
}

const PublishScreen: React.FC<Props> = ({navigation}) => {
  console.log('📢 PublishScreen rendered');
  
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('📢 PublishScreen useEffect triggered, page:', currentPage);
    fetchVotersWithMobile(currentPage);
  }, [currentPage]);

  const fetchVotersWithMobile = async (page: number) => {
    console.log('📢 fetchVotersWithMobile started, page:', page);
    try {
      setLoading(true);
      const response = await voterService.getVotersWithMobile(page);
      console.log('📢 fetchVotersWithMobile response:', response);
      setVoters(response.voters);
      setTotalPages(Number(response.totalPages));
      setCurrentPage(Number(response.currentPage));
    } catch (error) {
      console.error('📢 fetchVotersWithMobile error:', error);
      Alert.alert('Error', 'Failed to fetch voters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulkMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (voters.length === 0) {
      Alert.alert('Error', 'No voters with mobile numbers found');
      return;
    }

    Alert.alert(
      'Confirm Bulk Send',
      `This will open WhatsApp for ${voters.length} voters. You'll need to send each message individually. Continue?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Continue',
          onPress: async () => {
            // For bulk messaging, we'll just open WhatsApp with the first voter
            // In a real app, you'd need WhatsApp Business API for true bulk messaging
            if (voters.length > 0 && voters[0].mobileNumber) {
              const phoneNumber = voters[0].mobileNumber.replace(/\s/g, '');
              const whatsappNumber = phoneNumber.startsWith('+') 
                ? phoneNumber 
                : `+91${phoneNumber}`;
              
              const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
              
              try {
                const canOpen = await Linking.canOpenURL(url);
                if (canOpen) {
                  await Linking.openURL(url);
                  Alert.alert(
                    'Info',
                    'WhatsApp opened with your message. For bulk messaging, you would need WhatsApp Business API integration.',
                  );
                } else {
                  Alert.alert('Error', 'WhatsApp is not installed');
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to open WhatsApp');
              }
            }
          },
        },
      ],
    );
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
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Publish Messages</Text>

            <View style={styles.messageSection}>
              <Text style={styles.sectionTitle}>📢 Bulk Message</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Message</Text>
                <TextInput
                  style={styles.messageInput}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Type your message here..."
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>
                  💡 Tip: You can attach images and videos directly in WhatsApp. For true bulk messaging, WhatsApp Business API integration is required.
                </Text>
              </View>

              <Button
                title={`Send to ${voters.length} Voters`}
                onPress={handleSendBulkMessage}
                disabled={!message.trim()}
                style={styles.sendButton}
              />
            </View>

            <View style={styles.votersSection}>
              <Text style={styles.sectionTitle}>
                👥 Voters with Mobile Numbers ({voters.length})
              </Text>
              
              {voters.length === 0 ? (
                <EmptyState 
                  message="No voters with mobile numbers found" 
                  icon="📱" 
                />
              ) : (
                <>
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
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </View>
          </View>
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
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  messageSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  messageInput: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaContainer: {
    marginBottom: SPACING.md,
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaInfo: {
    flex: 1,
  },
  mediaName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  mediaSize: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: '#25D366',
    marginBottom: SPACING.md,
  },
  noteContainer: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
  },
  noteText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    lineHeight: 18,
  },
  votersSection: {
    marginTop: SPACING.md,
  },
});

export default PublishScreen;
