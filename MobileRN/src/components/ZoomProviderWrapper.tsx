import { backendService } from '@/services/backend.service';
import { ZoomSDKProvider } from '@zoom/meetingsdk-react-native';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, View } from 'react-native';

export function ZoomProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        console.log('Retry', retry);
        const res = await backendService.getZoomJWT();
        console.log('Res', res);
        if (!res?.success || !res?.data?.jwtToken) {
          throw new Error(res?.error ?? 'Missing jwtToken from backend');
        }
        console.log(jwtDecode(res.data.jwtToken));

        setJwtToken(res.data.jwtToken);
      } catch (e: any) {
        setError(e.message ?? 'Failed to fetch Zoom JWT');
      }
    })();
  }, [retry]);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* replace with your UI */}
        <ActivityIndicator />
        <Button title="Retry" onPress={() => setRetry(retry + 1)} />
      </View>
    );
  }

  if (!jwtToken) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ZoomSDKProvider
      config={{
        jwtToken,
        domain: 'zoom.us',
        enableLog: __DEV__,
        logSize: 5,
      }}
    >
      {children}
    </ZoomSDKProvider>
  );
}
