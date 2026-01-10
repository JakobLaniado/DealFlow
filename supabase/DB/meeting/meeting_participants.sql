-- Drop existing table
DROP TABLE IF EXISTS meeting_participants CASCADE;

-- Create meeting_participants table
CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'attendee' CHECK (role IN ('host', 'attendee')),
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

-- Index for quick lookups by meeting
CREATE INDEX idx_meeting_participants_meeting_id ON meeting_participants(meeting_id);

-- Index for quick lookups by user
CREATE INDEX idx_meeting_participants_user_id ON meeting_participants(user_id);
