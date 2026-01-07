import { useCallback, useEffect, useRef, useState } from 'react';
import type { ZoomSDKContext } from '../Context';

import {
  InitConfig,
  MeetingSettingsConfig,
  JoinMeetingConfig,
  StartMeetingConfig,
  ZoomSDK,
} from '../native/ZoomSDK';

const DEFAULT_CONFIG: InitConfig = {
  domain: 'zoom.us',
  enableLog: true,
  logSize: 5,
};

export function useSDKHandler(config: InitConfig = {}): ZoomSDKContext {
  const SDKHandler = useRef(new ZoomSDK());

  const [isInited, setIsInited] = useState(false);

  useEffect(() => {
    if (!isInited) {
      SDKHandler.current.initSDK({ ...DEFAULT_CONFIG, ...config });
      setIsInited(true);
    }
  }, [config, isInited]);

  const isInitialized = useCallback(() => {
    return SDKHandler.current.isInitialized();
  }, []);

  const updateMeetingSetting = useCallback((config: MeetingSettingsConfig) => {
    SDKHandler.current.updateMeetingSetting(config);
  }, []);

  const joinMeeting = useCallback((config: JoinMeetingConfig) => {
    return SDKHandler.current.joinMeeting(config);
  }, []);

  const startMeeting = useCallback((config: StartMeetingConfig) => {
    return SDKHandler.current.startMeeting(config);
  }, []);

  const cleanup = useCallback(() => {
    SDKHandler.current.cleanup();
  }, []);

  return {
    isInitialized,
    updateMeetingSetting,
    joinMeeting,
    startMeeting,
    cleanup
  };
}
