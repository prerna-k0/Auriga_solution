# AI LOGS

## 1. Round 2 Builder Round

USER:
Round 2 — "Builder" Round (overview)

Round 2 is a hands-on, timed build round that assesses how a candidate approaches an open-ended, real-world problem end to end.

- Duration: 2.5 hours.
- The problem: Each candidate receives a short, real-world problem brief.
- AI tools: Candidates may freely use any AI assistant or tool.
- Tech stack: Candidates may use any language and framework.
- Environment: All coding is done online in GitHub Codespaces.

Every solution must include:
- A database
- REST APIs
- Usable UI
- User registration and login
- Search
- One-page landing page
- Pagination and sorting

Required files:
- README.md
- REASONING.md
- AI_LOGS.md

---

## 2. Initial Project Planning

USER:
Help me step by step building the solution dont go too long or deep.

AI:
We will build a simple Tiffin Subscription & Billing Management System using MERN.

The main user is the tiffin owner.

Core features:
1. Registration/Login
2. Add customer
3. Monthly subscription
4. Pause/resume
5. Monthly bill calculation
6. Search by phone
7. Active/Paused customers
8. Pagination and sorting

The core billing rule is:

Monthly plan → number of billable weekdays → served days → final bill.

---

## 3. Tiffin Problem Statement

USER:
The storyline:
A home-style tiffin service. Customers subscribe to a monthly plan and get lunch delivered every weekday. Life happens — they pause for a few days and shouldn’t be charged for paused days. At month-end the owner needs each customer’s bill.

AI:
The system should manage customers, subscriptions, pauses, deliveries and monthly billing.

The important workflow is:

Owner
→ Login
→ Add customer
→ Subscribe customer
→ Pause/resume service
→ Track deliveries
→ Generate monthly bill

---

## 4. Ledger-Based Architecture

USER:
Almost everyone will build this the obvious way: put an is_paused flag on the subscription, store pause date ranges, and at month-end loop over the calendar.

My approach inverts it: the system stores what happened, not what was requested.

The system stores one delivery_days row per billable day.

Each row has:
SCHEDULED
DELIVERED
PAUSED
HOLIDAY

A pause flips specific rows to PAUSED.

The bill becomes:

amount = count(status = DELIVERED) × per_day_rate

AI:
This ledger-based approach should be the central architecture.

The DeliveryDay ledger becomes the source of truth.

The design includes:
- Auditable billing
- Historical delivery records
- Pause handling
- Holiday handling
- Kitchen count
- Invoice snapshots

The main collections are:

users
customers
plans
subscriptions
pauses
delivery_days
holidays
invoices
invoice_lines

The unique constraint:

unique(subscription_id, date)

prevents duplicate ledger entries.

---

## 5. Project Phases

AI:
The project was divided into the following phases:

Phase 1 — Foundation and Database
- React
- Tailwind
- Node
- Express
- MongoDB
- JWT
- Database schemas

Phase 2 — Authentication
- Registration
- Login
- Password hashing
- JWT authentication

Phase 3 — Plans and Customers
- Create plans
- Create customers
- Customer lookup
- Search
- Pagination
- Sorting

Phase 4 — Subscription and Delivery Ledger
- Create subscription
- Generate weekday delivery records
- Maintain delivery status

Phase 5 — Pause and Resume
- Pause subscription
- Update ledger rows
- Resume subscription
- Store pause history

Phase 6 — Delivery and Kitchen Count
- View deliveries
- Mark deliveries as delivered
- Calculate kitchen count

Phase 7 — Invoice Generation
- Generate monthly invoice
- Count delivered days
- Create invoice lines
- Store billing information

Phase 8 — Frontend
- Landing page
- Login
- Dashboard
- Customer list
- Search
- Pagination
- Sorting

Phase 9 — Testing and Submission
- Test complete workflow
- README
- REASONING
- AI_LOGS
- GitHub push

---

## 6. UI Theme

USER:
Take this as the theme of the UI but do not need to make it too complex.

AI:
The UI will use a simple warm food-service aesthetic inspired by the reference.

Theme:
- Warm cream/beige background
- Dark coffee brown primary color
- Muted brown/terracotta accents
- White cards
- Rounded buttons
- Simple spacious layout

The UI will focus on usability rather than complex animations.

---

## 7. Codespaces Setup

AI:
The project is being developed in GitHub Codespaces.

Project structure:

Auriga_solution/
├── client/
└── server/

The frontend uses:
- React
- Vite
- Tailwind CSS
- Axios
- React Router

The backend uses:
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

---

## 8. Vite and Tailwind

USER:
npm list vite

client@0.0.0
@tailwindcss/vite@4.3.3
vite@8.3.0

AI:
The project uses Vite 8.3.0 and Tailwind CSS 4.3.3.

Tailwind v4 is configured through the Vite plugin.

The UI uses a warm cream and dark brown color palette.

---

## 9. Database Models

AI:
The following models were created:

User:
- name
- phone
- email
- password_hash
- role

Plan:
- name
- price_paise
- meals_per_day
- active

Customer:
- name
- phone
- address
- user_id

Subscription:
- customer_id
- plan_id
- start_date
- end_date
- status

DeliveryDay:
- subscription_id
- date
- status
- pause_id

Pause:
- subscription_id
- from_date
- to_date
- reason
- requested_at
- effective_from

Holiday:
- date
- label

Invoice:
- customer_id
- subscription_id
- month
- billable_days
- delivered_days
- paused_days
- rate_paise
- total_paise
- generated_at

InvoiceLine:
- invoice_id
- date
- status
- amount_paise

---

## 10. Authentication

AI:
Authentication was implemented using JWT.

Registration:
POST /api/auth/register

Login:
POST /api/auth/login

Passwords are hashed using bcryptjs.

A JWT token is generated after successful login and sent with protected API requests.

---

## 11. Customer and Plan APIs

AI:
Plan APIs:

GET /api/plans
POST /api/plans

Customer APIs:

POST /api/customers
GET /api/customers
GET /api/customers/lookup
GET /api/customers/:id

Customer listing supports:
- Search
- Pagination
- Sorting

Example:

GET /api/customers?q=9876&page=1&limit=10&sort=name&order=asc

---

## 12. Subscription and Ledger

AI:
When a subscription is created, the system automatically generates delivery-day records for the applicable weekdays.

Example:

September 2026:

Sept 1 → SCHEDULED
Sept 2 → SCHEDULED
Sept 3 → SCHEDULED
...

This creates the daily ledger that later drives billing and kitchen operations.

---

## 13. Pause and Resume

AI:
When a subscription is paused, the system creates a Pause record and changes the affected DeliveryDay records from SCHEDULED to PAUSED.

Example:

Sept 10 → PAUSED
Sept 11 → PAUSED
Sept 12 → PAUSED

The pause reason is also stored.

Resume changes the subscription back to ACTIVE.

---

## 14. Kitchen Count

USER:
Where should this route be added?

router.get("/kitchen/count", getKitchenCount);

AI:
Add it to:

server/routes/deliveryRoutes.js

The route should be placed before:

router.post("/:id/deliver", markDelivered);

The endpoint becomes:

GET /api/deliveries/kitchen/count?date=YYYY-MM-DD

The kitchen count is calculated from the delivery ledger.

---

## 15. Invoice Generation

AI:
Invoice generation reads the DeliveryDay ledger for the selected month.

It calculates:

Billable days
Delivered days
Paused days
Daily rate
Total amount

Only DELIVERED days contribute to the bill.

Invoice lines preserve the daily breakdown.

The endpoint is:

POST /api/invoices/generate

Example body:

{
  "month": "2026-09"
}

---

## 16. Frontend

AI:
The frontend contains:

Landing page
Login page
Dashboard

The dashboard includes:
- Customer search
- Customer list
- Pagination
- Sorting
- Kitchen overview

The frontend communicates with the backend using Axios.

---

## 17. Landing Page

AI:
The landing page communicates:

Product:
TiffinFlow

Purpose:
Tiffin subscription and billing management.

Key features:
- Daily Ledger
- Fair Billing
- Kitchen Count

Target users:
- Home-style tiffin owners
- Small lunch delivery businesses

Future features:
1. WhatsApp bill notifications
2. Online payments
3. Delivery-person management

---

## 18. Documentation

AI:
The repository must contain:

README.md
REASONING.md
AI_LOGS.md

README contains:
- Project overview
- Features
- Tech stack
- Setup instructions
- API endpoints
- Search
- Pagination
- Sorting
- Billing logic

REASONING contains:
- Technology choices
- System workflow
- Database design
- Ledger design
- Billing logic
- Testing
- Trade-offs
- Future improvements

AI_LOGS contains the complete AI conversation.

---

## 19. GitHub Submission

AI:
Before submission:

1. Check git status.
2. Ensure .env is not committed.
3. Ensure node_modules is not committed.
4. Add files.
5. Commit changes.
6. Push to main.
7. Ensure the repository is public.

Commands:

git add .
git commit -m "Build TiffinFlow application"
git push origin main

Final required files:

README.md
REASONING.md
AI_LOGS.md