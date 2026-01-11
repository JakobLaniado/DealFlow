import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import {
  notificationService,
  ContractNotificationData,
} from '@/services/notification.service';
import { backendService } from '@/services/backend.service';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  fcmToken: string | null;
  contractData: ContractNotificationData | null;
  showContractModal: boolean;
  dismissContractModal: () => void;
  openContract: () => void;
  joinMeeting: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [contractData, setContractData] = useState<ContractNotificationData | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const handlerRegistered = useRef(false);

  useEffect(() => {
    if (handlerRegistered.current) return;
    handlerRegistered.current = true;

    const unsubscribe = notificationService.onContractReceived((data) => {
      setContractData(data);
      setShowContractModal(true);
    });

    return () => {
      handlerRegistered.current = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const initFcm = async () => {
      const token = await notificationService.initialize();
      if (token) {
        setFcmToken(token);
      }
    };

    initFcm();

    const unsubscribeTokenRefresh = notificationService.onTokenRefresh((newToken) => {
      setFcmToken(newToken);
    });

    return unsubscribeTokenRefresh;
  }, []);

  useEffect(() => {
    const registerToken = async () => {
      if (isAuthenticated && user && fcmToken) {
        await backendService.registerFcmToken({
          userId: user.id,
          fcmToken,
          platform: Platform.OS as 'ios' | 'android',
        });
      }
    };

    registerToken();
  }, [isAuthenticated, user, fcmToken]);

  const dismissContractModal = useCallback(() => {
    setShowContractModal(false);
  }, []);

  const openContract = useCallback(() => {
    if (contractData?.contractUrl) {
      notificationService.openUrl(contractData.contractUrl);
    }
    setShowContractModal(false);
  }, [contractData]);

  const joinMeeting = useCallback(() => {
    if (contractData?.meetingDeeplink) {
      notificationService.openUrl(contractData.meetingDeeplink);
    }
    setShowContractModal(false);
  }, [contractData]);

  const value: NotificationContextType = {
    fcmToken,
    contractData,
    showContractModal,
    dismissContractModal,
    openContract,
    joinMeeting,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default useNotification;
