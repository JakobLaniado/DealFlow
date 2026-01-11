-- Migration: Add FCM (Firebase Cloud Messaging) columns to users table
-- Purpose: Store FCM tokens for push notifications

-- Add FCM token column (the device token from Firebase)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS fcm_token TEXT;

-- Add platform column (ios or android)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS fcm_platform TEXT CHECK (fcm_platform IN ('ios', 'android'));

-- Add timestamp for when the token was last updated
ALTER TABLE users
ADD COLUMN IF NOT EXISTS fcm_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index on fcm_token for faster lookups when sending notifications
CREATE INDEX IF NOT EXISTS idx_users_fcm_token ON users(fcm_token) WHERE fcm_token IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN users.fcm_token IS 'Firebase Cloud Messaging device token for push notifications';
COMMENT ON COLUMN users.fcm_platform IS 'Platform of the device (ios or android)';
COMMENT ON COLUMN users.fcm_updated_at IS 'Timestamp when the FCM token was last updated';
