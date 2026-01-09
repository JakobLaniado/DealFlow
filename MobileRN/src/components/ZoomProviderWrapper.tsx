import { backendService } from '@/services/backend.service';
import { ZoomSDKProvider } from '@zoom/meetingsdk-react-native';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  NativeModules,
  Text,
  View,
} from 'react-native';

export function ZoomProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [isActivityReady, setIsActivityReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        console.log('Fetching Zoom JWT... Retry:', retry);
        const res = await backendService.getZoomJWT();
        if (!res?.success || !res?.data?.jwtToken) {
          throw new Error(res?.error ?? 'Missing jwtToken from backend');
        }
        console.log(
          'Zoom JWT fetched successfully',
          jwtDecode(res.data.jwtToken),
        );
        setJwtToken(res.data.jwtToken);
      } catch (e: any) {
        setError(e.message ?? 'Failed to fetch Zoom JWT');
      }
    })();
  }, [retry]);

  useEffect(() => {
    if (!jwtToken) return;

    let alive = true;
    let timer: NodeJS.Timeout;

    const checkActivity = async () => {
      try {
        const RNZoom = NativeModules.RNZoomSDK;
        if (!RNZoom) {
          console.warn('[Zoom] Native module RNZoomSDK not found');
          // Fallback to true if module is missing (though this shouldn't happen)
          setIsActivityReady(true);
          return;
        }

        // Try to call isInitialized. If it doesn't throw the 'activity' error, we are good.
        await RNZoom.isInitialized();
        if (alive) {
          console.log('[Zoom] Activity is ready, mounting provider...');
          setIsActivityReady(true);
        }
      } catch (err: any) {
        if (!alive) return;
        if (err?.message?.includes('react native activity')) {
          console.log('[Zoom] Activity not yet ready, retrying in 1s...');
          timer = setTimeout(checkActivity, 1000);
        } else {
          // If it's a different error, it means the activity check succeeded but SDK itself has an issue
          // which is fine to let the provider handle
          setIsActivityReady(true);
        }
      }
    };

    checkActivity();

    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [jwtToken]);

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
          {error}
        </Text>
        <Button
          title="Retry"
          onPress={() => {
            setError(null);
            setRetry(retry + 1);
          }}
        />
      </View>
    );
  }

  if (!jwtToken || !isActivityReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Connecting to Zoom...</Text>
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
