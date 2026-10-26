# Digital Heroes

> A premium golf performance tracking, algorithmic jackpot prize draw, and transparent philanthropy platform.

Digital Heroes connects player performance with charitable impact. Members record their 5-score rolling history (using standard Stableford points from 1 to 45), automatically qualify for monthly jackpot prize draws, and route 10%–100% of their subscription fees directly to accredited partner charities.

---

## 🚀 Live Deployment

- **Live URL:** [https://digital-heros-hdd9.vercel.app/](https://digital-heros-hdd9.vercel.app/)
- **Admin Login:** [https://digital-heros-hdd9.vercel.app/login](https://digital-heros-hdd9.vercel.app/login)

---

## ⚡ Quick Test Credentials (Admin Panel)

To test the **Admin Command Center** without creating and configuring an admin account from scratch, use the seeded administrator credentials below:

| Field | Value |
| :--- | :--- |
| **Live App URL** | [https://digital-heros-hdd9.vercel.app/](https://digital-heros-hdd9.vercel.app/) |
| **Login Page** | [https://digital-heros-hdd9.vercel.app/login](https://digital-heros-hdd9.vercel.app/login) (or `/login` locally) |
| **Email** | `admin@digitalheroes.co.in` |
| **Password** | `AdminPassword123!` |
| **Role** | `admin` |
| **Access Rights** | Admin Command Center (`/admin`), Draw Simulation & Publishing, Winner Verification Queue, Real-time Platform Telemetry, and User View Switcher (`/dashboard`) |

> **Note:** If you are testing a fresh local database installation, run `npm run seed` in the `server` directory to inject this admin account and sample featured charities.

---

## ✨ Key Platform Features

### 🏌️‍♂️ 1. 5-Score Rolling History Engine
- Players log standard Stableford round scores (1–45 points) with match dates.
- The platform maintains a strict rolling window of the user's latest 5 verified performances.
- When a 6th score is submitted, the oldest score automatically drops off, ensuring entries always represent current performance.
- Inline point edits and date management with client and server boundary validations.

### 🎰 2. Monthly Jackpot Draws
- **Algorithmic Draw Strategy:** Frequency-weights the 5 draw balls (1–45) based on the statistical distribution of active subscriber scorecards.
- **Random Draw Strategy:** Uniform standard lottery distribution.
- **Tier Splits:**
  - **Tier 5 (5 Matches):** 40% of the prize pool + rollover amount.
  - **Tier 4 (4 Matches):** 35% of the prize pool.
  - **Tier 3 (3 Matches):** 25% of the prize pool.
- **Automatic Rollovers:** If no subscriber matches all 5 numbers, Tier 5 funds roll over into the next month's jackpot pool.

### 🤝 3. Direct Philanthropy & Charity Allocation
- Members select from verified foundation causes (e.g., Youth sports development, environmental conservation, global healthcare).
- A custom allocation slider lets subscribers designate between **10% and 100%** of their monthly dues directly to their chosen organization.

### 💳 4. Stripe Subscription Billing
- Automated recurring subscription checkout for **Monthly ($12/mo)** and **Annual ($120/yr - 16% savings)** memberships.
- Stripe dynamic `price_data` generation with optional custom Price ID override.
- Automated subscription status updates and lifecycle handling via Stripe Webhook listener.
- Resilient BFCache, tab focus, and cancellation parameter handling to eliminate frozen loading states.

### 🛡️ 5. Admin Command Center
- **Live Telemetry:** Tracks active subscribers, estimated prize pools, charity foundation pipeline totals, and verification queues.
- **Simulation Console:** Preview calculated winning numbers and prize splits prior to irreversible public publishing.
- **Audit Stream:** Review submitted winner scorecard screenshots with one-click **Approve** (marks paid) or **Reject** actions.
- **View Switcher:** Dedicated top-bar navigation toggle allowing administrators to alternate seamlessly between Command Center and subscriber User View.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **Core:** React 19, Vite
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **State Management:** Zustand
- **Routing:** React Router v7 (SPA with protected & admin-guarded route trees)
- **HTTP Client:** Axios (configured with credentials and dynamic environment base URLs)

### Backend (`server/`)
- **Runtime:** Node.js (ES Modules `"type": "module"`)
- **Framework:** Express 5
- **Database:** MongoDB Atlas via Mongoose
- **Payments:** Stripe SDK v23
- **File Storage:** Cloudinary via Multer memory storage
- **Security:** HTTP-only SameSite cookies, JWT, Bcrypt.js, Helmet, Express Mongo Sanitize, Express Rate Limit

---

## 📁 Repository Structure

```
digital-heroes/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets (including custom SVG favicon)
│   ├── src/
│   │   ├── components/ui/      # Minimalist, accessible UI components (Button, Input)
│   │   ├── config/             # Axios instance configuration
│   │   ├── features/           # Feature slices (Charity, Payment, Scores)
│   │   ├── layouts/            # Dashboard layout with role-based navigation switcher
│   │   ├── pages/              # Public Home, Auth, User Dashboard, Admin Command Center
│   │   ├── routes/             # ProtectedRoute and AdminRoute guards
│   │   └── store/              # Zustand global state stores
│   ├── index.html              # App entry with favicon & metadata
│   ├── vercel.json             # SPA routing rewrite rule for Vercel
│   └── package.json
│
├── server/                     # Node.js + Express 5 Backend
│   ├── api/                    # Vercel Serverless Function entry point (`index.js`)
│   ├── src/
│   │   ├── config/             # MongoDB connection caching & Cloudinary setup
│   │   ├── middleware/         # JWT auth, role guard, upload & rate-limit middleware
│   │   ├── modules/            # Domain modules (admin, charity, draw, payment, score, user)
│   │   ├── utils/              # Database seeder script
│   │   └── server.js           # Express app instance and middleware stack
│   ├── vercel.json             # Serverless rewrite rules for Vercel
│   └── package.json
│
└── README.md
```

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI (or local MongoDB)
- [Stripe Account](https://stripe.com) (Test keys)
- [Cloudinary Account](https://cloudinary.com) (Free tier credentials)

---

### Step 1: Backend Setup (`server/`)

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file inside `server/` (refer to `server/.env.example`):
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?appName=Cluster0

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Stripe Credentials
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Frontend Client URL
   CLIENT_URL=http://localhost:5173

   # Cloudinary Storage
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Environment
   NODE_ENV=development
   PORT=5000
   ```

3. Seed the database with sample charities and the Administrator account:
   ```bash
   npm run seed
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

---

### Step 2: Frontend Setup (`client/`)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file inside `client/` (refer to `client/.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client opens on `http://localhost:5173`.*

---

## 🌐 Deploying to Vercel

Both `client` and `server` include ready-to-deploy `vercel.json` configurations. For optimal performance, deploy them as **two separate projects** in the Vercel Dashboard connected to the same GitHub repository:

### 1. Server Project (Backend API)
1. In Vercel, select **Add New Project** $\rightarrow$ select the repository.
2. Under **Root Directory**, click **Edit** and set it to **`server`**.
3. Add the server environment variables in the project settings:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLIENT_URL` = `https://digital-heros-hdd9.vercel.app`
   - `NODE_ENV` = `production`
4. Click **Deploy**. Note the generated backend URL (e.g., `https://digital-heroes-api.vercel.app`).

### 2. Client Project (Frontend SPA)
1. In Vercel, select **Add New Project** $\rightarrow$ select the repository.
2. Under **Root Directory**, click **Edit** and set it to **`client`**.
3. Add the client environment variable:
   - `VITE_API_URL` = `https://<your-server-domain>.vercel.app/api`
4. Click **Deploy**.

### 3. Finalize Stripe Webhook
In your **Stripe Dashboard** (Developers $\rightarrow$ Webhooks), add your live webhook endpoint:
```
https://<your-server-domain>.vercel.app/api/payments/webhook
```
Select the events: `checkout.session.completed` and `customer.subscription.deleted`.

---

## 🔌 API Endpoint Reference

### Authentication (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Public | Register new user with regex-enforced password security |
| `POST` | `/api/users/login` | Public | Authenticate user & issue HTTP-only JWT cookie |
| `POST` | `/api/users/logout` | Public | Clear authentication cookie |
| `GET` | `/api/users/me` | Authenticated | Retrieve authenticated user profile |
| `PUT` | `/api/users/charity-preference` | Authenticated | Update designated charity ID and contribution percentage (10–100%) |

### Scores (`/api/scores`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/scores` | Subscriber | Submit Stableford score (1–45) and prune rolling history to 5 entries |
| `GET` | `/api/scores` | Subscriber | Fetch active 5-score rolling history |
| `PUT` | `/api/scores/:id` | Subscriber | Update points for an existing score entry |

### Prize Draws (`/api/draws`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/draws/my-winnings` | Subscriber | Retrieve published draw match results and claim status |
| `POST` | `/api/draws/:id/verify` | Subscriber | Upload scorecard proof screenshot via Cloudinary |
| `POST` | `/api/draws/simulate` | Admin Only | Calculate winning balls and projected prize pool distribution |
| `PUT` | `/api/draws/:id/publish` | Admin Only | Lock draw, evaluate subscriber matches, and publish results |

### Admin Console (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics` | Admin Only | Aggregate subscribers, estimated prize pool, charity totals |
| `GET` | `/api/admin/verifications` | Admin Only | Fetch pending winner scorecard proof queue |
| `PUT` | `/api/admin/verifications/:drawId` | Admin Only | Approve (mark paid) or reject winner submission |

### Charities (`/api/charities`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/charities` | Public | List all accredited charity partner organizations |
| `GET` | `/api/charities/featured` | Public | Retrieve spotlight partner organizations |
| `POST` | `/api/charities` | Admin Only | Create a new charity cause entry |

### Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-checkout-session` | Authenticated | Generate Stripe subscription checkout session URL |
| `POST` | `/api/payments/webhook` | Stripe Only | Listen to raw Stripe event payloads to activate/cancel memberships |

---

## 🔒 Security Best Practices Implemented

- **Password Rules:** Evaluated in real-time and enforced server-side requiring 8+ characters, uppercase, lowercase, numbers, and symbols.
- **Injection Protection:** `express-mongo-sanitize` strips `$` and `.` operators from request bodies, parameters, and query strings.
- **Serverless Resilience:** Database connection caching on `global.mongoose` prevents connection pool exhaustion during traffic spikes.
- **Rate Limiting:** Protects API routes against credential stuffing and brute-force attacks.
- **SameSite Cross-Origin Security:** Automatic conditional `SameSite=None; Secure` cookies in production environments ensure seamless authentication across separate frontend and backend deployments.

---

## 📄 License

This project is licensed under the ISC License.

