# OFIS Admin Dashboard Handover Document

This document explains how the dedicated OFIS administrative dashboard operates, how to deploy it on Render, how to verify it, and the known gaps that require action outside the code.

---

## Part 1: Summary of Administrative Functions

### 1. Overview Section
* **What an administrator can do:**
  * View high-level operational counts across the entire platform.
  * See the total number of spaces, active spaces, and spaces awaiting verification.
  * See total bookings and confirmed bookings.
  * See total successful payments and Gross Merchandise Value in Nigerian Naira.
  * See user counts broken down by role (customer, host, administrator).
  * Review the eight most recent administrative actions.
* **Backend route used:**
  * `GET /api/admin/overview`
* **What gets written to the audit log:**
  * Nothing is written to the audit log for viewing the overview metrics.

---

### 2. Spaces Section
* **What an administrator can do:**
  * View all spaces listed across Nigeria with search and status filtering (all, active, inactive, pending verification, verified).
  * Approve and verify a pending workspace listing so it becomes visible on the public platform.
  * Revoke verification from a workspace listing.
  * Toggle a workspace listing active or inactive.
  * Suspend a workspace listing by providing a mandatory written reason.
  * Reject a workspace listing verification submission by providing a mandatory written reason.
  * Edit the hourly price and daily price of any workspace listing.
* **Backend routes used:**
  * Fetch listings: `GET /api/admin/spaces`
  * Approve or revoke verification: `POST /api/admin/spaces/:id/verify`
  * Toggle active status: `POST /api/admin/spaces/:id/toggle-active`
  * Suspend workspace: `POST /api/admin/spaces/:id/suspend`
  * Reject workspace: `POST /api/admin/spaces/:id/reject`
  * Edit pricing details: `PUT /api/admin/spaces/:id`
* **What gets written to the audit log:**
  * Approving verification writes action `APPROVE_SPACE_VERIFICATION` with the previous and new verification status.
  * Revoking verification writes action `REVOKE_SPACE_VERIFICATION`.
  * Changing online status writes action `ACTIVATE_SPACE` or `DEACTIVATE_SPACE`.
  * Suspending a listing writes action `SUSPEND_SPACE` along with the written suspension reason.
  * Rejecting verification writes action `REJECT_SPACE_VERIFICATION` along with the written rejection reason.
  * Editing prices writes action `UPDATE_SPACE_DETAILS` with the full previous and updated space records.

---

### 3. Bookings Section
* **What an administrator can do:**
  * View all workspace bookings across Nigeria with status filtering (all, reserved, confirmed, cancelled).
  * Search bookings by booking identifier, customer email, space title, or payment reference.
  * Cancel any reservation on behalf of the platform by providing a written cancellation reason.
* **Backend routes used:**
  * Fetch bookings: `GET /api/admin/bookings`
  * Cancel a booking: `POST /api/admin/bookings/:id/cancel`
* **What gets written to the audit log:**
  * Cancelling a booking writes action `ADMIN_CANCEL_BOOKING` with the target booking identifier, previous booking status, and the cancellation reason.

---

### 4. Payments Section
* **What an administrator can do:**
  * View all transaction records processed through the payment gateway with status filtering (all, success, pending, failed).
  * Search transactions by payment reference or booking identifier.
  * Click the **Check Status** button on any pending or stuck transaction to query the gateway directly and update the record.
  * Download the complete transaction ledger as a comma-separated values file.
* **Backend routes used:**
  * Fetch payments: `GET /api/admin/payments`
  * Re-check gateway status: `POST /api/admin/payments/:id/check-status`
  * Export payments to file: `GET /api/admin/payments/export`
* **What gets written to the audit log:**
  * Checking a payment status writes action `CHECK_PAYMENT_STATUS_UPDATE` if the gateway returned an updated status, recording the old status, new status, and gateway confirmation notes.
  * Fetching and exporting transaction records does not write to the audit log.

---

### 5. Users Section
* **What an administrator can do:**
  * View all registered user profiles with role filtering (all, user, host, admin).
  * Search accounts by full name or email address.
  * Change a user role between `user`, `host`, and `admin`.
  * The system blocks an administrator from accidentally removing their own administrator role.
  * Suspend an offending user account with a mandatory written reason.
  * Unsuspend a previously suspended user account.
  * The system blocks an administrator from suspending their own account.
* **Backend routes used:**
  * Fetch user profiles: `GET /api/admin/users`
  * Change user role: `POST /api/admin/users/:id/role`
  * Suspend or unsuspend account: `POST /api/admin/users/:id/suspend`
* **What gets written to the audit log:**
  * Changing a user role writes action `UPDATE_USER_ROLE` with the previous role and new role.
  * Suspending an account writes action `SUSPEND_USER` with the suspension reason.
  * Unsuspending an account writes action `UNSUSPEND_USER`.

---

### 6. Audit Log Section
* **What an administrator can do:**
  * View the immutable ledger of every administrative action performed across the platform.
  * Filter audit records by specific action type or database table.
  * Search audit records by administrator email, action name, or target record identifier.
  * Inspect the exact before-and-after values, network IP address, browser agent, and timestamp for each action.
* **Backend route used:**
  * `GET /api/admin/audit-logs`
* **What gets written to the audit log:**
  * Viewing audit logs does not write new records. The audit log table is append-only.

---

### 7. How Administrator Sign In Operates

1. **Sign In Endpoint:**
   * Every administrator sign-in goes to `POST /api/admin/auth/sign-in` on the server.
   * The browser does not talk directly to Supabase authentication to bypass backend controls.
2. **Rate Limiting:**
   * The server tracks sign-in attempts by client network IP address.
   * A maximum of 5 attempts are allowed within a 15-minute window.
   * If an IP address exceeds 5 attempts, the server locks out requests from that IP address and returns HTTP status code 429.
3. **Inactivity Timeout:**
   * The browser tracks mouse movements, keyboard presses, screen touches, and clicks.
   * If no activity is detected for 30 minutes, the session is cleared from local storage and the user is signed out.
   * The sign-in screen displays an alert informing the user that the session timed out due to 30 minutes of inactivity.
4. **Two-Factor Authentication Enforcement:**
   * All administrative operations require Authenticator Assurance Level 2 (AAL2).
   * Every administrative request checks the session token on the server. If the token is at level 1 (AAL1), the server rejects the request with HTTP status code 403.
5. **What Happens to an Administrator Who Has Not Set Up Two-Factor Authentication:**
   * If an administrator has not enrolled an authenticator app, sign-in detects that zero verified factors exist.
   * The server returns `requiresMfaEnrollment: true` and rejects access to all admin routes with `MFA_ENROLLMENT_REQUIRED`.
   * The interface automatically opens the **Two-Factor Enrollment Screen**.
   * The enrollment screen displays a QR code and a secret setup key.
   * The administrator must scan the QR code using Google Authenticator, 1Password, or Authy, and submit a valid 6-digit code.
   * Upon submitting the code, the session upgrades to Authenticator Assurance Level 2 (AAL2) and grants access to the dashboard.

---

## Part 2: Running the Admin Dashboard on Render

### 1. Service Configuration from `render.yaml`
The exact values defined in `render.yaml` for the admin service are:
* **Root Directory:** `admin`
* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm start`
* **Environment:** `node`
* **Plan:** `starter`
* **Region:** `frankfurt`

---

### 2. Environment Variables Required by the Admin Service

| Variable Name | Purpose | Where to Find the Value | Must Stay Secret? |
|---|---|---|---|
| `NODE_ENV` | Sets production mode for bundling and security checks. Set to `production`. | Typed manually. | No |
| `PORT` | The port the Express web server listens on. Render uses `10000`. | Typed manually (set to `10000`). | No |
| `SUPABASE_URL` | The public base web address of your Supabase project. | In Supabase Dashboard under **Project Settings -> API -> Project URL**. | No |
| `VITE_SUPABASE_URL` | The client-side Supabase URL embedded into frontend assets during build. | Same value as `SUPABASE_URL`. | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged secret key used by the backend server to bypass client limitations and write audit logs. | In Supabase Dashboard under **Project Settings -> API -> Project API Keys -> service_role (secret)**. | **YES. Never expose this key.** |
| `VITE_SUPABASE_ANON_KEY` | The public publishable key used for client authentication challenges. | In Supabase Dashboard under **Project Settings -> API -> Project API Keys -> anon / public**. | No |

---

### 3. Adding the Custom Domain in Render and WhoGoHost

1. **In Render:**
   * Open your `ofis-admin` Web Service.
   * Navigate to **Settings -> Custom Domains**.
   * Click **Add Custom Domain**.
   * Enter `admin.ofis.ng` and click **Save**.
   * Render will display a target address such as `ofis-admin.onrender.com`.
2. **In WhoGoHost DNS Manager:**
   * Log in to your WhoGoHost Client Area.
   * Go to **Domains -> Manage DNS** for `ofis.ng`.
   * Click **Add Record**.
   * Set **Record Type** to `CNAME`.
   * Set **Name / Host** to `admin`.
   * Set **Destination / Value / Target** to `ofis-admin.onrender.com` (use the exact hostname Render gave you).
   * Set **TTL** to `3600` (1 hour) or `14400`.
   * Save the record and allow up to 2 hours for DNS propagation.

---

### 4. Required Supabase Settings

1. **Authentication Redirect Addresses:**
   * In Supabase Dashboard, go to **Authentication -> URL Configuration**.
   * Under **Site URL**, ensure your primary site is set (`https://ofis.ng`).
   * Under **Redirect URLs**, click **Add URL** and add:
     * `https://admin.ofis.ng/**`
     * `https://admin.ofis.ng`
     * `http://localhost:3001/**` (for local admin development)
2. **Multi-Factor Authentication Settings:**
   * In Supabase Dashboard, go to **Authentication -> Multi-Factor (MFA)**.
   * Ensure **App Authenticator (TOTP)** is toggled **ON**.
   * Set the maximum number of factors to at least `2`.

---

### 5. Creating Your First Administrator Account

Run this query in the **Supabase Dashboard -> SQL Editor**:

```sql
-- Step 1: Ensure the profile exists and has the admin role
UPDATE public.profiles 
SET role = 'admin', updated_at = NOW() 
WHERE email = 'your-email@example.com';

-- Step 2: Verify the change was applied
SELECT id, email, role, updated_at 
FROM public.profiles 
WHERE email = 'your-email@example.com';
```

Replace `your-email@example.com` with your registered user email address before executing the query.

---

### 6. Health Check Route

* The admin server includes a dedicated public health route:
  * `GET /api/health`
* **How to verify after deployment:**
  * In your browser or command terminal, visit:
    ```bash
    curl -i https://admin.ofis.ng/api/health
    ```
  * Expected response:
    ```json
    {
      "status": "ok",
      "service": "ofis-admin",
      "time": "2026-10-08T15:30:00.000Z",
      "supabaseConfigured": true
    }
    ```

---

## Part 3: Launch Checklist

Run these tests in order after completing the Render deployment:

1. **Refusal of Normal Users and Signed-Out Visitors:**
   * Open an incognito browser window.
   * Attempt to open `https://admin.ofis.ng/api/admin/overview` without signing in.
   * *Expected result:* HTTP status code 401 with `{"error": "Unauthorized: Authentication token is missing"}`.
   * Sign in using an account with the `user` or `host` role.
   * *Expected result:* HTTP status code 403 with `{"error": "Access denied: This account does not possess administrator privileges."}`.
2. **Refusal of Admin Without Two-Factor Authentication:**
   * Sign in with an administrator account that has not completed second-factor verification.
   * Send a request to any admin route using only the initial password token.
   * *Expected result:* HTTP status code 403 with `{"error": "MFA_REQUIRED"}` or `{"error": "MFA_ENROLLMENT_REQUIRED", "requiresEnrollment": true}`. The browser displays the enrollment or TOTP challenge modal and refuses dashboard access.
3. **Approving a Pending Space:**
   * Submit a new space from the main website as a host.
   * In the admin dashboard under **Spaces**, find the space in the **Pending** tab.
   * Click **Verify**.
   * *Expected result:* The space verification badge turns green, and the space immediately appears on the public Explore page (`https://ofis.ng/explore`).
4. **Rejecting a Space:**
   * Find a space awaiting approval and click **Reject**.
   * Enter a reason (for example: *"Missing clear exterior photo"*).
   * Confirm the rejection.
   * *Expected result:* The space remains unverified and inactive. The rejection action and explanation are logged in the audit log.
5. **Check Status on Stuck Payments:**
   * In the admin dashboard under **Payments**, find a transaction with status `pending`.
   * Click the **Check Status** button on the row.
   * *Expected result:* A notification displays the current response from the payment gateway. If completed, the status updates to `success` and the linked booking confirms automatically.
6. **Audit Log Verification:**
   * Perform an action (such as toggling a space status or changing a user role).
   * Open the **Audit Log** tab.
   * *Expected result:* A new row appears at the top of the table recording the administrator email, action name, affected table, record identifier, and before-and-after values.
7. **Payments Export:**
   * Open the **Payments** tab and click **Export CSV**.
   * *Expected result:* The browser downloads a `.csv` file named `ofis-payments-<timestamp>.csv` containing references, amounts, and settlement details.

---

## Part 4: Known Gaps and Manual Actions

These items are not yet automated in code or require setup outside the codebase:

1. **External Host Email Dispatch:**
   * When an administrator rejects or suspends a space, the server records the reason in the audit log and returns a notification payload in the API response.
   * However, an external transactional email provider (such as Resend, SendGrid, Postmark, or Mailgun) is not yet connected to the admin server. Email notifications are not dispatched to the host's inbox unless a mailing provider API key is added.
2. **Initial Database Migration in Supabase SQL Editor:**
   * The database tables, triggers, and security rules must be established by running `supabase/admin_setup.sql` in the Supabase Dashboard SQL Editor once. The application code cannot run database schema alterations on its own.
3. **Live Gateway Credentials:**
   * Staging sandbox credentials are currently configured. When switching `SZND_ENV` to `production`, live production API keys (`SZND_API_KEY` and `SZND_API_SECRET`) must be obtained from the payment provider and entered in Render environment variables.
4. **DNS Propagation Time:**
   * Creating the `CNAME` record in WhoGoHost does not take effect instantly. You must wait for DNS records to propagate before SSL certificates can be generated by Render.
