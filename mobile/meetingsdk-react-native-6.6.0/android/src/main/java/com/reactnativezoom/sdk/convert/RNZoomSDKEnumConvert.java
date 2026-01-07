package com.reactnativezoom.sdk.convert;

import com.facebook.react.bridge.NoSuchKeyException;

import java.util.HashMap;
import java.util.Map;

import us.zoom.sdk.InMeetingServiceListener.VideoStatus;
import us.zoom.sdk.InMeetingServiceListener.AudioStatus;
import us.zoom.sdk.InMeetingServiceListener.UVCCameraStatus;
import us.zoom.sdk.InMeetingAudioController.MobileRTCMicrophoneError;
import us.zoom.sdk.InMeetingServiceListener.RecordingStatus;
import us.zoom.sdk.VideoQuality;
import us.zoom.sdk.ZoomSDKChatMessageType;
import us.zoom.sdk.ChatMessageDeleteType;
import us.zoom.sdk.InMeetingChatController.MobileRTCWebinarPanelistChatPrivilege;
import us.zoom.sdk.FreeMeetingNeedUpgradeType;
import us.zoom.sdk.LocalRecordingRequestPrivilegeStatus;
import us.zoom.sdk.MobileRTCFocusModeShareType;
import us.zoom.sdk.MeetingStatus;
import us.zoom.sdk.MeetingType;
import us.zoom.sdk.SharingStatus;
import us.zoom.sdk.ShareSettingType;
import us.zoom.sdk.InviteOptions;
import us.zoom.sdk.MeetingViewsOptions;

public class RNZoomSDKEnumConvert {

    private static final Map<String, Integer> inviteOptionsMap =
            new HashMap<String, Integer>() {{
                put("InviteEnableAll", InviteOptions.INVITE_ENABLE_ALL);
                put("InviteViaSMS", InviteOptions.INVITE_VIA_SMS);
                put("InviteViaEmail", InviteOptions.INVITE_VIA_EMAIL);
                put("InviteCopyUrl", InviteOptions.INVITE_COPY_URL);
                put("InviteDisableAll", InviteOptions.INVITE_DISABLE_ALL);
            }};

    public static int getInviteOptions(String name) {
        int res;
        try {
            res = (name != null) ? inviteOptionsMap.get(name) : -1;
        } catch (NoSuchKeyException e) {
            res = -1;
        }
        return res;
    }

    private static final Map<String, Integer> meetingViewsOptionsMap =
            new HashMap<String, Integer>() {{
                put("noButtonVideo", MeetingViewsOptions.NO_BUTTON_VIDEO);
                put("noButtonAudio", MeetingViewsOptions.NO_BUTTON_AUDIO);
                put("noButtonShare", MeetingViewsOptions.NO_BUTTON_SHARE);
                put("noButtonParticipants", MeetingViewsOptions.NO_BUTTON_PARTICIPANTS);
                put("noButtonMore", MeetingViewsOptions.NO_BUTTON_MORE);
                put("noTextMeetingId", MeetingViewsOptions.NO_TEXT_MEETING_ID);
                put("noTextPassword", MeetingViewsOptions.NO_TEXT_PASSWORD);
                put("noButtonLeave", MeetingViewsOptions.NO_BUTTON_LEAVE);
                put("noButtonSwitchCamera", MeetingViewsOptions.NO_BUTTON_SWITCH_CAMERA);
                put("noButtonSwitchAudioSource", MeetingViewsOptions.NO_BUTTON_SWITCH_AUDIO_SOURCE);
            }};

    public static int getMeetingViewsOptions(String name) {
        int res;
        try {
            res = (name != null) ? meetingViewsOptionsMap.get(name) : -1;
        } catch (NoSuchKeyException e) {
            res = -1;
        }
        return res;
    }

    private static final Map<VideoStatus, String> videoStatusStrMap =
            new HashMap<VideoStatus, String>() {{
                put(VideoStatus.Video_ON, "On");
                put(VideoStatus.Video_OFF, "Off");
                put(VideoStatus.Video_Mute_ByHost, "MuteByHost");
            }};

    public static String getVideoStatusStr(VideoStatus name) {
        String res;
        try {
            res = (name != null) ? videoStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<VideoQuality, String> videoQualityStrMap =
            new HashMap<VideoQuality, String>() {{
                put(VideoQuality.VideoQuality_Unknown, "Unknown");
                put(VideoQuality.VideoQuality_Bad, "Bad");
                put(VideoQuality.VideoQuality_Normal, "Normal");
                put(VideoQuality.VideoQuality_Good, "Good");
            }};

    public static String getVideoQualityStr(VideoQuality name) {
        String res;
        try {
            res = (name != null) ? videoQualityStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<MobileRTCMicrophoneError, String> microphoneErrorStrMap =
            new HashMap<MobileRTCMicrophoneError, String>() {{
                put(MobileRTCMicrophoneError.MobileRTCMicrophoneError_MicMuted, "MicMuted");
                put(MobileRTCMicrophoneError.MobileRTCMicrophoneError_FeedbackDetected, "FeedbackDetected");
                put(MobileRTCMicrophoneError.MobileRTCMicrophoneError_MicUnavailable, "MicUnavailable");
            }};

    public static String getMicrophoneErrorStr(MobileRTCMicrophoneError name) {
        String res;
        try {
            res = (name != null) ? microphoneErrorStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<AudioStatus, String> audioStatusStrMap =
            new HashMap<AudioStatus, String>() {{
                put(AudioStatus.Audio_None, "None");
                put(AudioStatus.Audio_Muted, "Muted");
                put(AudioStatus.Audio_UnMuted, "UnMuted");
                put(AudioStatus.Audio_Muted_ByHost, "MutedByHost");
                put(AudioStatus.Audio_UnMuted_ByHost, "UnMutedByHost");
                put(AudioStatus.Audio_MutedAll_ByHost, "MutedAllByHost");
                put(AudioStatus.Audio_UnMutedAll_ByHost, "UnMutedAllByHost");
            }};

    public static String getAudioStatusStr(AudioStatus name) {
        String res;
        try {
            res = (name != null) ? audioStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<ZoomSDKChatMessageType, String> chatMessageTypeStrMap =
            new HashMap<ZoomSDKChatMessageType, String>() {{
                put(ZoomSDKChatMessageType.ZoomSDKChatMessageType_To_None, "ToNone");
                put(ZoomSDKChatMessageType.ZoomSDKChatMessageType_To_All, "ToAll");
                put(ZoomSDKChatMessageType.ZoomSDKChatMessageType_To_All_Panelist, "ToAllPanelist");
                put(ZoomSDKChatMessageType.ZoomSDKChatMessageType_To_Individual_Panelist, "ToIndividualPanelist");
                put(ZoomSDKChatMessageType.ZoomSDKChatMessageType_To_Individual, "ToIndividual");
                put(ZoomSDKChatMessageType.ZoomSDKChatMessageType_To_WaitingRoomUsers, "ToWaitingRoomUsers");
            }};

    public static String getChatMessageTypeStr(ZoomSDKChatMessageType name) {
        String res;
        try {
            res = (name != null) ? chatMessageTypeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<ChatMessageDeleteType, String> chatMessageDeleteTypeStrMap =
            new HashMap<ChatMessageDeleteType, String>() {{
                put(ChatMessageDeleteType.SDK_CHAT_DELETE_BY_NONE, "ByNone");
                put(ChatMessageDeleteType.SDK_CHAT_DELETE_BY_SELF, "BySelf");
                put(ChatMessageDeleteType.SDK_CHAT_DELETE_BY_HOST, "ByHost");
                put(ChatMessageDeleteType.SDK_CHAT_DELETE_BY_DLP, "ByDLP");
            }};

    public static String getChatMessageDeleteTypeStr(ChatMessageDeleteType name) {
        String res;
        try {
            res = (name != null) ? chatMessageDeleteTypeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<MobileRTCWebinarPanelistChatPrivilege, String> chatPrivilegeStrMap =
            new HashMap<MobileRTCWebinarPanelistChatPrivilege, String>() {{
                put(MobileRTCWebinarPanelistChatPrivilege.ChatPrivilege_Invalid, "Invalid");
                put(MobileRTCWebinarPanelistChatPrivilege.ChatPrivilege_AllPanelist, "AllPanelist");
                put(MobileRTCWebinarPanelistChatPrivilege.ChatPrivilege_All, "All");
            }};

    public static String getChatMessageDeleteTypeStr(MobileRTCWebinarPanelistChatPrivilege name) {
        String res;
        try {
            res = (name != null) ? chatPrivilegeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<FreeMeetingNeedUpgradeType, String> freeMeetingNeedUpgradeTypeStrMap =
            new HashMap<FreeMeetingNeedUpgradeType, String>() {{
                put(FreeMeetingNeedUpgradeType.NONE, "None");
                put(FreeMeetingNeedUpgradeType.BY_ADMIN, "ByAdmin");
                put(FreeMeetingNeedUpgradeType.BY_GIFTURL, "ByGiftUrl");
            }};

    public static String getFreeMeetingNeedUpgradeTypeStr(FreeMeetingNeedUpgradeType name) {
        String res;
        try {
            res = (name != null) ? freeMeetingNeedUpgradeTypeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<RecordingStatus, String> recordingStatusStrMap =
            new HashMap<RecordingStatus, String>() {{
                put(RecordingStatus.Recording_Start, "Start");
                put(RecordingStatus.Recording_Stop, "Stop");
                put(RecordingStatus.Recording_Pause, "Pause");
                put(RecordingStatus.Recording_Connecting, "Connecting");
                put(RecordingStatus.Recording_DiskFull, "DiskFull");
                put(RecordingStatus.Recording_Fail, "Fail");
            }};

    public static String getRecordingStatusStr(RecordingStatus name) {
        String res;
        try {
            res = (name != null) ? recordingStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<LocalRecordingRequestPrivilegeStatus, String> localRecordingRequestPrivilegeStatusStrMap =
            new HashMap<LocalRecordingRequestPrivilegeStatus, String>() {{
                put(LocalRecordingRequestPrivilegeStatus.LocalRecordingRequestPrivilege_None, "None");
                put(LocalRecordingRequestPrivilegeStatus.LocalRecordingRequestPrivilege_AllowRequest, "AllowRequest");
                put(LocalRecordingRequestPrivilegeStatus.LocalRecordingRequestPrivilege_AutoGrant, "AutoGrant");
                put(LocalRecordingRequestPrivilegeStatus.LocalRecordingRequestPrivilege_AutoDeny, "AutoDeny");
            }};

    public static String getLocalRecordingRequestPrivilegeStatusStr(LocalRecordingRequestPrivilegeStatus name) {
        String res;
        try {
            res = (name != null) ? localRecordingRequestPrivilegeStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<UVCCameraStatus, String> UVCCameraStatusStrMap =
            new HashMap<UVCCameraStatus, String>() {{
                put(UVCCameraStatus.ATTACHED, "Attached");
                put(UVCCameraStatus.CONNECTED, "Connected");
                put(UVCCameraStatus.CANCELED, "Canceled");
                put(UVCCameraStatus.DETACHED, "Detached");
            }};

    public static String getUVCCameraStatusStr(UVCCameraStatus name) {
        String res;
        try {
            res = (name != null) ? UVCCameraStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<MobileRTCFocusModeShareType, String> focusModeShareTypeStrMap =
            new HashMap<MobileRTCFocusModeShareType, String>() {{
                put(MobileRTCFocusModeShareType.MobileRTCFocusModeShareType_None, "None");
                put(MobileRTCFocusModeShareType.MobileRTCFocusModeShareType_HostOnly, "HostOnly");
                put(MobileRTCFocusModeShareType.MobileRTCFocusModeShareType_AllParticipants, "AllParticipants");
            }};

    public static String getMobileRTCFocusModeShareTypeStr(MobileRTCFocusModeShareType name) {
        String res;
        try {
            res = (name != null) ? focusModeShareTypeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<MeetingStatus, String> meetingStatusStrMap =
            new HashMap<MeetingStatus, String>() {{
                put(MeetingStatus.MEETING_STATUS_IDLE, "Idle");
                put(MeetingStatus.MEETING_STATUS_CONNECTING, "Connecting");
                put(MeetingStatus.MEETING_STATUS_WAITINGFORHOST, "WaitingForHost");
                put(MeetingStatus.MEETING_STATUS_INMEETING, "InMeeting");
                put(MeetingStatus.MEETING_STATUS_DISCONNECTING, "Disconnecting");
                put(MeetingStatus.MEETING_STATUS_RECONNECTING, "Reconnecting");
                put(MeetingStatus.MEETING_STATUS_ENDED, "Ended");
                put(MeetingStatus.MEETING_STATUS_UNLOCKED, "Unlocked");
                put(MeetingStatus.MEETING_STATUS_LOCKED, "Locked");
                put(MeetingStatus.MEETING_STATUS_IN_WAITING_ROOM, "InWaitingRoom");
                put(MeetingStatus.MEETING_STATUS_WEBINAR_PROMOTE, "WebinarPromote");
                put(MeetingStatus.MEETING_STATUS_WEBINAR_DEPROMOTE, "WebinarDepromote");
                put(MeetingStatus.MEETING_STATUS_JOIN_BREAKOUT_ROOM, "JoinBreakoutRoom");
                put(MeetingStatus.MEETING_STATUS_LEAVE_BREAKOUT_ROOM, "LeaveBreakoutRoom");
                put(MeetingStatus.MEETING_STATUS_UNKNOWN, "Unknown");
            }};

    public static String getMeetingStatusStr(MeetingStatus name) {
        String res;
        try {
            res = (name != null) ? meetingStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<MeetingType, String> meetingTypeStrMap =
            new HashMap<MeetingType, String>() {{
                put(MeetingType.MEETING_TYPE_NONE, "None");
                put(MeetingType.MEETING_TYPE_NORMAL, "Normal");
                put(MeetingType.MEETING_TYPE_WEBINAR, "Webinar");
                put(MeetingType.MEETING_TYPE_BREAKOUTROOM, "BreakoutRoom");
            }};

    public static String getMeetingTypeStr(MeetingType name) {
        String res;
        try {
            res = (name != null) ? meetingTypeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<SharingStatus, String> sharingStatusStrMap =
            new HashMap<SharingStatus, String>() {{
                put(SharingStatus.Sharing_Self_Send_Begin, "SelfSendBegin");
                put(SharingStatus.Sharing_Self_Send_End, "SelfSendEnd");
                put(SharingStatus.Sharing_Other_Share_Begin, "OtherShareBegin");
                put(SharingStatus.Sharing_Other_Share_End, "OtherShareEnd");
                put(SharingStatus.Sharing_View_Other_Sharing, "ViewOtherSharing");
                put(SharingStatus.Sharing_Pause, "Pause");
                put(SharingStatus.Sharing_Resume, "Resume");
                put(SharingStatus.Sharing_OtherPureAudioShareStart, "OtherPureAudioShareStart");
                put(SharingStatus.Sharing_OtherPureAudioShareStop, "OtherPureAudioShareStop");
            }};

    public static String getSharingStatusStr(SharingStatus name) {
        String res;
        try {
            res = (name != null) ? sharingStatusStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

    private static final Map<ShareSettingType, String> shareSettingTypeStrMap =
            new HashMap<ShareSettingType, String>() {{
                put(ShareSettingType.UNKNOWN, "Unknown");
                put(ShareSettingType.HOST_GRAB, "HostGrab");
                put(ShareSettingType.LOCK_SHARE, "LockShare");
                put(ShareSettingType.ANYONE_GRAB, "AnyoneGrab");
                put(ShareSettingType.MULTI_SHARE, "MultiShare");
            }};

    public static String getShareSettingTypeStr(ShareSettingType name) {
        String res;
        try {
            res = (name != null) ? shareSettingTypeStrMap.get(name) : null;
        } catch (NoSuchKeyException e) {
            res = null;
        }
        return res;
    }

}
