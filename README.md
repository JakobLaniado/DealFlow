# DealFlow - React Native Video Meeting App

A React Native application that embeds Zoom video meetings with a contract-sending feature. Sellers can create meetings, invite clients via deeplinks, and send contract links during live meetings.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native 0.83.1 | Cross-platform mobile app (iOS & Android) |
| Zoom Meeting SDK 6.6.0 | Embedded video meetings |
| Supabase | Authentication & PostgreSQL Database |
| Firebase Cloud Messaging (FCM) | Push notifications |
| SendGrid | Email delivery for contracts |
| Express.js | Backend API server |

---

## Project Architecture

```
techjob/
├── MobileRN/              # React Native mobile app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # App screens (auth, main)
│   │   ├── services/      # API service layer
│   │   ├── contexts/      # React Context (AuthContext)
│   │   ├── navigation/    # React Navigation setup
│   │   └── config/        # Supabase client config
│   ├── android/           # Android native code
│   └── ios/               # iOS native code
├── backend/               # Express.js API server
│   └── src/
│       ├── routes/        # API endpoints
│       ├── services/      # Business logic (Zoom, Email)
│       └── middleware/    # Auth middleware
└── supabase/              # Database configuration
```

---

## Critical: Zoom SDK Limitations & Setup

### The Problem: ARM64 Simulator Not Supported

**The Zoom Meeting SDK does NOT support ARM64 iOS simulators (Apple Silicon Macs).** This is one of the most important discoveries during development.

When trying to run on the iOS simulator with an M1/M2/M3 Mac, you will encounter build errors because:
- The Zoom SDK only provides binaries for `x86_64` architecture for simulators
- Apple Silicon Macs run ARM64 natively
- Rosetta 2 emulation is required but has limitations with native frameworks

### Solutions

#### Option 1: Run on Physical iPhone (Recommended)
```bash
# Connect your iPhone via USB
# Select your device in Xcode
cd MobileRN/ios && pod install && cd ../..
npx react-native run-ios --device "Your iPhone Name"
```

#### Option 2: Run Xcode in Rosetta Mode
1. Right-click on Xcode in Applications
2. Click "Get Info"
3. Check "Open using Rosetta"
4. Restart Xcode
5. Clean build folder (Cmd + Shift + K)
6. Run `pod install` again
7. Build and run

#### Option 3: Exclude Zoom SDK for Simulator Builds
For development without video features, you can conditionally exclude Zoom SDK in your Podfile for simulator builds (not recommended for final testing).

### Android Works on Emulator
Android emulators work fine with the Zoom SDK on both Intel and Apple Silicon Macs.

---

## Environment Variables

See `.env.example` files in each directory:
- `MobileRN/.env.example` - Mobile app configuration
- `backend/.env.example` - Backend server configuration

Copy each `.env.example` to `.env` and fill in your credentials.

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- CocoaPods (`sudo gem install cocoapods`)
- Physical iPhone for testing Zoom SDK (recommended)

### 1. Clone and Install Dependencies

```bash
# Install mobile app dependencies
cd MobileRN
cp .env.example .env  # Then edit with your credentials
npm install

# Install backend dependencies
cd ../backend
cp .env.example .env  # Then edit with your credentials
npm install
```

### 2. iOS Setup

```bash
cd MobileRN/ios

# Install CocoaPods dependencies
pod install

# If you encounter issues, try:
pod deintegrate
pod cache clean --all
pod install
```

**Important iOS Files Required:**
- `ios/MobileRN/GoogleService-Info.plist` - Firebase configuration (download from Firebase Console)

### 3. Android Setup

**Important Android Files Required:**
- `android/app/google-services.json` - Firebase configuration (download from Firebase Console)

The `build.gradle` files are already configured with:
- Zoom SDK dependency
- Jetpack Compose (required by Zoom SDK)
- Firebase/Google Play Services

### 4. Firebase Setup (Push Notifications)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Add iOS and Android apps to your project
3. Download and add:
   - `GoogleService-Info.plist` to `MobileRN/ios/MobileRN/`
   - `google-services.json` to `MobileRN/android/app/`
4. Get your FCM server key and add to backend `.env`

### 5. Zoom SDK Setup

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Create a **Meeting SDK** app:
   - Get SDK credentials (Client ID, Client Secret)
   - These are used to initialize the SDK on mobile devices
3. Create a **Server-to-Server OAuth** app:
   - Get S2S credentials (Account ID, Client ID, Client Secret)
   - These are used by the backend to create meetings via Zoom API
4. Configure webhook endpoint for meeting events (optional, for meeting status tracking)

### 6. Supabase Setup

1. Create a project at [Supabase](https://supabase.com)
2. Create the required tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'seller')),
  fcm_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoom_meeting_id TEXT NOT NULL,
  host_user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  password TEXT,
  join_url TEXT,
  start_time TIMESTAMPTZ,
  duration INTEGER DEFAULT 60,
  type TEXT DEFAULT 'instant' CHECK (type IN ('instant', 'scheduled')),
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'started', 'ended', 'cancelled')),
  zak_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Get your Supabase URL and keys from Project Settings > API

---

## Running the App

### Start the Backend Server

```bash
cd backend

# Development mode with hot reload
npm run dev

# For external access (needed for mobile), use ngrok:
ngrok http 3000
# Update BACKEND_SERVER_URL in MobileRN/.env with ngrok URL
```

### Start Metro Bundler

```bash
cd MobileRN
npm start
```

### Run on iOS (Physical Device Recommended)

```bash
# Connect iPhone via USB, then:
cd MobileRN
npx react-native run-ios --device

# Or open in Xcode and select your device:
open ios/MobileRN.xcworkspace
```

### Run on Android

```bash
cd MobileRN

# Start Android emulator first, then:
npx react-native run-android
```

---

## Features Implemented

### 1. Authentication (Supabase)
- Sign up / Login with email and password
- User roles: `client` (default) and `seller` (set manually in DB)
- Persistent sessions with AsyncStorage

### 2. Deeplink Handling
- App handles deeplinks in format: `DealFlow://join?meetingId=XXX&password=YYY`
- Auto-joins Zoom meeting when deeplink is opened

### 3. Embedded Zoom Meeting
- Full Zoom SDK integration within the app
- Video on/off, Audio mute/unmute
- Chat functionality
- Screen sharing
- Recording controls
- Host rejoining with ZAK token

### 4. Meeting Creation (Seller Only)
- Create instant or scheduled meetings
- Generate shareable deeplinks
- Advanced options: waiting room, join before host
- Meeting persistence in database

### 5. Send Contract Feature (Seller Only)
- "Send Contract" button during active meetings
- Sends contract link via email (SendGrid)
- Push notification to client (FCM)
- Links to Google Doc contract

---

## User Roles

| Role | Permissions |
|------|-------------|
| **Client** (default) | Join meetings via deeplink, receive contract notifications |
| **Seller** (manual) | Create meetings, send contracts during meetings |

To promote a user to seller, run in Supabase SQL Editor:
```sql
UPDATE users SET role = 'seller' WHERE email = 'user@email.com';
```

---

## API Endpoints

### Meeting Routes (`/meetings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meetings/jwt` | Get Zoom SDK JWT token |
| GET | `/meetings/zak` | Get ZAK token for host |
| POST | `/meetings` | Create new meeting (seller only) |
| GET | `/meetings?hostUserId=<id>` | List host's meetings |
| GET | `/meetings/:id` | Get meeting details |
| PATCH | `/meetings/:id/status` | Update meeting status |
| POST | `/meetings/webhook` | Zoom webhook handler |

### Contract Routes (`/contracts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contracts/send` | Send contract email to client |

---

## Troubleshooting

### Zoom SDK Build Errors on iOS Simulator
- **Solution**: Use a physical iPhone or run Xcode under Rosetta
- See "Critical: Zoom SDK Limitations" section above

### "No bundle URL present" on iOS
```bash
cd MobileRN/ios
pod deintegrate && pod install
cd ..
npx react-native start --reset-cache
```

### Android Build Fails
```bash
cd MobileRN/android
./gradlew clean
cd ..
npx react-native run-android
```

### FCM Token Not Registering
- Ensure `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) are in correct locations
- Check Firebase console for proper app configuration

### Meeting Creation Fails
- Verify Zoom S2S credentials in backend `.env`
- Check that ngrok URL is updated in mobile `.env`
- Verify user has `seller` role in database

---

## Third-Party Services Required

| Service | Purpose | Setup Link |
|---------|---------|------------|
| Supabase | Auth + Database | [supabase.com](https://supabase.com) |
| Zoom Marketplace | Meeting SDK + API | [marketplace.zoom.us](https://marketplace.zoom.us) |
| Firebase | Push Notifications | [console.firebase.google.com](https://console.firebase.google.com) |
| SendGrid | Email Delivery | [sendgrid.com](https://sendgrid.com) |
| ngrok | Local Backend Tunneling | [ngrok.com](https://ngrok.com) |
