import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export const useDeeplink = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Handle initial URL
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeeplink(url);
      }
    });

    // Handle URL when app is open
    const subscription = Linking.addEventListener('url', event => {
      handleDeeplink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeeplink = (url: string) => {
    try {
      // Manual URL parsing for format: mobile://join?meetingId=XXX&password=YYY
      const urlObj = new URL(url);

      if (urlObj.hostname === 'join' || urlObj.pathname === '/join') {
        const params: any = {};

        // Parse query parameters
        urlObj.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        if (params.meetingId) {
          navigation.navigate('Waiting' as never);
        }
      }
    } catch (error) {
      console.error('Error handling deeplink:', error);
    }
  };
};
