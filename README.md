# NodeWars ⚔️

**Where every edge case is a battlefield.**

NodeWars is a gamified, real-time 1v1 competitive coding platform built to make Data Structures and Algorithms (DSA) practice more engaging and interview-focused. Instead of solving problems alone, users battle an opponent head-to-head on the same DSA problem, racing to solve it correctly first — turning interview prep into a competitive, game-like experience.

Inspired by platforms like DSA Round Robin, NodeWars adds company-specific question targeting, a tactical ability system, and an ELO-style rating engine on top of the core battle mechanic.

---

## 🎮 Features

- **Company + Topic Based Matchmaking** — Select a target tech giant (Google, Amazon, Microsoft, TCS, Infosys) and a DSA topic (Arrays, DP, Graphs, Recursion, Strings, Trees). The system serves a relevant problem tagged to that exact combination.
- **Live Battle Arena** — Real-time match screen with a live "Combat Velocity" progress bar for both players, an in-browser compiler, and a countdown timer.
- **Real Code Judging** — Submitted code is actually executed against test cases and the real output is compared to expected results — no fake pass/fail heuristics.
- **Tactical Abilities** — A "Charge" meter builds up as players make real progress (tied to test case pass events), unlocking abilities:
  - 💡 **Hint** — Conceptual insight into the problem
  - 🔍 **Code Scan** — Reveals edge cases
  - 🛡️ **Firewall** — Blocks incoming disruption
  - 🌫️ **Syntax Fog** — Disrupts the opponent's view
- **ELO-Style Rating System** — Ratings update after every match based on expected vs. actual outcome (named after its creator, Arpad Elo), driving rank tiers (Silver → Gold → Platinum) and the leaderboard.
- **Global Leaderboard** — Displays top-ranked players and always shows the logged-in user's own rank, even outside the top 3.
- **Authentication** — Login/signup flow with custom avatar selection and a 1-click demo login for quick access.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Lucide React (icons) |
| Backend | Node.js |
| Real-time Layer | Socket-based live match state sync |
| Code Judging | Custom judge service — executes user code against real test cases |
| Data | Question bank tagged by `companyId` + `topicId` |
| Auth | Custom auth service (login/signup, session-based) |
| Dev Tooling | Vite (dev server) |

> Update the table above with your confirmed choices (e.g. Express.js, Socket.io, PostgreSQL/MongoDB) once finalized.

---

## 🧠 How It Works

1. **Login/Signup** — User authenticates and their profile (rating, streak, rank) loads as a single shared state across the app.
2. **Matchmaking** — User picks a company and topic; the matchmaking service queries the question bank and selects a matching problem, then pairs the user with an opponent.
3. **Battle** — Both players code against the same problem in real time. Progress bars reflect actual test case pass events, not a timer.
4. **Judging** — On Run/Submit, code is executed against real test cases and compared to expected output to determine pass/fail.
5. **Result** — The winner is decided by correctness + submission time. Ratings and win streaks update from a single source of truth, then reflect consistently across the results screen and header.
6. **Leaderboard** — Rankings update globally, with the current user's position always visible.

---

## 📂 Project Structure (Key Files)

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── PowerUpDeck.jsx
│   └── CyberAvatar.jsx
├── screens/
│   ├── LandingScreen.jsx
│   ├── LoginScreen.jsx
│   ├── MatchmakingScreen.jsx
│   ├── BattleScreen.jsx
│   └── ResultScreen.jsx
├── services/
│   ├── api.js
│   ├── socket.js
│   ├── judgeService.js
│   ├── judgeEvaluator.js
│   └── matchmakingService.js
├── data/
│   ├── mockData.js
│   └── seed.js
└── App.jsx
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/nodewars.git
cd nodewars

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5173` (Vite default).

---

## 📌 Roadmap

- [ ] Real player-vs-player matchmaking (currently simulated opponent)
- [ ] Persistent database integration (move question bank and user data from mock data to a full DB)
- [ ] Squad Clash (2v2) mode
- [ ] Expanded question bank across more companies and topics
- [ ] Sandboxed multi-language code execution

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
