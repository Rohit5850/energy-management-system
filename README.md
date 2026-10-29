# EnerVue EMS

Energy Management System — **Next.js 14 (JavaScript, no TypeScript) + Tailwind CSS + built-in SQLite (`node:sqlite`)**.
Auth (register / login / forgot-reset), per-account deployment mode (local / cloud / hybrid), aur dashboard
(overview, energy analysis, devices + add/delete, alarm center, reports).

## Chalane ke steps (apne PC par)

> Node.js **v22 ya usse naya** hona chahiye (built-in `node:sqlite` ke liye zaroori).
> Check: `node -v`

```bash
# 1) project folder ke andar jao
cd ems-app

# 2) ek baar dependencies install karo (internet chahiye)
npm install

# 3) dev server chalao
npm run dev
```

Browser mein kholo: **http://localhost:3000**

- Pehli baar `/register` par account banao → company + mode (local/cloud/hybrid) choose karo
- Mode account ke saath save hota hai — "hybrid pe bana to hybrid pe hi login"
- "Forgot password?" → reset link dev mode mein screen par dikh jaata hai (real app email karega)

## Folder structure

```
lib/
  crypto.js    scrypt password hash + HMAC session token (Node built-in crypto)
  db.js        node:sqlite — companies, users, meters, alarms, password_resets
  session.js   cookie session (httpOnly) + getCurrentUser
app/
  login/ register/ forgot/ reset/   auth pages
  api/auth/*    register, login, logout, forgot, reset, me
  api/meters/   GET list · POST add device · DELETE device
  dashboard/    overview, energy, devices, alarms, reports (+ layout)
components/     AuthShell, dashboard/{Sidebar, LogoutButton, AlarmsClient, DevicesClient}
```

## Database

- **SQLite** file ban jaati hai: `data/ems.db` (app khud bana leta hai pehli baar).
- Har company ka data `company_id` se alag rehta hai (multi-tenant).
- Naya account banate hi demo meters (9) + alarms (4) seed ho jaate hain — ye sample hai, baad mein
  asli meter data edge agent se aayega.

## Production build

```bash
npm run build
npm start
```

Production mein `SESSION_SECRET` environment variable set karein (cookie signing ke liye):

```bash
SESSION_SECRET="koi-lamba-random-string" npm start
```

## Tested

41 logic assertions (crypto, register, duplicate-guard, login-by-username/email, mode-save,
forgot/reset, add/delete device, per-company isolation, plain-object rows) — all passing.
