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
  userId: string;
  title?: string;
  startTime?: string;
  duration?: number;
  settings?: {
    waiting_room?: boolean;
    join_before_host?: boolean;
  };
}

export interface Meeting {
  id: string;
  meeting_id: string;
  password: string;
  title: string;
  created_by: string;
  start_time: string | null;
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingResponse {
  meetingId: string;
  password: string;
  deeplink: string;
  meeting: Meeting;
}

export const backendService = {
  /**
   * Get Zoom SDK JWT token for initializing the Zoom SDK
   */
  async getZoomJWT(): Promise<BackendResponse<ZoomJWTResponse>> {
    try {
      const response = await fetch(`${BACKEND_URL}/zoom/jwt`, {
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
  ): Promise<BackendResponse<CreateMeetingResponse>> {
    try {
      const response = await fetch(`${BACKEND_URL}/zoom/meetings`, {
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
   * Get SDK signature for joining a meeting
   */
  async getZoomSdkSignature(
    meetingId: string,
    role: 0 | 1,
  ): Promise<BackendResponse<{ signature: string }>> {
    try {
      const response = await fetch(`${BACKEND_URL}/zoom/sdk-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meetingId, role }),
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get SDK signature',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  },
};
