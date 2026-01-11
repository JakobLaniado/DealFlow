import React from 'react';
import { ContractModal } from './ContractModal';
import { useNotification } from '@/contexts/NotificationContext';

export const ContractModalHandler: React.FC = () => {
  const {
    showContractModal,
    dismissContractModal,
    openContract,
    joinMeeting,
    contractData,
  } = useNotification();

  return (
    <ContractModal
      visible={showContractModal}
      sellerName={contractData?.sellerName}
      onReview={openContract}
      onJoinMeeting={joinMeeting}
      onDismiss={dismissContractModal}
      hasMeetingLink={!!contractData?.meetingDeeplink}
    />
  );
};
