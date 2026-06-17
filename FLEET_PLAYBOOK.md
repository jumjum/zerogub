# zerogub — fleet registration

This repo is a venture under `~/Projects`. **napps** is the fleet dashboard (`~/Projects/napps`).

## Dev port

Never use **:3100** (napps dev). Use:

```bash
bash ~/Projects/napps/scripts/with-allocated-port.sh next dev -H 127.0.0.1
```

See **NAPPS_DEV_PORTS.md** in this folder.

## Get a fleet tile (Start/Stop on napps)

1. **Logo** — add `~/Projects/napps/public/apps/<slug>.svg`
2. **GitHub** — `git init`, commit, `git remote add origin`, `git push -u origin main`
3. On napps fleet page → **Register new ship(s)**

Full playbook: `~/Projects/napps/docs/NEW_SHIP_PLAYBOOK.md`
