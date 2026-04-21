# Fixora Architecture Documentation

## Table of Contents
- [1. System Overview](#1-system-overview)
- [2. High-Level Architecture](#2-high-level-architecture)
- [3. Backend Architecture](#3-backend-architecture)
  - [3.1 Bootstrap and Middleware](#31-bootstrap-and-middleware)
  - [3.2 Auth and OTP Architecture](#32-auth-and-otp-architecture)
  - [3.3 External Integrations](#33-external-integrations)
  - [3.4 Route-to-Controller Map](#34-route-to-controller-map)
  - [3.5 Mongoose Schemas and Relationships](#35-mongoose-schemas-and-relationships)
  - [3.6 Chat/WebSocket + Persistence](#36-chatwebsocket--persistence)
  - [3.7 Problem/Request/Review/Location/Distance Flows](#37-problemrequestreviewlocationdistance-flows)
- [4. Frontend Architecture](#4-frontend-architecture)
  - [4.1 App Routing and Page Structure](#41-app-routing-and-page-structure)
  - [4.2 Context and State Management](#42-context-and-state-management)
  - [4.3 API Integration Patterns](#43-api-integration-patterns)
  - [4.4 Chat UI Flow](#44-chat-ui-flow)
  - [4.5 Maps, Reviews, Profile, i18n](#45-maps-reviews-profile-i18n)
- [5. Key User Journey Data Flows](#5-key-user-journey-data-flows)
- [6. ASCII Diagrams](#6-ascii-diagrams)
- [7. Environment Variables and External Services](#7-environment-variables-and-external-services)
- [8. Deployment Topology Recommendations](#8-deployment-topology-recommendations)
- [9. Risks / Limitations / Technical Debt](#9-risks--limitations--technical-debt)
- [10. Suggested Improvements (Prioritized)](#10-suggested-improvements-prioritized)
- [11. Assumptions and Uncertainties](#11-assumptions-and-uncertainties)

---

## 1. System Overview

Fixora is a full-stack repair marketplace with two roles:
- **User (customer)**: registers, verifies email OTP, posts problems with images, receives repairer offers, chats, reviews repairers.
- **Repairer**: registers, verifies email OTP, completes phone OTP profile setup, browses posted problems (with distance), sends offers, chats.

Core architecture:
- **Backend**: Node.js + Express + Mongoose + Socket.IO.
- **Frontend**: React (Vite), React Router, Context API, Axios, i18next, react-leaflet.
- **Database**: MongoDB.
- **External services**: Cloudinary, Twilio, Gmail (Nodemailer), Nominatim geocoding, Groq multimodal API.

---

## 2. High-Level Architecture

```text
+------------------------------+        HTTPS (REST + Cookies)       +------------------------------+
|          Frontend            |  <--------------------------------> |           Backend             |
|  React + Vite + Router       |                                      |  Express + Controllers       |
|  Context + i18n + Socket.io  |                                      |  Auth MW + Socket.IO         |
+---------------+--------------+                                      +---------------+--------------+
                |                                                                     |
                | WebSocket (cookie-auth via JWT)                                     |
                +---------------------------------------------------------------------+
                                                                                      |
                                                                                      v
                                                                        +------------------------------+
                                                                        |           MongoDB            |
                                                                        | Account, User, Repairer      |
                                                                        | ChatThread, ChatMessage      |
                                                                        +------------------------------+

External calls from Backend:
  - Cloudinary (image upload)
  - Twilio (SMS OTP)
  - Gmail SMTP (email OTP)
  - Nominatim OSM (address -> coordinates)
  - Groq (image + prompt -> rewritten problem description)
```

---

## 3. Backend Architecture

### 3.1 Bootstrap and Middleware

`Backend/server.js`:
- Loads env (`dotenv.config()`), connects MongoDB, configures Cloudinary.
- Creates Express app and HTTP server.
- Applies middleware:
  - `cors({ origin: "http://localhost:5173", credentials: true })`
  - `express.json()`
  - `cookieParser()`
- Mounts routers:
  - `/api/user`
  - `/api/product`
  - `/api/repairer`
  - `/api/chat`
- Creates Socket.IO server on same HTTP server and registers chat handlers.

Auth middleware:
- `AuthMiddleware`: requires cookie `token`, verifies JWT, sets `req.accountId`.
- `OptionalAuthMiddleware`: tries JWT if present; otherwise continues without user context.

File upload middleware:
- `Multer` disk storage with filename=`file.originalname`.

---

### 3.2 Auth and OTP Architecture

#### JWT session model
- JWT created with `{ id: accountId }`, 7-day expiry.
- Sent in `token` cookie (`httpOnly`, `sameSite:lax`, `secure:false` currently in code).

#### User auth flow
- Register (`/api/user/register`) creates:
  - `Account` (`role` from request, `isVerified=false`, OTP + expiry)
  - `User` profile (address geocoded to lat/lng)
- Verify OTP (`/api/user/otpverify`) sets `Account.isVerified=true`.
- Login (`/api/user/Login`) sets JWT cookie.

#### Repairer auth/onboarding flow
- Register (`/api/repairer/register`) creates repairer account with email OTP.
- Verify email OTP (`/api/repairer/verifyRepairer-otp`) sets verified + JWT cookie.
- Send phone OTP (`/api/repairer/profile/send-phone-otp`):
  - validates profile data
  - geocodes profile address
  - uploads shop image to Cloudinary
  - stores normalized profile in `Account.pendingRepairerProfile`
  - sends Twilio OTP and stores `phoneOtp + phoneOtpExpire`
- Verify phone OTP (`/api/repairer/profile/verify-phone-otp`):
  - creates/updates `Repairer` profile with `isPhoneVerified=true`
  - clears pending OTP/profile fields from `Account`

---

### 3.3 External Integrations

1. **Nominatim geocoding (axios)**
   - Used during user registration, repairer profile normalization, and problem geocode backfill.
   - Endpoint: `https://nominatim.openstreetmap.org/search`.

2. **Cloudinary**
   - Problem images uploaded in `HandleProblems`.
   - Repairer shop image uploaded in `sendRepairerPhoneOTP` / `updateRepairerProfile`.
   - Repairer image upload path includes folder `fixora/repairer-shops`.

3. **Twilio SMS**
   - `sendPhoneOTP` in `Utils/SmsSender.js`.
   - Supports `TWILIO_PHONE_NUMBER` or `TWILIO_MESSAGING_SERVICE_SID`.
   - Normalizes phone to E.164 (defaults +91 for 10-digit input).

4. **Email OTP**
   - Nodemailer Gmail transporter in `Utils/Mailer.js`.

5. **Groq AI**
   - `POST /api/product/analyze`
   - Model: `meta-llama/llama-4-scout-17b-16e-instruct`
   - Sends one user message with:
     - text prompt
     - base64 `image_url` attachment (`data:image/jpeg;base64,...`)
   - Returns one rewritten paragraph in first person style.

---

### 3.4 Route-to-Controller Map

#### User routes (`Routes/UserRoutes.js`)

| Route | Method | Controller |
|---|---|---|
| `/api/user/Login` | POST | `UserSignIn` |
| `/api/user/register` | POST | `UserRegister` |
| `/api/user/otpverify` | POST | `veryfiyingtheotptrhroughregistration` |
| `/api/user/logout` | POST | `Singout` |
| `/api/user/me` | GET | `Getme` (AuthMiddleware) |
| `/api/user/language` | PATCH | `updatePreferredLanguage` (AuthMiddleware) |
| `/api/user/delete` | DELETE | `Deleteuser` |

#### Repairer routes (`Routes/RepairerRoutes.js`)

| Route | Method | Controller |
|---|---|---|
| `/api/repairer/register` | POST | `registerRepairer` |
| `/api/repairer/verifyRepairer-otp` | POST | `verifyOTP` |
| `/api/repairer/repairerlogin` | POST | `repairerLogin` |
| `/api/repairer/profile/send-phone-otp` | POST | `sendRepairerPhoneOTP` (Auth + multer) |
| `/api/repairer/profile/verify-phone-otp` | POST | `verifyRepairerPhoneOTP` (Auth) |
| `/api/repairer/profile` | PUT | `updateRepairerProfile` (Auth + multer) |
| `/api/repairer/public` | GET | `getPublicRepairers` (OptionalAuth) |
| `/api/repairer/public/:id` | GET | `getPublicRepairerById` (OptionalAuth) |
| `/api/repairer/public/:id/reviews` | POST | `submitRepairerReview` (Auth) |

#### Product routes (`Routes/ProductRoutes.js`)

| Route | Method | Controller |
|---|---|---|
| `/api/product/post` | POST | `HandleProblems` (Auth + 3 images) |
| `/api/product/analyze` | POST | `analyzeProblem` (Auth + up to 3 images) |
| `/api/product/all-problems` | GET | `getAllPostedProblems` (Auth) |
| `/api/product/problems/:problemId/request` | POST | `createRepairRequest` (Auth) |

#### Chat routes (`Routes/ChatRoutes.js`)

| Route | Method | Controller |
|---|---|---|
| `/api/chat/inbox` | GET | `getChatInbox` (Auth) |
| `/api/chat/threads/:threadId/messages` | GET | `getThreadMessages` (Auth) |
| `/api/chat/threads/bootstrap` | POST | `bootstrapThread` (Auth) |

---

### 3.5 Mongoose Schemas and Relationships

## Collections overview

```text
+----------------+        1 ------ many        +------------------+
| Account        |---------------------------->| User             |
| (_id)          | accountId                   | accountId ref     |
+----------------+                             | PostData[] (embedded problems)
       |                                       +------------------+
       |
       | 1 ------ 1
       +---------------------------> +------------------+
                                     | Repairer         |
                                     | accountId unique |
                                     | location Point   |
                                     | reviews[]        |
                                     +------------------+

Chat domain:
Account(user) + Account(repairer) + problemId => unique ChatThread
ChatThread 1 ------ many ChatMessage
```

### `Account` (`AccountNeuralschema.js`)
- `email` (unique), `password`
- `otp`, `otpExpire` (email verification)
- `phoneOtp`, `phoneOtpExpire`, `pendingRepairerProfile` (repairer onboarding)
- `isVerified`, `role`, `preferredLanguage`

### `User` (`userNeuralSchema.js`)
- `accountId` (ref Account)
- `username`, `address`
- `location.latitude`, `location.longitude`
- `PostData: [Object]` (embedded problem documents + repairRequests array)

### `Repairer` (`RepairerNeuralSchema.js`)
- `accountId` (unique ref Account)
- profile fields: username, phones, shop details, skills, experience
- `location` GeoJSON Point (`coordinates: [lng, lat]`) with `2dsphere` index
- `isPhoneVerified`, `availability`, `status`
- review aggregate fields: `rating`, `totalReviews`
- `reviews[]` subdocuments with reviewer accountId, name, rating, text

### `ChatThread` (`ChatThreadSchema.js`)
- `userAccountId`, `repairerAccountId`, `problemId`
- unique compound index: `(userAccountId, repairerAccountId, problemId)`
- `participants[]`, `unread.user`, `unread.repairer`
- `lastMessage`, `lastMessageAt`

### `ChatMessage` (`ChatMessageSchema.js`)
- `threadId`, `senderAccountId`, `senderRole`, `text`, `kind`, `readBy[]`
- index `(threadId, createdAt)`
- `kind` enum: `text | offer | system`

### `problem` (`ProblemNeuralSchema.js`)
- Separate schema exists, but current active flow stores problems inside `User.PostData`.
- This model appears unused by current controllers/routes.

---

### 3.6 Chat/WebSocket + Persistence

Socket setup (`Sockets/ChatSocket.js`):
- Socket middleware parses cookies manually from handshake header.
- Verifies JWT and account role (`user`/`repairer`).
- On connect, joins room `account:<accountId>`.

Socket events:
- `chat:join-thread`
  - validates thread ownership by role
  - joins room `thread:<threadId>`
  - marks incoming messages read, resets unread for current role
  - emits `chat:thread-updated` to both account rooms
- `chat:send-message`
  - validates access and length <= 2000
  - inserts `ChatMessage`
  - updates `ChatThread.lastMessage`, unread counters
  - emits:
    - `chat:new-message` to thread room
    - `chat:thread-updated` to account rooms

REST + Socket bootstrap behavior:
- On repairer offer creation, backend `createRepairRequest` calls `upsertChatForRepairRequest`:
  - creates thread if missing
  - creates initial `offer` message
  - emits update/new-message immediately
- Frontend `/chats` can also call `/api/chat/threads/bootstrap` if URL contains `with` + `problemId`.

---

### 3.7 Problem/Request/Review/Location/Distance Flows

#### Problem posting (`HandleProblems`)
- Requires 3 images and all required fields.
- Uploads images to Cloudinary.
- Geocodes city/state/pincode (if possible).
- Pushes embedded object into `User.PostData` with `problemId`, metadata, image URLs, empty `repairRequests`.

#### Repairer problem feed (`getAllPostedProblems`)
- Role must be repairer and phone-verified profile.
- Iterates all users’ `PostData`.
- Backfills missing `problemId`.
- Attempts geocoding if problem coordinates missing.
- Computes `distanceFromRepairerKm` using repairer and customer/problem coordinates.
- Returns flattened problem cards.

#### Repair request (`createRepairRequest`)
- Only repairer with verified profile can request.
- Finds target problem by `problemId` inside users.
- Prevents duplicate request per repairer/problem.
- Appends request object to `repairRequests`.
- Upserts chat thread and inserts first offer message.

#### Review flow (`submitRepairerReview`)
- Only users can review.
- Upsert/update one review per reviewer.
- Recalculates `totalReviews` and average `rating` each save.

#### Distance use cases
- `getPublicRepairers` and `getPublicRepairerById`: if authenticated user viewer exists, computes `distanceFromUserKm`.
- `getAllPostedProblems`: computes `distanceFromRepairerKm`.

---

## 4. Frontend Architecture

### 4.1 App Routing and Page Structure

`src/App.jsx` routes:
- `/` -> `MainHero`
- `/login` -> `Login` (wrapped by login guard)
- `/repairerlogin` -> `RepairerLogin`
- `/otp` -> user OTP page
- `/otprepairer` -> repairer email OTP page
- `/repairer/account` -> repairer onboarding/update page
- `/profile/:id` -> customer profile dashboard
- `/listofrepairers` -> public repairer directory
- `/problems` -> problems listing page (different behavior by role)
- `/addproblems` -> create problem
- `/repairerProfile/:id` -> repairer detail + reviews
- `/chats` -> inbox + thread view
- `/about` -> about page

`App.jsx` also includes many client-side redirects based on `role` and `canApproachCustomers`.

---

### 4.2 Context and State Management

`src/Context/ALlContext.jsx` (`RepairContext`) stores:
- auth/session/user context (`user`, `role`, `profileId`, verification flags)
- `repairRequestss` (formatted local problem list)
- language state (`preferredLanguage`) and update method
- `refreshUserInfo()`:
  - calls `/api/user/me`
  - updates role/profile flags
  - maps `PostData` into frontend card format
  - syncs language from server/local storage and may PATCH `/api/user/language`

---

### 4.3 API Integration Patterns

- Axios used directly inside components (no dedicated API service layer).
- Base URL from `VITE_BACKEND_URL`.
- Authenticated calls use `withCredentials: true`.
- API usage appears in:
  - login/register/otp pages
  - problem posting + AI assist page
  - problem feed/request submit page
  - repairer public list/profile/review pages
  - chat inbox/messages/bootstrap
  - profile/logout/delete and language updates

---

### 4.4 Chat UI Flow

`src/pages/Chats.jsx`:
- Loads inbox via `/api/chat/inbox`.
- Selects thread by query params (`with`, `problemId`) or first thread.
- If needed, bootstraps thread via `/api/chat/threads/bootstrap`.
- Loads messages via `/api/chat/threads/:threadId/messages`.
- Connects socket (`socket.io-client`) to backend origin derived from env URL.
- Emits:
  - `chat:join-thread`
  - `chat:send-message`
- Listens:
  - `chat:new-message`
  - `chat:thread-updated`

---

### 4.5 Maps, Reviews, Profile, i18n

- **Maps**:
  - `GeoMap.jsx` uses leaflet + OSM tiles.
  - Receives points from `Problems.jsx` (customer locations) and `Listofrepairers.jsx` (repairer locations).
  - Handles duplicate coordinates by offsetting markers.
- **Reviews**:
  - `RepairerProfile.jsx` POSTs `/api/repairer/public/:id/reviews`.
  - Updates local rating/review list from response.
- **Profile flows**:
  - `Profile.jsx` shows posted problems + responses modal (`Request.jsx`) and “Open Chat” deep-links.
- **i18n / multilingual**:
  - `i18n.js` defines many Indian language codes and translation resources/fallback mappings.
  - `LanguageSelector` updates context language.
  - Context persists language in localStorage and syncs to backend `/api/user/language`.
  - `document.dir` set to RTL for Urdu.

---

## 5. Key User Journey Data Flows

### 5.1 Signup / Login / OTP

```text
User Register UI
  -> POST /api/user/register
     -> Account(otp,isVerified=false) + User(location)
     -> email OTP sent
  -> POST /api/user/otpverify
     -> Account.isVerified=true
  -> POST /api/user/Login
     -> token cookie
  -> GET /api/user/me
     -> context hydrated in frontend
```

```text
Repairer Register UI
  -> POST /api/repairer/register
     -> Account(role=repairer, otp)
  -> POST /api/repairer/verifyRepairer-otp
     -> Account.isVerified=true + token cookie
  -> POST /api/repairer/profile/send-phone-otp (multipart)
     -> validate + geocode + Cloudinary upload
     -> pending profile in Account + SMS OTP
  -> POST /api/repairer/profile/verify-phone-otp
     -> Repairer profile created/updated (isPhoneVerified=true)
```

### 5.2 Post problem -> request -> chat bootstrap -> realtime chat

```text
Customer AddProblems
  -> POST /api/product/post (3 images + details)
     -> upload images + save in User.PostData[]

Repairer Problems page
  -> GET /api/product/all-problems
  -> POST /api/product/problems/:problemId/request (offerMessage)
     -> append repairRequests[]
     -> upsert ChatThread + create first offer ChatMessage
     -> emit socket updates

Customer/Repairer opens chat
  -> GET /api/chat/inbox
  -> (optional) POST /api/chat/threads/bootstrap
  -> GET /api/chat/threads/:id/messages
  -> socket join/send/receive live updates
```

### 5.3 Review submission and aggregate rating updates

```text
Repairer profile page
  -> POST /api/repairer/public/:id/reviews {rating, review}
     -> upsert reviewer's entry
     -> recompute average + total count
     -> return updated aggregate + reviews[]
```

### 5.4 Map and distance computation behavior

```text
Address (user/repairer/problem)
   -> geocoded to coordinates
   -> distances computed via Haversine utility
      - distanceFromUserKm (repairer list detail)
      - distanceFromRepairerKm (problem feed for repairer)
   -> displayed in cards + map markers
```

---

## 6. ASCII Diagrams

### 6.1 Request lifecycle (REST)

```text
Client Request
   |
   v
[Express Route] -> [Auth MW?] -> [Multer?] -> [Controller]
                                             |
                                             +--> [Mongoose Models]
                                             +--> [External APIs]
                                             +--> [Socket emit (if chat-related)]
   |
   v
JSON Response (+ cookie on auth endpoints)
```

### 6.2 Chat event flow (REST + Socket.IO)

```text
Repairer sends offer (REST)
  POST /api/product/problems/:problemId/request
      |
      +-> save repairRequests[] in User.PostData
      +-> upsert ChatThread
      +-> create ChatMessage(kind=offer)
      +-> emit thread-updated/new-message

User opens /chats (REST + Socket)
  GET /api/chat/inbox
  GET /api/chat/threads/:id/messages
  socket connect (cookie auth) -> join account room
  emit chat:join-thread -> join thread room
  emit chat:send-message -> persist + broadcast
```

### 6.3 Database collections summary table

```text
+----------------+-------------------------------+---------------------------------------------+
| Collection     | Key Identity                  | Main Purpose                                 |
+----------------+-------------------------------+---------------------------------------------+
| Account        | _id, email(unique)            | Auth, role, OTP state, language preference   |
| User           | accountId(ref Account)        | Customer profile + embedded PostData[]       |
| Repairer       | accountId(unique ref Account) | Repairer profile, geo point, reviews         |
| ChatThread     | unique(user,repairer,problem) | Conversation metadata + unread counters       |
| ChatMessage    | threadId(ref ChatThread)      | Message log with read receipts               |
| problem        | problemNumber/userId...       | Legacy/unused schema in current flow         |
+----------------+-------------------------------+---------------------------------------------+
```

---

## 7. Environment Variables and External Services

### Backend env variables referenced in code
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GROQ_API_KEY`
- `EMAIL_USER`
- `EMAIL_PASS`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER` (optional if service SID used)
- `TWILIO_MESSAGING_SERVICE_SID` (optional alternative)
- `port` (lowercase usage in code)

### Frontend env variables
- `VITE_BACKEND_URL`

---

## 8. Deployment Topology Recommendations

Recommended production topology:

```text
[CDN] -> [Frontend static build]
               |
               v
        [API Gateway / Reverse Proxy]
               |
        +------+---------------------+
        |                            |
  [Express App + Socket.IO]   [Optional background workers]
        |
   [MongoDB Atlas/Cluster]
        |
  External: Twilio, Cloudinary, SMTP, Nominatim, Groq
```

Practical recommendations:
1. Make CORS/socket origins env-driven (not hardcoded localhost).
2. Set secure cookie flags for HTTPS production.
3. Add reverse proxy support and health checks.
4. If scaling Socket.IO horizontally, add shared adapter (e.g., Redis).

---

## 9. Risks / Limitations / Technical Debt

1. **Hardcoded origins** in backend CORS + Socket.IO (`http://localhost:5173`).
2. **Cookie security** currently uses `secure:false`.
3. **Problem schema mismatch**:
   - active flow uses `User.PostData` embedded objects,
   - separate `problem` model exists but appears unused.
4. **Potential temp-file leak**:
   - repairer image flow cleans files,
   - problem upload path does not explicitly unlink local files after Cloudinary upload.
5. **No visible rate-limiting** for OTP/login/request abuse.
6. **Route casing inconsistency**:
   - backend route `/Login` (capital L) vs frontend calling `/login` in one place.
7. **Frontend skill options mismatch**:
   - UI offers many custom skills, backend currently validates only:
     `electrician, plumber, carpenter, mechanic, ac_repair`.
8. **Potential path typo/dead code**:
   - two similarly named protected route files, one appears mis-cased/misaligned and unused.
9. **No tests configured in backend scripts** (`"test": ... no test specified`).

---

## 10. Suggested Improvements (Prioritized)

### P0 (High priority)
1. Secure auth/session:
   - env-driven cookie flags + CORS.
2. Add request throttling/rate limits for auth and OTP endpoints.
3. Fix route casing consistency (`/Login` vs `/login`).
4. Align repairer skill enum between frontend and backend.

### P1 (Near-term)
1. Extract problems into dedicated collection for scalability/query/indexing.
2. Add centralized frontend API client layer.
3. Add validation/schema library for request bodies.
4. Add automated tests for auth, OTP, chat, repair-request, review flows.

### P2 (Medium-term)
1. Socket.IO horizontal scaling strategy (Redis adapter).
2. Cleanup dead/legacy files and naming inconsistencies.
3. Improve observability (structured logs, tracing, metrics).

---

## 11. Assumptions and Uncertainties

1. **Assumption**: `ProblemNeuralSchema` is legacy/unused because active controllers use `User.PostData` for problem lifecycle.
2. **Assumption**: Production infrastructure is not present in repo; deployment recommendations are inferred from app behavior.
3. **Uncertainty**: Some frontend files are heavily UI-focused and large; architecture details documented here focus on behavior-impacting logic and data paths.
4. **Uncertainty**: No explicit approval workflow exists for repair requests, but error text references “approved chat relationship”; current code checks existence of request entry, not explicit approved status.

