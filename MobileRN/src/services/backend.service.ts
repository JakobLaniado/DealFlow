import { supabase } from '@/config/supabase';

const BACKEND_URL = process.env.BACKEND_SERVER_URL;

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
  title?: string;
  startTime?: string;
  duration?: number;
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

/**
 * Get the current Supabase session token for API authentication
 */
async function getAuthToken(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export const backendService = {
  /**
   * Get Zoom SDK JWT token from backend
   */
  async getZoomJWT(): Promise<BackendResponse<ZoomJWTResponse>> {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(`${BACKEND_URL}/zoom/jwt`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get Zoom JWT',
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
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(`${BACKEND_URL}/meetings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
   * Get all meetings
   */
  async getMeetings(): Promise<BackendResponse<Meeting[]>> {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(`${BACKEND_URL}/meetings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get meetings',
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
   * Get a specific meeting by ID
   */
  async getMeeting(meetingId: string): Promise<BackendResponse<Meeting>> {
    try {
      const token = await getAuthToken();
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated',
        };
      }

      const response = await fetch(`${BACKEND_URL}/meetings/${meetingId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get meeting',
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
};
