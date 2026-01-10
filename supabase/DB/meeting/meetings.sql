-- Drop existing table
DROP TABLE IF EXISTS meetings CASCADE;

-- Create meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoom_meeting_id TEXT NOT NULL,
  host_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  password TEXT,
  join_url TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 60,
  type TEXT DEFAULT 'instant' CHECK (type IN ('instant', 'scheduled')),
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'started', 'ended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for quick lookups by host
CREATE INDEX idx_meetings_host_user_id ON meetings(host_user_id);

-- Index for Zoom meeting ID lookups
CREATE INDEX idx_meetings_zoom_meeting_id ON meetings(zoom_meeting_id);
