import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ContractModalHandler } from './src/components/ContractModalHandler';

const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppNavigator />
            <ContractModalHandler />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
