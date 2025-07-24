# 🚧 H2GO Backend – TODO List

_Last updated: 2025-07-23_

## ✅ Completed

_2025-07-05_
- [x] Project backbone: `tsconfig`, `.gitignore`, scripts, `.vscode`, etc.
- [x] MongoDB connection and env config
- [x] Dynamic recursive routing setup
- [x] Basic route/controller/service/repository for:
  - Users
  - Branches
  - Countries
- [x] ESLint & Prettier config
- [x] Logger setup for API and system logging
- [x] Global error-handling middleware
- [x] `ConfirmationToken` route/controller/service/repository
- [x] Auth login with ConfirmationToken OTP
_2025-07-24_
- [x] AccessToken & RefreshToken generation after login
- [x] Auth middleware to protect non-whitelisted routes
- [x] Auto-accessToken regeneration using refresh token
- [x] Password reset token via confirmation token (when expired)

---

## 🔄 In Progress

- [ ] ⏳ Forgot password token + flow

---

## 🔜 Next Up

### 🧠 Auth & Security
- [ ] `third_party_login_details` support for external auth integrations
- [ ] Role-based route protection via `user_type`
- [ ] Finalize secure, stateless auth strategy
- [ ] OTP/Password communication flow hardening

### 📬 Communication System
- [ ] Email sending:
  - [ ] Design `communication_request`, `communication_method`, `communication_type`, `communication_template` models
  - [ ] Use SMTP or external service (build 3rd party service module)
- [ ] SMS sending system (defer to later)
  - [ ] Modular SMS service architecture (3rd party)

---

## 🧱 Stage 1 – MVP Security & Communication (Core Backend)
> Goal: Fully secure, OTP/email-based login with token strategy and roles-based access

- [ ] Complete secure login, password reset, OTP auth
- [ ] Role-based route protection
- [ ] Fully working communication engine (email first)
- [ ] Solid error handling and logging for auth + communication

---

## 🛠 Stage 2 – Admin Dashboard Features

> Admin users must be able to:
- [ ] Manage all users, branches, roles
- [ ] Control communication templates/types
- [ ] View logs and audit events
- [ ] Setup driver routes and manage daily ops

---

## 🚚 Stage 3 – Driver Dashboard

> Drivers need:
- [ ] View daily delivery routes
- [ ] Receive real-time updates via sockets
- [ ] Push delivery updates back to admin:
  - [ ] ENROUTE
  - [ ] ARRIVED
  - [ ] CALLING CUSTOMER → SUCCESS / FAILED
  - [ ] DELIVERY COMPLETED / FAILED
  - [ ] Next delivery automatically starts
- [ ] Admin should be able to reprioritize and push route updates
- [ ] Full delivery audit trail and real-time tracking system

---

## 🧑‍💻 Stage 4 – Customer Dashboard

> Customers should:
- [ ] Log in and manage profile
- [ ] Add/update/delete delivery addresses
- [ ] Add special delivery instructions (gate codes, etc.)
- [ ] Set delivery preferences (e.g., container type, rental)
- [ ] View upcoming delivery schedules and history
- [ ] Track delivery status and payment status
- [ ] Receive push/email/SMS notifications

---

## 💳 Stage 5 – Finance & Payments

> Integrate payments:
- [ ] Customer card payments
- [ ] Auto-update delivery/payment statuses
- [ ] Admin tools to mark EFT/debit orders as paid
- [ ] Set up recurring debit order support

---

## 📊 Stage 6 – Analytics

> Build a dashboard to:
- [ ] Display delivery KPIs
- [ ] Track revenue, users, communication success, etc.
- [ ] Show real-time system stats (event-driven)

---

## 🚀 Stage 7 – Internal UAT

> Full internal test run
- [ ] Host MVP
- [ ] Use real data
- [ ] Feedback loop for bugs & flow adjustments

---

## 🧪 Stage 8 – Public Testing

> Controlled external testing
- [ ] Bug fixing sprint
- [ ] Stress testing with mock load

---

## ✅ Stage 9 – Final Product

> Final delivery & sales
- [ ] Polish and lock features
- [ ] Prepare documentation
- [ ] Begin sales demos

---

📝 *Keep this TODO.md updated as you progress.*
