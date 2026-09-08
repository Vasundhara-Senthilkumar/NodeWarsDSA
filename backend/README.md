# NodeWars Backend

Competitive DSA arena API for the NodeWars frontend.

## Stack

- **Express** REST API
- **Socket.IO** matchmaking + live battles
- **SQLite** (`better-sqlite3`) for zero-config local persistence
- **JWT** auth
- **Simulated judge** (swap later for Judge0/Docker)

## Quick start

```bash
cd backend
npm install
npm run db:seed
npm run dev
```

API: `http://localhost:4000`  
Health: `GET /health`

Demo account: **Neon_Ronin** / **nodewars123**

## REST endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/signup` | no | Create account |
| POST | `/api/auth/login` | no | Login → `{ user, token }` |
| GET | `/api/auth/me` | yes | Current user |
| GET | `/api/users/leaderboard` | no | Top ratings |
| PATCH | `/api/users/me` | yes | Update profile |
| GET | `/api/companies` | no | Company arenas |
| GET | `/api/topics` | no | DSA topics |
| GET | `/api/problems/:companyId/:topicId` | no | Problem for match |
| GET | `/api/matches` | yes | Your match history |
| GET | `/api/matches/:id` | yes | Match details |
| GET | `/api/activity` | no | Live activity feed |

Auth header: `Authorization: Bearer <token>`

## Socket.IO events

Connect with:

```js
io('http://localhost:4000', { auth: { token } })
```

### Client → server

- `matchmaking:join` `{ mode, companyId, topicId }`
- `matchmaking:leave`
- `battle:join` `{ matchId }`
- `battle:code` `{ matchId, code, language }`
- `battle:ability` `{ matchId, abilityId, targetUserId? }`
- `battle:run` `{ matchId }`
- `battle:submit` `{ matchId }`
- `battle:forfeit` `{ matchId }`

### Server → client

- `matchmaking:searching`
- `matchmaking:found` (3s countdown)
- `battle:start`
- `battle:state` / `battle:progress`
- `battle:ability`
- `battle:runResult` / `battle:submitResult`
- `battle:ended` (includes ELO delta)

## Abilities (charge)

| Ability | Cost |
|---------|------|
| Hint | 30 |
| Code Scan | 25 |
| Firewall | 40 |
| Syntax Fog | 50 |

Charge builds as the player types (same model as the frontend).

## Scripts

- `npm run dev` — nodemon
- `npm start` — production
- `npm run db:seed` — seed companies/topics/problems/demo user
- `npm run db:reset` — wipe DB + reseed

## Frontend env

Point the Vite app at the API (when you wire it):

```
VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

## Next upgrades

1. Wire frontend screens to REST + Socket.IO
2. Redis queue for multi-instance matchmaking
3. Real judge (Judge0 / Docker sandbox)
4. Bot opponent when queue is empty (solo practice)
5. Full 2v2 team scoring
