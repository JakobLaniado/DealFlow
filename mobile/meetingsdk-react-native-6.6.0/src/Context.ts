import { createContext } from 'react';
import type { StartMeetingConfig, JoinMeetingConfig, MeetingSettingsConfig } from './native/ZoomSDK';

function throwProviderError() {
  throw new Error(
    'Cannot access the Zoom SDK without a ZoomSDKProvider component wrapping your entire application.'
  );
}

export interface ZoomSDKContext {
    joinMeeting: (config: JoinMeetingConfig) => Promise<number>;
    startMeeting: (config: StartMeetingConfig) => Promise<number>;
    updateMeetingSetting: (config: MeetingSettingsConfig) => void;
    isInitialized: () => Promise<boolean>;
    cleanup: () => void;
}

export const Context = createContext<ZoomSDKContext>({
  joinMeeting: throwProviderError as any,
  startMeeting: throwProviderError as any,
  updateMeetingSetting: throwProviderError as any,
  isInitialized: throwProviderError as any,
  cleanup: throwProviderError as any,
});
