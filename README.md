# TaskFlow API

Express and MongoDB API for the [TaskFlow client](https://github.com/HussainALAradi5/task-flow-proto-client-side). Projects act as boards, tasks act as cards, and task status determines the Kanban column. Project activity is recorded as an ordered history. Team invitations require recipient acceptance before access is granted.

## Live demo

The [client](https://taskflow-proto-client.onrender.com) and [API health endpoint](https://taskflow-proto-api.onrender.com/) are hosted on Render's free plans. The API may take about a minute to wake after inactivity. The live database is a dedicated MongoDB Atlas Free cluster seeded with the [three demo roles](#demo-accounts). Obtain the demo password privately from the project owner; do not put privileged demo credentials in a public README. See the [free deployment guide](https://github.com/HussainALAradi5/task-flow-proto-documenation/blob/main/deploy-free-render.md) for configuration.

## Start locally (PowerShell)

1. Install [Node.js 24 LTS](https://nodejs.org/en/download) and start a local MongoDB server, or obtain a MongoDB connection URI.
2. From this repository, install packages and create a local environment file:

   ```powershell
   npm ci
   Copy-Item .env.example .env
   ```

3. Edit `.env`: set `MONGO_URI` to the running database and replace `JWT_SECRET` with a unique secret. Keep `PORT=5000` and `CORS_ORIGINS=http://localhost:4200` when using the client's defaults.
4. Start the API:

   ```powershell
   npm run dev
   ```

   Wait for `MongoDB Connected Successfully` and `Server running`. Open [http://localhost:5000/](http://localhost:5000/) for the health response. The server exits if it cannot connect to MongoDB.

In a second terminal, follow the [client startup instructions](https://github.com/HussainALAradi5/task-flow-proto-client-side#start-locally-powershell).

## Demo accounts

Run the seed only with a dedicated demo database. It inserts records if absent and does not reset existing passwords.

```powershell
$env:DEMO_SEED = '1'
$env:DEMO_SEED_PASSWORD = Read-Host 'Choose a demo password (12+ characters)'
npm run seed:demo
Remove-Item Env:DEMO_SEED, Env:DEMO_SEED_PASSWORD
```

The script reads `MONGO_URI` from `.env`. All three new accounts use the password you entered:

| Username | Email for login | Role | Demo use |
|----------|-----------------|------|----------|
| `demo_admin` | `demo-admin@taskflow.local` | Admin | See and manage all records |
| `demo_leader` | `demo@taskflow.local` | Leader | Owns the sample team and boards |
| `demo_member` | `demo-member@taskflow.local` | Member | Belongs to Operations Group and its Operations Board, owned by Admin |

Enter either email or username in the client's login form. The Member can see and work on Operations Board, including an Admin-created card, but cannot see the Leader's Product Studio boards. The seed also adds three Product Studio boards, a milestone, four cards, a comment, and activity history for Website Refresh. Existing account passwords are preserved when the seed runs again.

## Checks and production

```powershell
npm run build
npm test
npm start
```

`npm start` runs the compiled build; run `npm run build` first. Set `NODE_ENV=production`, a strong `JWT_SECRET`, the deployment `MONGO_URI`, and the real client origin in `CORS_ORIGINS` for deployment. API paths use `/api`. See the [contract documentation](https://github.com/HussainALAradi5/task-flow-proto-documenation/blob/main/contract-verification.md) for the routes and access rules.

The demo seed and API were checked against an isolated temporary MongoDB instance: the seed ran twice, all three roles logged in, and the Member moved and commented on an Admin-created card while remaining unable to read Product Studio. A separate integration check verified invitation consent, duplicate and outsider rejection, access revocation, date validation, and a GIF comment. The Atlas demo database was seeded and its deployed API checked separately. See the [workflow review](https://github.com/HussainALAradi5/task-flow-proto-documenation/blob/main/trello-workflow-review.md) for the supported Trello-style features and limits.
