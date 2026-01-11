import { BACKEND_SERVER_URL } from '@env';

const BACKEND_URL = BACKEND_SERVER_URL;

export interface BackendResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ZoomJWTResponse {
  jwtToken: string;
  expiresIn: number;
}

export interface CreateMeetingRequest {
  hostUserId: string;
  title?: string;
  type?: 'instant' | 'scheduled';
  startTime?: string;
  duration?: number;
}

export interface Meeting {
  id: string;
  zoom_meeting_id: string;
  host_user_id: string;
  title: string;
  password: string | null;
  join_url: string | null;
  start_time: string | null;
  duration: number;
  type: 'instant' | 'scheduled';
  status: 'created' | 'started' | 'ended' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface MeetingWithZak extends Meeting {
  zak_token: string | null;
}

export interface MeetingsResponse {
  meetings: Meeting[];
  zakToken?: string;
}

export const backendService = {
  /**
   * Get Zoom SDK JWT token for initializing the Zoom SDK
   */
  async getZoomJWT(): Promise<BackendResponse<ZoomJWTResponse>> {
    try {
      const response = await fetch(`${BACKEND_URL}/meetings/jwt`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get JWT',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Create a new meeting (Seller only)
   */
  async createMeeting(
    request: CreateMeetingRequest,
  ): Promise<BackendResponse<MeetingWithZak>> {
    try {
      const response = await fetch(`${BACKEND_URL}/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create meeting',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Get all meetings for a host user (includes ZAK token for rejoining as host)
   */
  async getMeetings(
    hostUserId: string,
  ): Promise<BackendResponse<MeetingsResponse>> {
    try {
      const response = await fetch(
        `${BACKEND_URL}/meetings?hostUserId=${hostUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch meetings',
        };
      }

      return {
        success: true,
        data: {
          meetings: data.data,
          zakToken: data.zakToken,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Get a single meeting by ID
   */
  async getMeetingById(meetingId: string): Promise<BackendResponse<Meeting>> {
    try {
      const response = await fetch(`${BACKEND_URL}/meetings/${meetingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch meeting',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Get ZAK token for host to join as host
   */
  async getZakToken(): Promise<BackendResponse<{ zakToken: string }>> {
    try {
      const response = await fetch(`${BACKEND_URL}/meetings/zak`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get ZAK token',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Update meeting status
   */
  async updateMeetingStatus(
    meetingId: string,
    status: 'created' | 'started' | 'ended' | 'cancelled',
  ): Promise<BackendResponse<Meeting>> {
    try {
      const response = await fetch(`${BACKEND_URL}/meetings/${meetingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to update meeting',
        };
      }

      return {
        success: true,
        data: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Register/update FCM token for push notifications
   */
  async registerFcmToken(params: {
    userId: string;
    fcmToken: string;
    platform: 'ios' | 'android';
  }): Promise<BackendResponse<{ success: boolean }>> {
    try {
      const response = await fetch(`${BACKEND_URL}/users/fcm-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to register FCM token',
        };
      }

      return {
        success: true,
        data: { success: true },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },

  /**
   * Send contract to client via email and push notification
   */
  async sendContract(params: {
    clientEmail: string;
    sellerUserId: string;
    meetingId?: string;
    contractUrl?: string;
  }): Promise<BackendResponse<{ contractUrl: string }>> {
    try {
      const response = await fetch(`${BACKEND_URL}/contracts/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to send contract',
        };
      }

      return {
        success: true,
        data: { contractUrl: data.contractUrl },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },
};
