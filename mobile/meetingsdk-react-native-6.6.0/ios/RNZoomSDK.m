#import <React/RCTConvert.h>
#import "RNZoomSDK.h"

@implementation RNZoomSDK

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

-(NSArray<NSString *>*)supportedEvents
{
    return @[
    ];
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(initSDK,
        initSDKWithConfig: (NSDictionary *)config
        withResolver:(RCTPromiseResolveBlock)resolve
        withRejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        MobileRTCSDKInitContext *initParams = [[MobileRTCSDKInitContext alloc] init];
        initParams.domain = [config valueForKey:@"domain"];
        initParams.enableLog = [[config objectForKey:@"enableLog"] boolValue];
        initParams.wrapperType = 2;
        if ([config objectForKey:@"bundleResPath"]) {
            initParams.appGroupId = [config valueForKey:@"bundleResPath"];
        }
        if ([config objectForKey:@"appGroupId"]) {
            initParams.appGroupId = [config valueForKey:@"appGroupId"];
        }
        if ([config objectForKey:@"replaykitBundleIdentifier"]) {
            initParams.appGroupId = [config valueForKey:@"replaykitBundleIdentifier"];
        }

        BOOL sdkInitRes = [[MobileRTC sharedRTC] initialize:initParams];

        if (sdkInitRes) {
            MobileRTCAuthService *authService = [[MobileRTC sharedRTC] getAuthService];
            if (authService) {
                authService.jwtToken = [config valueForKey:@"jwtToken"];
                authService.delegate = self;
                [authService sdkAuth];
            }
        }
    });
}

RCT_REMAP_METHOD(joinMeeting,
        joinMeetingWithConfig: (NSDictionary *)config
        withResolver: (RCTPromiseResolveBlock)resolve
        withRejecter: (RCTPromiseRejectBlock)reject)
{
    MobileRTCMeetingService *meetService = [[MobileRTC sharedRTC] getMeetingService];
    MobileRTCMeetingJoinParam *params;
    if (meetService) {
        params = [[MobileRTCMeetingJoinParam alloc] init];
        params.meetingNumber = [config valueForKey:@"meetingNumber"];
        params.password = [config valueForKey:@"password"];
        params.userName = [config valueForKey:@"userName"];
        if ([config objectForKey:@"noAudio"]) {
            params.noAudio = [[config valueForKey:@"noAudio"] boolValue];
        }
        if ([config objectForKey:@"noVideo"]) {
            params.noVideo = [[config valueForKey:@"noVideo"] boolValue];
        }
        if ([config objectForKey:@"customerKey"]) {
            params.customerKey = [config valueForKey:@"customerKey"];
        }
        if ([config objectForKey:@"vanityID"]) {
            params.vanityID = [config valueForKey:@"vanityID"];
        }
        if ([config objectForKey:@"webinarToken"]) {
            params.webinarToken = [config valueForKey:@"webinarToken"];
        }
        if ([config objectForKey:@"zoomAccessToken"]) {
            params.zak = [config valueForKey:@"zoomAccessToken"];
        }
        if ([config objectForKey:@"appPrivilegeToken"]) {
            params.appPrivilegeToken = [config valueForKey:@"appPrivilegeToken"];
        }
        if ([config objectForKey:@"joinToken"]) {
            params.join_token = [config valueForKey:@"joinToken"];
        }
        if ([config objectForKey:@"isMyVoiceInMix"]) {
            params.isMyVoiceInMix = [[config valueForKey:@"isMyVoiceInMix"] boolValue];
        }
        if ([config objectForKey:@"isAudioRawDataStereo"]) {
            params.isAudioRawDataStereo = [[config valueForKey:@"isAudioRawDataStereo"] boolValue];
        }
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        MobileRTCMeetError res = [meetService joinMeetingWithJoinParam: params];
        switch (res) {
            case MobileRTCMeetError_Success:
                NSLog(@"joinMeeting called");
                resolve(0);
                break;
            default:
                NSLog(@"failed to join meeting");
                reject(@"start_meeting_failed", @"fail", nil);
                break;
        }
    });
}

RCT_REMAP_METHOD(isInitialized,
    withResolver:(RCTPromiseResolveBlock)resolve
    withRejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL isInitialized = [[MobileRTC sharedRTC] isRTCAuthorized];
    resolve(@(isInitialized));
}

RCT_REMAP_METHOD(startMeeting,
        startMeetingWithConfig: (NSDictionary *)config
        withResolver: (RCTPromiseResolveBlock)resolve
        withRejecter: (RCTPromiseRejectBlock)reject)
{
    MobileRTCMeetingService *meetService = [[MobileRTC sharedRTC] getMeetingService];
    MobileRTCMeetingStartParam4WithoutLoginUser *params;
    if (meetService) {
        params = [[MobileRTCMeetingStartParam4WithoutLoginUser alloc]init];
        params.userName = config[@"userName"];
        params.meetingNumber = config[@"meetingNumber"];
        params.zak = config[@"zoomAccessToken"];
        if ([config objectForKey:@"userType"]) {
            params.userType = config[@"userType"];
        }
    }
    dispatch_async(dispatch_get_main_queue(), ^{
        MobileRTCMeetError res = [meetService startMeetingWithStartParam: params];
        switch (res) {
            case MobileRTCMeetError_Success:
                NSLog(@"startMeeting called ");
                resolve(0);
                break;
            default:
                NSLog(@"failed to start meeting");
                reject(@"start_meeting_failed", @"fail", nil);
                break;
        }
    });
}

RCT_REMAP_METHOD(updateMeetingSetting,
        updateMeetingSettingWithConfig: (NSDictionary *)config
        withResolver: (RCTPromiseResolveBlock)resolve
        withRejecter: (RCTPromiseRejectBlock)reject)
{
    MobileRTCMeetingSettings *meetingSetting = [[MobileRTC sharedRTC] getMeetingSettings];
    if (meetingSetting) {
        if ([config objectForKey:@"disableVideoPreview"]) {
            [meetingSetting disableShowVideoPreviewWhenJoinMeeting:[[config valueForKey:@"disableVideoPreview"] boolValue]];
        }
        if ([config objectForKey:@"disableClearWebKitCache"]) {
            [meetingSetting disableClearWebKitCache:[[config valueForKey:@"disableClearWebKitCache"] boolValue]];
        }
    }
}

RCT_REMAP_METHOD(cleanup,
        cleanupWithResolver:(RCTPromiseResolveBlock)resolve
        withRejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MobileRTC sharedRTC] cleanup];
    });
}

- (void)onMobileRTCAuthReturn:(MobileRTCAuthError)returnValue {
    switch (returnValue) {
        case MobileRTCAuthError_Success:
            NSLog(@"SDK successfully initialized.");
            break;
        case MobileRTCAuthError_TokenWrong:
            NSLog(@"Client JWT Token Authentication is invalid.");
            break;
        default:
            NSLog(@"SDK Authorization failed with MobileRTCAuthError: %u", returnValue);
    }
}

- (void)onMeetingError:(MobileRTCMeetError)error message:(NSString *)message {
    switch (error) {
        case MobileRTCMeetError_PasswordError:
            NSLog(@"Could not join or start meeting because the meeting password was incorrect.");
        default:
            NSLog(@"Could not join or start meeting with MobileRTCMeetError: %u %@", error, message);
    }
}
- (void)onJoinMeetingConfirmed {
    NSLog(@"Join meeting confirmed.");
}
- (void)onMeetingStateChange:(MobileRTCMeetingState)state {
    NSLog(@"Current meeting state: %u", state);
}
@end
