# REASONING

## 1. Technology Choices

### Frontend — React.js + Tailwind CSS
React.js is used to build the interactive dashboard, customer management screens, subscription views, delivery tracking, and invoices.

Tailwind CSS is used for styling because it allows fast development of a clean and responsive UI. The design follows a warm cream and brown theme suitable for a home-style food service.

### Backend — Node.js + Express.js
Node.js with Express.js is used to build the REST API layer.

Express provides a lightweight structure for authentication, customer management, subscriptions, pauses, deliveries, and invoices.

### Database — MongoDB + Mongoose
MongoDB is used for persistent storage because the application contains multiple related business entities while still benefiting from a flexible document-based structure.

Mongoose is used for schemas, validation, references and database queries.

### Authentication — JWT + bcrypt
JWT is used to authenticate API requests and protect owner operations.

Passwords are hashed using bcrypt before being stored in the database.

### API Communication — Axios
Axios is used by the React frontend to communicate with the Express REST APIs.

---

## 2. System Workflow

The application follows this workflow:

Owner
→ Register/Login
→ Create a tiffin plan
→ Add customer
→ Create subscription
→ Generate daily delivery ledger
→ Manage pause/resume
→ Record deliveries
→ Generate monthly invoice

---

## 3. Subscription Workflow

When a customer subscribes to a plan, the system creates a subscription containing:

- Customer
- Plan
- Start date
- End date
- Subscription status

At the same time, the system creates `DeliveryDay` records for the applicable weekdays.

Each delivery day starts with:

`SCHEDULED`

---

## 4. Delivery Ledger

The `DeliveryDay` collection is the central part of the system.

Each record represents one expected delivery:

- SCHEDULED
- DELIVERED
- PAUSED
- HOLIDAY

The system records what actually happened instead of recalculating history from pause rules.

This makes the delivery history auditable and also allows the same data to be used for kitchen planning.

---

## 5. Pause / Resume Workflow

When an owner pauses a subscription, a pause record is created containing:

- Start date
- End date
- Reason
- Request time
- Effective date

The affected `DeliveryDay` records are changed from `SCHEDULED` to `PAUSED`.

When the subscription resumes, future delivery days can continue as scheduled.

This approach prevents billing from depending only on a pause-range calculation.

---

## 6. Billing Workflow

At month-end, the system reads the delivery ledger for that month.

Example:

Monthly plan = ₹3300

Billable weekdays = 22

Daily rate:

₹3300 / 22 = ₹150

If the customer received 19 deliveries:

19 × ₹150 = ₹2850

Only `DELIVERED` records contribute to the final bill.

The invoice stores the calculation values and invoice lines store the daily breakdown, making the bill easy to audit.

Money is stored in paise to avoid floating-point calculation problems.

---

## 7. Kitchen Workflow

The delivery ledger also provides the daily kitchen count.

For a selected date, the system checks the delivery records and identifies the number of tiffins that need to be prepared.

This gives the owner a practical operational view:

`Tomorrow → 47 tiffins to prepare`

Therefore, the ledger is useful for both billing and daily kitchen planning.

---

## 8. Search, Pagination and Sorting

Customer search is performed through the backend using name or phone number.

The customer list supports:

- Search
- Status filtering
- Pagination
- Sorting

Example:

`GET /api/customers?q=98&page=1&limit=10&sort=name&order=asc`

Pagination is handled server-side so the frontend does not need to load every customer at once.

---

## 9. Main Design Decision

The key architectural decision is to store daily delivery events rather than relying only on subscription and pause rules.

This provides:

- Transparent billing
- Auditable delivery history
- Easier pause and holiday handling
- Kitchen planning
- Protection against duplicate ledger records

The `unique(subscription_id, date)` constraint also prevents duplicate delivery-day entries.

---

## 10. Development Workflow

The application was developed in phases:

1. Set up React, Express and MongoDB.
2. Create database schemas.
3. Implement authentication.
4. Implement plans and customers.
5. Implement subscriptions and delivery-day generation.
6. Implement pause/resume.
7. Implement delivery tracking and kitchen count.
8. Implement invoice generation.
9. Implement search, pagination and sorting.
10. Build the frontend dashboard.
11. Test the complete customer-to-invoice workflow.
12. Document the APIs and setup instructions.

The implementation prioritizes the core subscription, pause/resume and billing workflow because these directly address the main business problem.