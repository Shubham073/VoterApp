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
import {RootStackParamList} from '../types';
import Button from '../components/Button';
import BackButton from '../components/BackButton';
import {COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS} from '../constants/theme';
type WhatsAppMessageScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WhatsAppMessage'
>;

type WhatsAppMessageScreenRouteProp = RouteProp<
  RootStackParamList,
  'WhatsAppMessage'
>;

interface Props {
  navigation: WhatsAppMessageScreenNavigationProp;
  route: WhatsAppMessageScreenRouteProp;
}

const WhatsAppMessageScreen: React.FC<Props> = ({navigation, route}) => {
  const {voter} = route.params;
  const [message, setMessage] = useState('');
  const [mediaAttached, setMediaAttached] = useState(false);

  const handlePickMedia = () => {
    // Media picker functionality - simplified for compatibility
    Alert.alert(
      'Media Attachment',
      'Media can be attached directly in WhatsApp after opening.',
      [{text: 'OK'}]
    );
  };

  const handleRemoveMedia = () => {
    setMediaAttached(false);
  };

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (!voter.mobileNumber) {
      Alert.alert('Error', 'No mobile number available');
      return;
    }

    try {
      // Format phone number (remove spaces and add country code if needed)
      const phoneNumber = voter.mobileNumber.replace(/\s/g, '');
      const whatsappNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      // Create WhatsApp URL
      const url = `whatsapp://send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
        Alert.alert(
          'Success',
          'WhatsApp opened. Please send your message.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BackButton />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Send WhatsApp Message</Text>

            <View style={styles.voterInfo}>
              <Text style={styles.voterName}>{voter.Name}</Text>
              <Text style={styles.voterMobile}>📱 {voter.mobileNumber}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.messageInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message here..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.mediaContainer}>
              <Text style={styles.label}>Media (Optional)</Text>
              
              <View style={styles.noteContainer}>
                <Text style={styles.noteText}>
                  💡 Tip: You can attach images and videos directly in WhatsApp after it opens.
                </Text>
              </View>
            </View>

            <Button
              title="Send via WhatsApp"
              onPress={handleSend}
              style={styles.sendButton}
            />
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
  voterInfo: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.small,
  },
  voterName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  voterMobile: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  messageInput: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    minHeight: 120,
    ...SHADOWS.small,
  },
  mediaContainer: {
    marginBottom: SPACING.lg,
  },
  mediaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
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
  noteContainer: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  noteText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#25D366',
  },
});

export default WhatsAppMessageScreen;
