import { ZoomSDKProvider } from '@zoom/meetingsdk-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ZOOM_JWT_TOKEN } from '../config';
import { Navigation } from './navigation';

export default function App() {
  return (
    <NavigationContainer>
      <ZoomSDKProvider
        config={{
          jwtToken: ZOOM_JWT_TOKEN,
          domain: "zoom.us",
          enableLog: true,
          logSize: 5,
        }}>
        <Navigation />
      </ZoomSDKProvider>
    </NavigationContainer>
  );
}
