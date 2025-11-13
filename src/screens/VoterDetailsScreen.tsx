import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList, Voter} from '../types';
import {voterService} from '../services/api';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';

type VoterDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VoterDetails'
>;

type VoterDetailsScreenRouteProp = RouteProp<RootStackParamList, 'VoterDetails'>;

interface Props {
  navigation: VoterDetailsScreenNavigationProp;
  route: VoterDetailsScreenRouteProp;
}

const VoterDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const {voter: initialVoter, isEditable = false} = route.params;
  const [voter, setVoter] = useState(initialVoter);
  const [mobileNumber, setMobileNumber] = useState(voter.mobileNumber || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveMobile = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter a mobile number');
      return;
    }

    if (!/^[0-9]{10}$/.test(mobileNumber.trim())) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setIsSaving(true);
      await voterService.updateVoterMobile(voter._id, mobileNumber);
      setVoter({...voter, mobileNumber});
      setIsEditing(false);
      Alert.alert('Success', 'Mobile number updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update mobile number');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWhatsApp = () => {
    if (!voter.mobileNumber) {
      Alert.alert('Error', 'No mobile number available');
      return;
    }
    navigation.navigate('WhatsAppMessage', {voter});
  };

  const detailFields = [
    {label: 'Name', value: voter.Name},
    {label: 'EPIC No', value: voter['EPIC No']},
    {label: 'Age', value: voter.Age},
    {label: 'Gender', value: voter.Gender},
    {label: 'House No', value: voter['House No']},
    {label: 'Relation Type', value: voter['Relation Type']},
    {label: 'Relation Name', value: voter['Relation Name']},
    {label: 'Part No', value: voter['Part No']},
    {label: 'Section Name', value: voter['Section Name']},
    {label: 'Serial No', value: voter['Serial No']},
    {label: 'Assembly Constituency No', value: voter['Assembly Constituency No']},
    {label: 'Assembly Constituency Name', value: voter['Assembly Constituency Name']},
    {label: 'Reservation Status', value: voter['Reservation Status']},
    {label: 'Polling Station No', value: voter['Polling Station No']},
    {label: 'Polling Station Name', value: voter['Polling Station Name']},
    {label: 'Polling Station Address', value: voter['Polling Station Address']},
    {label: 'Photo Available', value: voter['Photo Available']},
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <BackButton />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Voter Details</Text>

            {/* Single Beautiful Card */}
            <View style={styles.card}>
              {/* Header Section - Name and EPIC */}
              <View style={styles.headerSection}>
                <Text style={styles.voterName}>{voter.Name}</Text>
                <View style={styles.epicBadge}>
                  <Text style={styles.epicLabel}>EPIC</Text>
                  <Text style={styles.epicValue}>{voter['EPIC No']}</Text>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Personal Information Section */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>👤 Personal Information</Text>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Age</Text>
                    <Text style={styles.infoValue}>{voter.Age}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{voter.Gender}</Text>
                  </View>
                </View>
                {voter['Relation Type'] && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoItemFull}>
                      <Text style={styles.infoLabel}>{voter['Relation Type']}</Text>
                      <Text style={styles.infoValue}>{voter['Relation Name']}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Address Section */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>🏠 Address</Text>
                <View style={styles.infoRow}>
                  <View style={styles.infoItemFull}>
                    <Text style={styles.infoLabel}>House No</Text>
                    <Text style={styles.infoValue}>{voter['House No']}</Text>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Electoral Information Section */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>🗳️ Electoral Information</Text>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Part No</Text>
                    <Text style={styles.infoValue}>{voter['Part No']}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Serial No</Text>
                    <Text style={styles.infoValue}>{voter['Serial No']}</Text>
                  </View>
                </View>
                {voter['Section Name'] && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoItemFull}>
                      <Text style={styles.infoLabel}>Section</Text>
                      <Text style={styles.infoValue}>{voter['Section Name']}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Constituency Section */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>📍 Constituency</Text>
                <View style={styles.infoRow}>
                  <View style={styles.infoItemFull}>
                    <Text style={styles.infoLabel}>Assembly Constituency</Text>
                    <Text style={styles.infoValue}>
                      {voter['Assembly Constituency Name']} ({voter['Assembly Constituency No']})
                    </Text>
                  </View>
                </View>
                {voter['Reservation Status'] && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoItemFull}>
                      <Text style={styles.infoLabel}>Reservation Status</Text>
                      <Text style={styles.infoValue}>{voter['Reservation Status']}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Polling Station Section */}
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>🏢 Polling Station</Text>
                <View style={styles.infoRow}>
                  <View style={styles.infoItemFull}>
                    <Text style={styles.infoLabel}>Station Name</Text>
                    <Text style={styles.infoValue}>
                      {voter['Polling Station Name']} ({voter['Polling Station No']})
                    </Text>
                  </View>
                </View>
                {voter['Polling Station Address'] && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoItemFull}>
                      <Text style={styles.infoLabel}>Address</Text>
                      <Text style={styles.infoValue}>{voter['Polling Station Address']}</Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Photo Available Badge */}
              {voter['Photo Available'] && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.photoBadge}>
                    <Text style={styles.photoBadgeText}>📷 Photo Available</Text>
                  </View>
                </>
              )}
            </View>

            {/* Mobile Number Section - Outside the main card */}
            {isEditable && (
              <View style={styles.mobileSection}>
                <Text style={styles.mobileSectionTitle}>📱 Mobile Number</Text>
                
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.input}
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      placeholder="Enter 10-digit mobile number"
                      placeholderTextColor={COLORS.textSecondary}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                    <View style={styles.buttonRow}>
                      <Button
                        title="Save"
                        onPress={handleSaveMobile}
                        disabled={isSaving}
                        style={styles.saveButton}
                      />
                      <Button
                        title="Cancel"
                        onPress={() => {
                          setIsEditing(false);
                          setMobileNumber(voter.mobileNumber || '');
                        }}
                        variant="outline"
                        style={styles.cancelButton}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.mobileDisplay}>
                      <Text style={styles.mobileNumber}>
                        {voter.mobileNumber || 'Not provided'}
                      </Text>
                    </View>
                    <Button
                      title="Edit Mobile Number"
                      onPress={() => setIsEditing(true)}
                      variant="outline"
                    />
                    {voter.mobileNumber && (
                      <Button
                        title="Send WhatsApp Message"
                        onPress={handleWhatsApp}
                        style={styles.whatsappButton}
                      />
                    )}
                  </>
                )}
              </View>
            )}

            {!isEditable && voter.mobileNumber && (
              <View style={styles.mobileSection}>
                <Text style={styles.mobileSectionTitle}>📱 Mobile Number</Text>
                <View style={styles.mobileDisplay}>
                  <Text style={styles.mobileNumber}>{voter.mobileNumber}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  // Main Card Styles
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  // Header Section
  headerSection: {
    marginBottom: SPACING.md,
  },
  voterName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  epicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  epicLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  epicValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  // Section Styles
  section: {
    marginVertical: SPACING.xs,
  },
  sectionHeader: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  // Info Row & Items
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  infoItem: {
    flex: 1,
  },
  infoItemFull: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  // Photo Badge
  photoBadge: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
  },
  photoBadgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
  },
  // Mobile Section
  mobileSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
  },
  mobileSectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  mobileDisplay: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  mobileNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  whatsappButton: {
    marginTop: SPACING.md,
    backgroundColor: '#25D366',
  },
});

export default VoterDetailsScreen;
