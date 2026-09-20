# Google AI Studio → production pipeline

Google AI Studio work belongs in `mistachatty-cmyk/Spend-it-all-secondary-`. The production source of truth is `mistachatty-cmyk/spend-ut-all`.

## Flow

1. Build and commit in the secondary repository.
2. Its intake workflow validates the handoff.
3. Production checks the secondary repository hourly (or on manual dispatch).
4. Only changed application paths are imported into `automation/ai-studio-sync`.
5. The combined application must pass `npm ci` and `npm run build`.
6. The workflow opens or updates a pull request. Vercel creates a preview.
7. Merge only after the build and preview are healthy.

The importer never writes directly to `main`, never imports the secondary repository's workflow files, and preserves production-only modules unless the secondary commit explicitly changes the same allowed path.

Current integrated secondary commit: `257de462ee2ff7bc88ff45d09145ebba0b4c682f`.
