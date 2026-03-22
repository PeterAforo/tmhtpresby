# TMHTPresby Church Website — Mobile App Strategy Report

**Generated:** March 22, 2026  
**Project:** TMHTPresby Church Website  
**Primary Recommendation:** React Native with Expo  
**Secondary Recommendation:** Capacitor (PWA wrapper)

---

## 1. Executive Summary

The **TMHTPresby Church Website** is a comprehensive Next.js 16 web application for The Most Holy Trinity Presbyterian Church in Lashibi, Accra, Ghana. The application features member authentication, online giving via Stripe, sermon management, event scheduling, community discussions, and a full admin dashboard.

### Mobile App Recommendation

**Primary: React Native with Expo** — The web app uses React/Next.js with TypeScript, making React Native the natural choice for maximum code sharing, team skill reuse, and near-native performance. Expo simplifies builds, OTA updates, and native API access.

**Secondary: Capacitor** — For fastest time-to-market, the existing mobile-responsive web app could be wrapped with Capacitor to access native features (push notifications, camera) while sharing 100% of the web codebase.

### High-Level Timeline

| Phase | Duration | Milestone |
|-------|----------|-----------|
| Phase 0: Preparation | 1-2 weeks | Backend ready, project setup |
| Phase 1: Foundation | 2-3 weeks | Auth, navigation, design system |
| Phase 2: Core Features | 4-6 weeks | All main screens implemented |
| Phase 3: Polish | 2 weeks | Animations, offline, UX |
| Phase 4: Testing | 1-2 weeks | QA, beta testing |
| Phase 5: Launch | 1-2 weeks | App Store submission |
| **Total** | **11-17 weeks** | Production launch |

---

## 2. Web App Analysis Summary

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | TailwindCSS 4, GSAP, Framer Motion |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma 7.5 |
| Auth | NextAuth.js 5 (JWT sessions) |
| Payments | Stripe |
| Email | Resend |

### Feature Classification for Mobile

| Feature | Type | Mobile Relevance |
|---------|------|------------------|
| Sermons (watch/listen) | Requires API | ⭐ High |
| Online Giving | Requires API + Payment | ⭐ High |
| Events & RSVP | Requires API | ⭐ High |
| Community Discussions | Requires API | ⭐ High |
| Push Notifications | Requires Device Hardware | ⭐ High |
| Live Streaming | Requires API | ⭐ High |
| Member Directory | Requires API + Auth | Medium |
| Gallery | Requires API | Medium |
| Blog | Requires API | Medium |
| Contact Form | Requires API | Medium |
| Prayer Requests | Requires API | Medium |
| Admin Dashboard | Requires API + Auth | Low (web-only) |

### API Endpoints (21 Routes)

| Endpoint | Method | Auth | Mobile Ready |
|----------|--------|------|--------------|
| `/api/auth/[...nextauth]` | ALL | Public | ⚠️ Needs PKCE |
| `/api/auth/register` | POST | Public | ✅ Ready |
| `/api/contact` | POST | Public | ✅ Ready |
| `/api/newsletter` | POST | Public | ✅ Ready |
| `/api/prayer` | POST | Public | ✅ Ready |
| `/api/events/rsvp` | POST | Public | ✅ Ready |
| `/api/giving/checkout` | POST | Public | ✅ Ready |
| `/api/giving/webhook` | POST | Public | ✅ Ready |
| `/api/giving/history` | GET | Auth | ✅ Ready |
| `/api/sermons` | GET | Public | ⚠️ Needs pagination |
| `/api/community` | GET/POST | Auth | ⚠️ Needs pagination |
| `/api/community/[id]/replies` | GET/POST | Auth | ✅ Ready |
| `/api/notifications` | GET/PATCH | Auth | ✅ Ready |
| `/api/analytics` | POST | Public | ✅ Ready |

### Authentication Analysis

- **Current:** NextAuth.js 5 with JWT sessions
- **Providers:** Email/password credentials + Google OAuth
- **Token Storage:** HTTP-only cookies (web)
- **Mobile Requirement:** Token-based auth with secure storage

**⚠️ CRITICAL:** Apple Sign-In must be implemented for iOS App Store approval since Google OAuth is offered.

---

## 3. Technology Recommendation

### Ranking (Most to Least Recommended)

| Rank | Framework | Score | Reasoning |
|------|-----------|-------|-----------|
| 1 | **React Native + Expo** | ⭐⭐⭐⭐⭐ | Same language (TS), React patterns, Expo simplicity |
| 2 | Capacitor (PWA) | ⭐⭐⭐⭐ | Fastest path, 100% code sharing, but WebView limitations |
| 3 | Flutter | ⭐⭐⭐ | Great performance, but requires learning Dart |
| 4 | Kotlin Multiplatform | ⭐⭐ | Good for native UI, but complex setup |
| 5 | Native (Swift/Kotlin) | ⭐ | Best performance, but 2 codebases, highest cost |

### Primary Recommendation: React Native with Expo

**Justification:**

1. **Language Match:** Web app uses TypeScript/React — team already knows the stack
2. **Code Sharing:** Can share types, utilities, API client, validation logic
3. **Expo Benefits:** 
   - Managed workflow simplifies native builds
   - OTA updates via EAS Update
   - Built-in push notifications, camera, location APIs
   - No Xcode/Android Studio required for most features
4. **Community:** Largest cross-platform ecosystem, extensive documentation
5. **Performance:** Near-native for this app's complexity (no heavy graphics/AR)

### Secondary Recommendation: Capacitor

**When to choose instead:**

- Need app store presence within 2-4 weeks
- Budget is extremely limited
- Web app already fully mobile-responsive
- Performance requirements are modest

---

## 4. Architecture Blueprint

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                     │
├─────────────────────────────────────────────────────────────────┤
│  Screens → Components → Hooks → State (Zustand) → API Client    │
│                              ↓                                   │
│  Local Storage: expo-secure-store (tokens), MMKV (cache)        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                    EXISTING BACKEND (Next.js)                    │
├─────────────────────────────────────────────────────────────────┤
│  API Routes → Prisma ORM → PostgreSQL                           │
│       ↓              ↓              ↓                           │
│  NextAuth.js    Stripe SDK    Resend SDK                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  Firebase (FCM) │ Apple (APNs) │ Stripe │ Resend │ Google OAuth │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile App Structure

```
apps/mobile/
├── app/                      # Expo Router screens
│   ├── (auth)/              # Auth screens (login, register)
│   ├── (tabs)/              # Main tab navigator
│   │   ├── home/            # Home tab
│   │   ├── sermons/         # Sermons tab
│   │   ├── events/          # Events tab
│   │   ├── community/       # Community tab
│   │   └── more/            # More/settings tab
│   ├── give/                # Giving flow
│   ├── notifications/       # Notifications screen
│   └── profile/             # Profile screens
├── components/              # Reusable UI components
├── hooks/                   # Custom hooks
├── services/                # API client, auth service
├── stores/                  # Zustand stores
├── utils/                   # Utilities (shared with web)
├── constants/               # App constants
└── types/                   # TypeScript types (shared with web)
```

### Navigation Architecture

```
Root Navigator (Stack)
├── Splash Screen
├── Auth Navigator (Stack) [when not authenticated]
│   ├── Welcome
│   ├── Login
│   └── Register
└── Main Navigator (Tabs) [when authenticated]
    ├── Home Tab (Stack)
    │   ├── Home
    │   ├── Live Stream
    │   └── Prayer Request
    ├── Sermons Tab (Stack)
    │   ├── Sermon List
    │   ├── Sermon Detail
    │   └── Series List
    ├── Events Tab (Stack)
    │   ├── Event List
    │   └── Event Detail + RSVP
    ├── Community Tab (Stack)
    │   ├── Discussion List
    │   ├── Discussion Detail
    │   └── New Post
    └── More Tab (Stack)
        ├── Profile
        ├── Give
        ├── Notifications
        ├── Gallery
        ├── Blog
        ├── Contact
        └── Settings
```

---

## 5. API Readiness Audit

### Existing Endpoints Assessment

| Endpoint | Status | Issue | Fix Required |
|----------|--------|-------|--------------|
| `POST /api/auth/register` | ✅ READY | - | - |
| `GET /api/auth/[...nextauth]` | ⚠️ MODIFY | Cookie-based | Add PKCE flow |
| `GET /api/sermons` | ⚠️ MODIFY | No pagination | Add cursor pagination |
| `GET /api/community` | ⚠️ MODIFY | Limited to 50 | Add cursor pagination |
| `POST /api/giving/checkout` | ✅ READY | - | - |
| `GET /api/giving/history` | ✅ READY | - | - |
| `POST /api/events/rsvp` | ✅ READY | - | - |
| `GET /api/notifications` | ✅ READY | - | - |
| `PATCH /api/notifications` | ✅ READY | - | - |
| `POST /api/contact` | ✅ READY | - | - |
| `POST /api/prayer` | ✅ READY | - | - |
| `POST /api/newsletter` | ✅ READY | - | - |

### New Endpoints Required

| Endpoint | Method | Purpose | Priority |
|----------|--------|---------|----------|
| `/api/auth/refresh` | POST | Refresh access token | CRITICAL |
| `/api/auth/revoke` | POST | Revoke refresh token on logout | CRITICAL |
| `/api/auth/apple` | POST | Apple Sign-In verification | CRITICAL |
| `/api/devices/register` | POST | Register push notification token | CRITICAL |
| `/api/devices/unregister` | DELETE | Unregister device on logout | HIGH |
| `/api/users/me` | GET | Get current user profile | HIGH |
| `/api/users/me` | PATCH | Update user profile | HIGH |
| `/api/sermons` | GET | Add pagination params | HIGH |
| `/api/events` | GET | Public events list (mobile) | HIGH |
| `/api/devotionals/today` | GET | Get today's devotional | MEDIUM |
| `/api/gallery/albums` | GET | List albums for mobile | MEDIUM |

---

## 6. Authentication Strategy

### Mobile Auth Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │ ──▶ │  Backend    │ ──▶ │  Return     │
│   Screen    │     │  /auth/     │     │  Tokens     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                       │
       │                                       ▼
       │                              ┌─────────────┐
       │                              │  Store in   │
       │                              │  Keychain   │
       │                              └─────────────┘
       │                                       │
       ▼                                       ▼
┌─────────────┐                       ┌─────────────┐
│  Biometric  │ ◀──────────────────── │  Main App   │
│  Unlock     │                       │  Screens    │
└─────────────┘                       └─────────────┘
```

### Token Strategy

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access Token | Memory + Secure Store | 15 minutes | API authentication |
| Refresh Token | Secure Store (Keychain) | 30 days | Get new access token |
| Biometric Key | Secure Store | Permanent | Quick unlock |

### Social Login Requirements

| Provider | Implementation | App Store Requirement |
|----------|----------------|----------------------|
| Google | PKCE OAuth flow | Optional |
| Apple | Sign in with Apple SDK | **MANDATORY** (iOS) |

**⚠️ CRITICAL:** Apple Sign-In is **REQUIRED** for iOS App Store approval when any third-party social login (Google) is offered.

### Biometric Authentication

```typescript
// Flow: After initial login, offer to enable biometrics
1. User logs in with email/password or social
2. Prompt: "Enable Face ID for quick login?"
3. If yes: Store encrypted refresh token with biometric protection
4. Next app launch: Authenticate with biometrics → retrieve token → auto-login
```

---

## 7. Push Notification Architecture

### Notification Types

| Web Notification | Mobile Push Equivalent | Priority |
|------------------|----------------------|----------|
| New sermon posted | Push + deep link to sermon | High |
| Event reminder | Push + deep link to event | High |
| Donation receipt | Push + email | Medium |
| Community reply | Push + deep link to post | Medium |
| Prayer request response | Push notification | Medium |
| Campaign/announcement | Push broadcast | Low |

### Push Notification Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Backend    │ ──▶ │  Firebase   │ ──▶ │  Android    │
│  Trigger    │     │  FCM        │     │  Device     │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       └──────────▶ │  Apple      │ ──▶ iOS Device
                    │  APNs       │
                    └─────────────┘
```

### Notification Payload Schema

```json
{
  "title": "New Sermon Available",
  "body": "Watch 'Walking in Faith' by Rev. Mensah",
  "data": {
    "type": "sermon",
    "resource_id": "clx123abc",
    "deep_link": "/sermons/walking-in-faith",
    "action": "view"
  },
  "badge": 1,
  "sound": "default",
  "image": "https://example.com/sermon-thumbnail.jpg"
}
```

### Backend Requirements

1. **New Table:** `device_tokens`
   ```sql
   CREATE TABLE device_tokens (
     id TEXT PRIMARY KEY,
     user_id TEXT REFERENCES users(id),
     token TEXT UNIQUE NOT NULL,
     platform TEXT NOT NULL, -- 'ios' | 'android'
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **New Endpoints:**
   - `POST /api/devices/register` — Register FCM/APNs token
   - `DELETE /api/devices/unregister` — Remove token on logout

3. **Notification Service:**
   - Integrate Firebase Admin SDK
   - Send to FCM for Android, APNs for iOS
   - Handle token refresh and invalid tokens

---

## 8. Native Device Features Plan

### Required Features

| Feature | Use Case | Package | Permissions |
|---------|----------|---------|-------------|
| **Push Notifications** | Alerts, reminders | `expo-notifications` | iOS: Push, Android: POST_NOTIFICATIONS |
| **Camera** | Profile photo | `expo-image-picker` | iOS: NSCameraUsageDescription |
| **Photo Library** | Upload images | `expo-image-picker` | iOS: NSPhotoLibraryUsageDescription |
| **Biometrics** | Quick login | `expo-local-authentication` | iOS: NSFaceIDUsageDescription |
| **Secure Storage** | Token storage | `expo-secure-store` | None |
| **Deep Linking** | Open from notifications | `expo-linking` | None |
| **Share** | Share sermons, events | `expo-sharing` | None |
| **Haptics** | Feedback | `expo-haptics` | None |

### iOS Info.plist Strings

```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to take your profile photo.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to select your profile photo.</string>

<key>NSFaceIDUsageDescription</key>
<string>Use Face ID for quick and secure login.</string>
```

### Android Permissions

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 9. Offline Support Strategy

### Feature Classification

| Feature | Offline Mode | Strategy |
|---------|--------------|----------|
| Sermons List | CACHED_READ | Cache last 20 sermons |
| Sermon Detail | CACHED_READ | Cache viewed sermons |
| Events List | CACHED_READ | Cache upcoming events |
| Community Posts | CACHED_READ | Cache recent posts |
| Notifications | CACHED_READ | Cache notifications |
| Profile | CACHED_READ | Cache user profile |
| Giving | ONLINE_ONLY | Requires payment |
| RSVP | OFFLINE_WRITE | Queue and sync |
| New Post | OFFLINE_WRITE | Queue and sync |
| Prayer Request | OFFLINE_WRITE | Queue and sync |

### Local Storage Strategy

| Data Type | Storage | Library |
|-----------|---------|---------|
| Auth tokens | Encrypted | `expo-secure-store` |
| User preferences | Key-value | `MMKV` |
| Cached API data | Key-value | `MMKV` |
| Offline queue | Key-value | `MMKV` |
| Large datasets | SQLite | `expo-sqlite` + Drizzle |

### Sync Queue Pattern

```typescript
// When offline:
1. User submits prayer request
2. Save to local queue with timestamp
3. Show "Pending" indicator
4. When online: replay queue in order
5. On success: remove from queue, update UI
6. On failure: retry with exponential backoff
```

---

## 10. Shared Code Strategy

### Monorepo Structure

```
tmhtpresby/
├── apps/
│   ├── web/                 # Existing Next.js app
│   └── mobile/              # New React Native app
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utilities
│   ├── api-client/          # Shared API fetching logic
│   └── config/              # Shared constants
├── package.json             # Workspace root
├── turbo.json               # Turborepo config
└── pnpm-workspace.yaml      # PNPM workspaces
```

### Shareable Code

| Category | Files | Sharing Method |
|----------|-------|----------------|
| TypeScript Types | `types/*.ts` | `@tmhtpresby/types` package |
| Validation Schemas | `lib/validation.ts` | `@tmhtpresby/utils` package |
| Constants | `lib/constants.ts` | `@tmhtpresby/config` package |
| API Client | `lib/api-client.ts` | `@tmhtpresby/api-client` package |
| Formatters | `lib/utils.ts` | `@tmhtpresby/utils` package |

### Design Tokens

```typescript
// packages/config/tokens.ts
export const colors = {
  primary: '#3D4DB7',
  secondary: '#E31B23',
  accent: '#1B7340',
  // ... shared between web and mobile
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

---

## 11. Backend Modifications Required

### Authentication

| Change | Endpoint | Priority |
|--------|----------|----------|
| Add refresh token endpoint | `POST /api/auth/refresh` | CRITICAL |
| Add token revocation | `POST /api/auth/revoke` | CRITICAL |
| Add Apple Sign-In verification | `POST /api/auth/apple` | CRITICAL |
| Implement PKCE for Google OAuth | Modify NextAuth config | CRITICAL |

### Push Notifications

| Change | Details | Priority |
|--------|---------|----------|
| Add `device_tokens` table | Prisma schema update | CRITICAL |
| Add device registration endpoint | `POST /api/devices/register` | CRITICAL |
| Add device unregistration | `DELETE /api/devices/:token` | HIGH |
| Integrate Firebase Admin SDK | Backend service | HIGH |
| Update notification triggers | Add push alongside email | HIGH |

### API Enhancements

| Change | Details | Priority |
|--------|---------|----------|
| Add pagination to `/api/sermons` | Cursor-based | HIGH |
| Add pagination to `/api/community` | Cursor-based | HIGH |
| Add `/api/events` public endpoint | List upcoming events | HIGH |
| Add `/api/users/me` endpoint | Get/update profile | HIGH |
| Add `/api/devotionals/today` | Today's devotional | MEDIUM |

### Prisma Schema Addition

```prisma
model DeviceToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  platform  String   // 'ios' | 'android'
  createdAt DateTime @default(now())

  @@index([userId])
  @@map("device_tokens")
}
```

---

## 12. Recommended Tech Stack

### React Native + Expo Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | React Native + Expo SDK | 52+ |
| **Language** | TypeScript | 5.x |
| **Navigation** | Expo Router | 4.x |
| **State Management** | Zustand | 4.x |
| **Server State** | TanStack Query | 5.x |
| **API Client** | Axios | 1.x |
| **Secure Storage** | expo-secure-store | - |
| **Cache Storage** | MMKV | 2.x |
| **Styling** | NativeWind (Tailwind) | 4.x |
| **UI Components** | Custom + Gluestack UI | - |
| **Forms** | React Hook Form + Zod | - |
| **Push Notifications** | expo-notifications | - |
| **Analytics** | Firebase Analytics | - |
| **Crash Reporting** | Sentry | - |
| **OTA Updates** | EAS Update | - |
| **CI/CD** | EAS Build + GitHub Actions | - |

### Key Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-notifications": "~0.29.0",
    "expo-local-authentication": "~15.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-linking": "~7.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    "axios": "^1.7.0",
    "react-native-mmkv": "^2.12.0",
    "nativewind": "^4.0.0",
    "react-hook-form": "^7.53.0",
    "zod": "^3.23.0",
    "@sentry/react-native": "^5.0.0"
  }
}
```

---

## 13. App Store Requirements

### Apple App Store

| Requirement | Status | Action |
|-------------|--------|--------|
| Apple Developer Account ($99/year) | ❌ Needed | Register |
| App ID in Developer Portal | ❌ Needed | Create |
| Provisioning Profiles | ❌ Needed | Generate |
| App Store Connect record | ❌ Needed | Create |
| Privacy Policy URL | ✅ Exists | Use web URL |
| App Icon (1024x1024) | ❌ Needed | Design |
| Screenshots (all sizes) | ❌ Needed | Create |
| App Description | ❌ Needed | Write |
| **Sign in with Apple** | ❌ **CRITICAL** | Implement |
| Demo account for review | ❌ Needed | Create |

### Google Play Store

| Requirement | Status | Action |
|-------------|--------|--------|
| Play Developer Account ($25) | ❌ Needed | Register |
| App in Play Console | ❌ Needed | Create |
| Privacy Policy URL | ✅ Exists | Use web URL |
| Data Safety section | ❌ Needed | Complete |
| App Icon (512x512) | ❌ Needed | Design |
| Feature Graphic (1024x500) | ❌ Needed | Design |
| Screenshots | ❌ Needed | Create |
| Content Rating | ❌ Needed | Complete questionnaire |
| Target API Level | ❌ Needed | API 34+ |

---

## 14. Implementation Roadmap

### Phase 0: Preparation (1-2 weeks)

| Task | Effort | Owner |
|------|--------|-------|
| Register Apple Developer Account | 1 day | Admin |
| Register Google Play Developer Account | 1 day | Admin |
| Set up Firebase project | 2 hours | Dev |
| Add `device_tokens` table to Prisma | 1 hour | Dev |
| Implement `/api/auth/refresh` endpoint | 4 hours | Dev |
| Implement `/api/auth/apple` endpoint | 4 hours | Dev |
| Implement `/api/devices/register` endpoint | 2 hours | Dev |
| Add pagination to `/api/sermons` | 2 hours | Dev |
| Add pagination to `/api/community` | 2 hours | Dev |
| Set up monorepo with Turborepo | 4 hours | Dev |
| Extract shared types package | 2 hours | Dev |
| Initialize Expo project | 1 hour | Dev |
| Configure EAS Build | 2 hours | Dev |
| Set up Sentry for mobile | 1 hour | Dev |

### Phase 1: Foundation (2-3 weeks)

| Task | Effort |
|------|--------|
| Project structure setup | 4 hours |
| Design system (colors, typography, spacing) | 8 hours |
| API client with token refresh | 8 hours |
| Secure token storage | 4 hours |
| Login screen (email/password) | 8 hours |
| Google OAuth (PKCE) | 8 hours |
| Apple Sign-In | 8 hours |
| Biometric authentication | 4 hours |
| Registration flow | 8 hours |
| Forgot password flow | 4 hours |
| Auth state management | 4 hours |
| Logout with token revocation | 2 hours |
| Deep linking setup | 4 hours |
| Tab navigator setup | 4 hours |

### Phase 2: Core Features (4-6 weeks)

| Task | Effort |
|------|--------|
| Home screen | 8 hours |
| Sermons list (infinite scroll) | 8 hours |
| Sermon detail + video player | 8 hours |
| Sermon series list | 4 hours |
| Events list | 8 hours |
| Event detail + RSVP | 8 hours |
| Community posts list | 8 hours |
| Post detail + replies | 8 hours |
| New post screen | 4 hours |
| Giving flow (Stripe) | 12 hours |
| Donation history | 4 hours |
| Profile screen | 8 hours |
| Edit profile + photo upload | 8 hours |
| Notifications screen | 4 hours |
| Push notification setup | 8 hours |
| Notification tap handling | 4 hours |
| Live stream screen | 4 hours |
| Prayer request form | 4 hours |
| Contact form | 4 hours |
| Gallery screens | 8 hours |
| Blog screens | 8 hours |
| Settings screen | 4 hours |

### Phase 3: Polish (2 weeks)

| Task | Effort |
|------|--------|
| Skeleton loaders | 8 hours |
| Empty states | 4 hours |
| Error states + retry | 4 hours |
| Haptic feedback | 2 hours |
| Screen transitions | 4 hours |
| Splash screen | 2 hours |
| App icon finalization | 2 hours |
| Performance optimization | 8 hours |
| Accessibility audit | 8 hours |
| Dark mode support | 8 hours |
| Onboarding flow | 8 hours |
| App rating prompt | 2 hours |
| Offline banner | 2 hours |
| Pull-to-refresh | 4 hours |

### Phase 4: Testing (1-2 weeks)

| Task | Effort |
|------|--------|
| Unit tests (utilities) | 8 hours |
| Component tests | 8 hours |
| Integration tests (auth) | 8 hours |
| E2E tests (critical flows) | 16 hours |
| Physical device testing (iOS) | 8 hours |
| Physical device testing (Android) | 8 hours |
| Accessibility testing | 4 hours |
| Performance testing | 4 hours |
| Network testing (offline) | 4 hours |
| Push notification testing | 4 hours |
| Deep link testing | 4 hours |
| Beta testing (TestFlight + Internal) | 1 week |

### Phase 5: Launch (1-2 weeks)

| Task | Effort |
|------|--------|
| Production certificates (iOS) | 2 hours |
| Production keystore (Android) | 1 hour |
| Production build | 2 hours |
| App Store metadata | 4 hours |
| Play Store metadata + Data Safety | 4 hours |
| Screenshots creation | 8 hours |
| Submit to App Review | 1 hour |
| Submit to Play Review | 1 hour |
| Monitor post-launch | Ongoing |

---

## 15. Cost & Effort Estimate

### Project Classification: MEDIUM

- **Screens:** ~25 screens
- **Features:** Auth, payments, real-time, file uploads, push notifications
- **Complexity:** Moderate (no AR/VR, no complex offline sync)

### Time Estimates

| Team Size | Duration |
|-----------|----------|
| Solo Developer | 14-18 weeks |
| 2 Developers | 8-12 weeks |
| 3 Developers | 6-9 weeks |

### Recurring Costs

| Service | Cost |
|---------|------|
| Apple Developer Program | $99/year |
| Google Play Developer | $25 one-time |
| Firebase (Spark Plan) | Free |
| Expo EAS Build | Free tier / $29-99/month |
| Sentry | Free tier / $26+/month |
| OneSignal (optional) | Free up to 10K subscribers |

### Total Estimated Cost

| Item | Cost |
|------|------|
| Developer time (12 weeks × $50/hr × 40hr/week) | ~$24,000 |
| Apple Developer Account | $99 |
| Google Play Account | $25 |
| Design assets (icons, screenshots) | ~$500 |
| **Total (Year 1)** | **~$24,624** |

---

## 10 Immediate Next Steps

### This Week

1. **Register Apple Developer Account** — $99, takes 24-48 hours to approve
2. **Register Google Play Developer Account** — $25, instant approval
3. **Set up Firebase project** — Create project, enable FCM
4. **Add `DeviceToken` model to Prisma schema** — Run migration
5. **Implement `/api/auth/refresh` endpoint** — Required for mobile auth
6. **Implement `/api/devices/register` endpoint** — Required for push notifications
7. **Initialize Expo project** — `npx create-expo-app@latest`
8. **Configure EAS Build** — `eas build:configure`
9. **Set up monorepo structure** — Move web app, create shared packages
10. **Design app icon and splash screen** — 1024x1024 PNG

### Week 2

- Implement Apple Sign-In endpoint
- Implement Google OAuth with PKCE
- Build login and registration screens
- Set up secure token storage
- Configure push notifications

---

## Conclusion

The TMHTPresby Church Website is **well-positioned for mobile app development**. The existing React/TypeScript codebase, comprehensive API layer, and modern architecture make **React Native with Expo** the ideal choice for building connected Android and iOS apps.

**Key Success Factors:**

1. ✅ Same language and patterns as web app
2. ✅ Comprehensive API already exists
3. ✅ Authentication system in place (needs mobile adaptations)
4. ✅ Payment integration ready (Stripe)
5. ⚠️ Push notifications need backend work
6. ⚠️ Apple Sign-In required for App Store

**Estimated Timeline:** 11-17 weeks to production launch

**Recommended First Milestone:** MVP with auth, sermons, events, and push notifications (6-8 weeks)

---

*Report generated by Windsurf Mobile App Strategy Analysis*
