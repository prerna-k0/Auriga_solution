# Auriga_solution
# TiffinFlow

TiffinFlow is a full-stack management system for home-style tiffin services. It helps owners manage customers, subscriptions, pauses, daily deliveries, kitchen planning, and transparent monthly billing.

## Problem

Tiffin customers are charged on a monthly plan, but they may pause their service for travel, festivals, or other reasons. The owner should only charge customers for the days they were actually served.

## Solution

TiffinFlow maintains a daily delivery ledger for every subscription.

Each billable weekday has one of four statuses:

- SCHEDULED
- DELIVERED
- PAUSED
- HOLIDAY

Monthly billing is based on the number of DELIVERED days.

## Features

- Owner registration and login
- JWT authentication
- Customer management
- Monthly subscription management
- Pause and resume subscriptions
- Daily delivery ledger
- Delivery status tracking
- Kitchen tiffin count
- Pro-rated monthly billing
- Invoice and invoice-line records
- Customer search by name or phone
- Pagination
- Sorting
- Holiday management

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs

### Database
- MongoDB
- Mongoose

## Project Structure

```text
Auriga_solution/
├── client/
├── server/
├── README.md
├── REASONING.md
└── AI_LOGS.md