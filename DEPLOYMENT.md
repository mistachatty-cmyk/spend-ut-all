# Vercel Deployment

## Import

Import `mistachatty-cmyk/spend-ut-all` directly into Vercel.

Use:

- Framework Preset: `Next.js` (auto-detected)
- Root Directory: repository root (`.`)
- Build Command: default (`npm run build`)
- Install Command: default (`npm install`)
- Output Directory: default Next.js output
- Node.js: `22.x`
- Production Branch: `main`

## Environment variables

The current MVP has no required server environment variables. Saves and the temporary LOK balance are browser-local.

When the shared LOK wallet is connected, keep the integration modular under `integrations/lok/`. Public browser configuration may use `NEXT_PUBLIC_` variables, but credentials, signing keys, service-role keys, and other secrets must stay server-only in Vercel Project Settings.

## Preview checklist

1. Vercel build completes successfully.
2. Start each scenario and verify the starting balance.
3. Buy items and confirm cash/owned counts update.
4. Confirm Simple/Advanced mode switching changes upkeep behavior.
5. Confirm LOK increments once per 10 seconds of active runtime.
6. Refresh and confirm the local save restores.
7. Verify home upgrades and net-worth requirements.
8. Check narrow mobile layouts and desktop layouts.
9. Confirm no `.env` or secret files are committed.

## LOK boundary

Spend It All is standalone. The game simulation consumes a LOK adapter; the LOK ecosystem remains an external service. The local adapter is temporary and should later be replaced by the authoritative cross-app wallet/ledger without moving the game into the ecosystem repository.