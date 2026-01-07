import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { useDeeplink } from './src/hooks/useDeeplink';
import { AppNavigator } from './src/navigation/AppNavigator';

const AppContent = () => {
  useDeeplink();

  return <AppNavigator />;
};

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
