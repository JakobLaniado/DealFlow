# AI Prompts Documentation

This document outlines the key AI prompts used during development of the DealFlow app.

---

## Phase 1: Architecture & Planning

### Prompt 1: System Architecture Design
**Tool:** ChatGPT
**Prompt:**
```
I need to build a React Native app with embedded Zoom meetings. Users can be sellers
(create meetings, send contracts) or clients (join via deeplink).

Help me design:
1. Overall system architecture
2. Database schema for users and meetings
3. API structure for the backend
4. Authentication flow with Supabase
```
**Result:** Received a comprehensive architecture plan with clear separation between mobile app, backend API, and third-party services. Defined the database schema with users and meetings tables, and mapped out the API endpoints needed.

---

### Prompt 2: Zoom SDK Integration Strategy
**Tool:** ChatGPT
**Prompt:**
```
What's the difference between Zoom Meeting SDK and Zoom API?
I need to embed video calls inside a React Native app and also create meetings programmatically.
```
**Result:** Clarified that Meeting SDK is for embedding video UI in the app (client-side), while Server-to-Server OAuth is needed for creating meetings via API (server-side). This led to implementing both: SDK on mobile + S2S OAuth on backend.

---

## Phase 2: UI/UX Design

### Prompt 3: Screen Flow & UI Components
**Tool:** Gemini
**Prompt:**
```
Design a clean UI flow for a video meeting app with these screens:
- Login/Register
- Home (different views for client vs seller)
- Create Meeting form
- Join Meeting screen
- In-meeting controls

Keep it minimal and professional. Suggest color scheme and component structure.
```
**Result:** Generated UI mockup concepts and component hierarchy. Adopted a clean blue/white theme with card-based layouts for meeting information display.

---

### Prompt 4: Meeting Creation Form Design
**Tool:** Gemini
**Prompt:**
```
Design a meeting creation form with:
- Meeting type toggle (instant/scheduled)
- Title input
- Duration selector
- Date/time picker (for scheduled)
- Advanced options (collapsible)

Make it user-friendly and not overwhelming.
```
**Result:** Created a collapsible form design with progressive disclosure - basic options visible by default, advanced settings hidden until needed.

---

## Phase 3: Implementation

### Prompt 5: Zoom SDK React Native Setup
**Tool:** Claude Code
**Prompt:**
```
Help me integrate @zoom/meetingsdk-react-native in my React Native 0.83 app.
I need to:
1. Initialize SDK with JWT token
2. Join meetings as participant or host
3. Handle meeting events
```
**Result:** Generated ZoomProviderWrapper component with JWT fetching, activity readiness check for Android, and proper error handling. Discovered that Zoom SDK doesn't support ARM64 iOS simulators.

---

### Prompt 6: Backend Zoom Token Services
**Tool:** Claude Code
**Prompt:**
```
Create Express services for:
1. Generating Zoom SDK JWT tokens (for mobile SDK initialization)
2. Server-to-Server OAuth token management with caching
3. Creating Zoom meetings via API
4. Getting ZAK tokens for host rejoining
```
**Result:** Implemented three services:
- `zoomSdkJwt.service.ts` - JWT generation for SDK
- `zoomToken.service.ts` - S2S OAuth with token caching
- `meeting.service.ts` - Meeting CRUD with Zoom API integration

---

### Prompt 7: Deep Linking Setup
**Tool:** Claude Code
**Prompt:**
```
Configure deep linking for React Native app with scheme "DealFlow://".
Handle URLs like: DealFlow://join?meetingId=XXX&password=YYY
Auto-join the meeting when link is opened.
```
**Result:** Configured deep linking in AppNavigator with React Navigation's linking config. Added URL scheme to iOS Info.plist and Android manifest.

---

### Prompt 8: Push Notifications with FCM
**Tool:** Claude Code
**Prompt:**
```
Set up Firebase Cloud Messaging in React Native for receiving push notifications
when a contract is sent during a meeting.
```
**Result:** Integrated @react-native-firebase/messaging, configured iOS and Android native files, and set up notification handlers for foreground/background states.

---

### Prompt 9: Email Service with SendGrid
**Tool:** Claude Code
**Prompt:**
```
Create an email service using SendGrid to send contract links to clients.
Include meeting details and a deep link to rejoin the meeting.
```
**Result:** Built email.service.ts with HTML email templates, SendGrid integration, and deep link generation for the contract notification emails.

---

## Phase 4: Debugging & Optimization

### Prompt 10: Zoom SDK iOS Simulator Issue
**Tool:** Claude Code
**Prompt:**
```
Getting build errors when running on iOS simulator with M1 Mac:
"Building for iOS Simulator, but linking in object file built for iOS"
The Zoom SDK framework doesn't seem to support arm64 simulator.
```
**Result:** Discovered that Zoom Meeting SDK only provides x86_64 binaries for simulators. Solutions: use physical device, run Xcode in Rosetta, or exclude SDK for simulator builds.

---

### Prompt 11: Host Rejoin with ZAK Token
**Tool:** Claude Code
**Prompt:**
```
When the host leaves and rejoins a Zoom meeting, they join as participant instead of host.
How do I maintain host privileges when rejoining?
```
**Result:** Implemented ZAK (Zoom Access Key) token fetching from Zoom API. The ZAK token is passed when joining to authenticate as the original host.

---

### Prompt 12: Meeting Status Persistence
**Tool:** Claude Code
**Prompt:**
```
Meetings should track their status (created, started, ended, cancelled).
Set up Zoom webhooks to automatically update meeting status in database.
```
**Result:** Created webhook endpoint that handles meeting.started and meeting.ended events from Zoom, with proper webhook validation using secret token.

---

## Key Learnings

1. **Zoom SDK Architecture**: Requires both client-side SDK (for video UI) and server-side API (for meeting management)

2. **ARM64 Simulator Limitation**: Zoom SDK doesn't support Apple Silicon simulators - must test on physical devices

3. **Token Management**: Three different tokens needed:
   - SDK JWT (for initializing mobile SDK)
   - S2S OAuth (for backend API calls)
   - ZAK Token (for host authentication when rejoining)

4. **Deep Linking**: Essential for seamless meeting joins - users click link and go directly into meeting

5. **Webhook Events**: Crucial for keeping meeting status in sync with actual Zoom meeting state
