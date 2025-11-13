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
      <View style={styles.container}>
        <BackButton />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Voter Details</Text>

            {detailFields.map((field, index) => (
              field.value ? (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>{field.value}</Text>
                </View>
              ) : null
            ))}

            {isEditable && (
              <View style={styles.mobileSection}>
                <Text style={styles.sectionTitle}>Mobile Number</Text>
                
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
                    <View style={styles.fieldContainer}>
                      <Text style={styles.fieldValue}>
                        {voter.mobileNumber || 'Not provided'}
                      </Text>
                    </View>
                    <Button
                      title="Edit Mobile Number"
                      onPress={() => setIsEditing(true)}
                      variant="outline"
                    />
                  </>
                )}

                {voter.mobileNumber && !isEditing && (
                  <Button
                    title="Send WhatsApp Message"
                    onPress={handleWhatsApp}
                    style={styles.whatsappButton}
                  />
                )}
              </View>
            )}

            {!isEditable && voter.mobileNumber && (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <Text style={styles.fieldValue}>{voter.mobileNumber}</Text>
              </View>
            )}
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
  fieldContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  fieldValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  mobileSection: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight + '20',
    borderRadius: BORDER_RADIUS.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
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
