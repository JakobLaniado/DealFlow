import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';

export interface ContractNotificationData {
  type: 'contract';
  contractUrl: string;
  sellerName?: string;
  meetingId?: string;
  meetingDeeplink?: string;
}

export type NotificationHandler = (data: ContractNotificationData) => void;
export type TokenRefreshCallback = (token: string) => void;

class NotificationService {
  private fcmToken: string | null = null;
  private contractHandler: NotificationHandler | null = null;
  private tokenRefreshCallback: TokenRefreshCallback | null = null;
  private isInitialized: boolean = false;
  private pendingNotification: ContractNotificationData | null = null;

  async initialize(): Promise<string | null> {
    if (this.isInitialized) {
      return this.fcmToken;
    }

    try {
      const hasPermission = await this.requestPermission();

      if (!hasPermission) {
        return null;
      }

      this.fcmToken = await messaging().getToken();

      messaging().onTokenRefresh(token => {
        this.fcmToken = token;
        if (this.tokenRefreshCallback) {
          this.tokenRefreshCallback(token);
        }
      });

      this.setupMessageHandlers();
      this.isInitialized = true;

      return this.fcmToken;
    } catch {
      return null;
    }
  }

  private async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  }

  private setupMessageHandlers(): void {
    messaging().onMessage(async remoteMessage => {
      const data = remoteMessage.data;
      if (data?.type === 'contract') {
        const sellerName = data.sellerName || 'A seller';

        Alert.alert(
          'New Contract Received',
          `${sellerName} has sent you a contract to review.`,
          [
            {
              text: 'Dismiss',
              style: 'cancel',
            },
            {
              text: 'View',
              onPress: () => this.handleMessage(remoteMessage),
            },
          ],
          { cancelable: true }
        );
      } else {
        this.handleMessage(remoteMessage);
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      const deeplink = remoteMessage.data?.deeplink as string;
      if (deeplink) {
        setTimeout(() => {
          Linking.openURL(deeplink);
        }, 500);
      }
      setTimeout(() => {
        this.handleMessage(remoteMessage);
      }, 600);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const deeplink = remoteMessage.data?.deeplink as string;
          if (deeplink) {
            setTimeout(() => {
              Linking.openURL(deeplink);
            }, 2000);
          }
          setTimeout(() => {
            this.handleMessage(remoteMessage);
          }, 2100);
        }
      });
  }

  private handleMessage(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): void {
    const data = remoteMessage.data;

    if (data?.type === 'contract') {
      const contractData: ContractNotificationData = {
        type: 'contract',
        contractUrl: (data.contractUrl as string) || '',
        sellerName: (data.sellerName as string) || undefined,
        meetingId: (data.meetingId as string) || undefined,
        meetingDeeplink: (data.meetingDeeplink as string) || undefined,
      };

      if (this.contractHandler) {
        this.contractHandler(contractData);
      } else {
        this.pendingNotification = contractData;
      }
    }
  }

  onContractReceived(handler: NotificationHandler): () => void {
    this.contractHandler = handler;

    if (this.pendingNotification) {
      const pending = this.pendingNotification;
      this.pendingNotification = null;
      setTimeout(() => {
        handler(pending);
      }, 500);
    }

    return () => {
      this.contractHandler = null;
    };
  }

  getToken(): string | null {
    return this.fcmToken;
  }

  onTokenRefresh(callback: TokenRefreshCallback): () => void {
    this.tokenRefreshCallback = callback;
    return () => {
      this.tokenRefreshCallback = null;
    };
  }

  async openUrl(url: string): Promise<void> {
    try {
      await Linking.openURL(url);
    } catch {}
  }
}

export const notificationService = new NotificationService();
