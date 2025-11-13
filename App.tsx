/**
 * Voter Management App
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {COLORS} from './src/constants/theme';

function App() {
  useEffect(() => {
    console.log('✅ App component mounted');
    console.log('🌐 API Base URL:', 'https://election-4606.onrender.com/api');
    return () => {
      console.log('❌ App component unmounted');
    };
  }, []);

  console.log('🚀 App rendering...');
  
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={COLORS.background}
          translucent={false}
        />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default App;
