# Dev ports & napps (fleet standard)

**Do not run `next dev` on port 3100.** That port is reserved for **napps dev** (`~/Projects/napps`). Prod napps uses **3101**.

When several ventures live under `~/Projects`, hard-coding the same port causes collisions. **napps** allocates stable dev ports and tracks them in `~/Projects/napps/.napps/port-registry.json`.

| Port range | Owner |
|------------|--------|
| **3100** | napps · dev |
| **3101** | napps · prod |
| **3190–3197** | LostInSpAIce overflow only (when :3199 busy) |
| **3198** | fairbor/mission-control |
| **3199** | fairbor/lostinspaice daemon |
| **3200–3299** | New ventures / registered ships (govaj :3200) |
| Other | Registered fleet apps (see napps `portfolio.ts` — e.g. TransLang :3000, tictoemmo :5180) |

**Canonical reference:** `docs/FLEET_PORTS.md` · **Audit:** `bash scripts/audit-ports.sh`

---

## Quick start (new Next.js app)

1. Start napps (dev or prod):

   ```bash
   bash ~/Projects/napps/scripts/napps-mode.sh prod   # → http://127.0.0.1:3101
   ```

2. In this repo’s `package.json`:

   ```json
   "dev": "bash ~/Projects/napps/scripts/with-allocated-port.sh next dev -H 127.0.0.1"
   ```

3. Run `npm run dev`. napps picks a free port in **3200–3299** and reuses it next time.

Optional stable key (if folder name is ambiguous):

```bash
NAPPS_PORT_KEY=my-app npm run dev
```

---

## API (scripts / CI)

While napps is on **3100** or **3101**:

```bash
# By folder name (matches ~/Projects/zerogub)
curl -s 'http://127.0.0.1:3101/api/port/allocate?folder=govaj'

# By explicit key
curl -s 'http://127.0.0.1:3101/api/port/allocate?key=govaj'

# Full registry
curl -s 'http://127.0.0.1:3101/api/port/registry'
```

Response example:

```json
{
  "port": 3203,
  "url": "http://127.0.0.1:3203",
  "key": "folder:govaj",
  "reused": false
}
```

---

## Vite / other dev servers

The wrapper sets `PORT` and `NAPPS_DEV_PORT`. Examples:

```bash
bash ~/Projects/napps/scripts/with-allocated-port.sh vite --host 127.0.0.1
bash ~/Projects/napps/scripts/with-allocated-port.sh npm run dev:api
```

For Vite, pass the port explicitly if needed: `vite --port "$NAPPS_DEV_PORT"`.

---

## Register in the fleet

After the app is real, add it to `napps/src/lib/portfolio.ts` for health probes, Start/Stop, and KPI tiles. Until then, **Update fleet** on the napps dashboard reserves a port under **New ships detected**.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `napps not reachable` | Start napps on 3100 or 3101 first |
| Pool exhausted | Stop unused dev servers; edit `.napps/port-registry.json` |
| Wrong port in browser | Check terminal — `[napps] allocated :3203` |
| Activity Monitor shows generic `node` | napps **Activity Monitor** decodes ports via this registry |

More: `~/Projects/napps/README.md` · Fleet dashboard: http://127.0.0.1:3101
