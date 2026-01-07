#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "MobileRTC.h"

@interface RNZoomSDK : RCTEventEmitter <RCTBridgeModule, MobileRTCAuthDelegate, MobileRTCMeetingServiceDelegate>

@end
