import React from 'react';

import { useSDKHandler } from './hooks/useSDKHandler';
import type { InitConfig } from './native/ZoomSDK';
import { Context } from './Context';

interface Props {
  config: InitConfig;
  children?: React.ReactNode;
}

export const ZoomSDKProvider: React.FC<Props> = ({ config, children }) => {
  const zoom = useSDKHandler(config);

  return <Context.Provider value={zoom}>{children}</Context.Provider>;
};
