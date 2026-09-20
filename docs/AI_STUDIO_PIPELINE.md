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

Current integrated secondary commit: `de2b1aa3bb4addd233a463f6647b24dc2b0285be`.
