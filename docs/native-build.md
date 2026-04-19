# Native build guide (iOS + Android via EAS)

Canonical process for producing installable native builds of `csc289mobile` using Expo Application Services (EAS). Applies to ticket 54.

## Status as of 2026-04-18

- `app.json` production-ready — bundle IDs, EAS project ID, icons, splash, plugins, New Arch enabled.
- `eas.json` scaffolded with `development`, `preview`, `production` profiles and a `submit.production` block.
- **Credentials not yet configured.** D3adMan does not have an active Apple Developer membership or local Android Studio setup. Every credential reference in `eas.json` / `credentials.json` is a placeholder `__PLACEHOLDER_<NAME>__` — see `.claude/placeholder-tokens.md` for the index.
- No actual builds have been run. This doc is a blueprint so D3adMan (or whoever takes over) can execute the build once credentials exist.

## Prerequisites

- Node.js 22.x (matches what CI will use).
- `eas-cli` globally: `npm install -g eas-cli`.
- `EXPO_TOKEN` environment variable for non-interactive / CI use (generate from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)).
- Logged into the right Expo account: `eas whoami` should return `csc289-sp2026` (the `owner` on `app.json`).

## Build profiles (`eas.json`)

| Profile       | iOS output                  | Android output         | Distribution | Purpose                                |
|---------------|-----------------------------|-----------------------|--------------|----------------------------------------|
| `development` | simulator build (+dev client) | `.apk`                | internal     | local dev on simulator / sideloaded APK |
| `preview`     | ad-hoc `.ipa`                | `.apk`                | internal     | internal testers / demo devices         |
| `production`  | App Store `.ipa`             | Play Store `.aab`     | store        | release to TestFlight / Play internal   |

Each profile has an `env` block with a placeholder `EXPO_PUBLIC_API_URL`. Fill these in (either by editing `eas.json`, using EAS Secrets, or passing `--env-file=...`) before running a build.

## Running a build

```
# Dev build — intended for simulator / internal APK
eas build --platform ios      --profile development
eas build --platform android  --profile development

# Internal preview (OTA-distributable URL from EAS)
eas build --platform all --profile preview

# Production (signed for store upload)
eas build --platform all --profile production
```

For CI / non-interactive use, add `--non-interactive --no-wait`.

## Submitting to stores

```
# Only after production builds complete and credentials are set
eas submit --platform ios     --profile production
eas submit --platform android --profile production
```

Submit reads from `eas.json#submit.production`:

- **iOS:** `appleId`, `ascAppId`, `appleTeamId` — all placeholders right now. Values come from:
  - `appleId` — the email on your Apple Developer account.
  - `ascAppId` — the numeric "App ID" from App Store Connect → your app → App Information.
  - `appleTeamId` — 10-character alphanumeric, from [developer.apple.com → Membership](https://developer.apple.com/account).
- **Android:** `serviceAccountKeyPath` — path to a Google Play Service Account JSON. Placeholder until D3adMan downloads one from Google Play Console → Settings → API access. `track: internal` + `releaseStatus: draft` means submissions go to Internal Testing as drafts — safe default for first submit.

## Credentials / signing

Details in `docs/signing-setup.md`. Short version:

- iOS: either let EAS manage certs (recommended — `eas credentials`) or provide a `.p12` + `.mobileprovision` via `credentials.json`.
- Android: either let EAS generate a keystore (recommended) or provide your own via `credentials.json`.

The repo's `.gitignore` excludes `credentials.json`, `google-services.json`, `GoogleService-Info.plist`, and any `.keystore/.jks/.p12/.p8` files — these are **local-only** and never committed.

## Environment variables

The mobile app reads `process.env.EXPO_PUBLIC_API_URL` (and only that — confirm via `lib/env.ts`). Set it per environment:

| Where           | How                                                                               |
|-----------------|-----------------------------------------------------------------------------------|
| Local dev       | `.env` at repo root (gitignored)                                                  |
| EAS build       | `eas.json#build.<profile>.env`, or `eas secret:create` then referenced by name    |
| GitHub Actions  | repo secret `EXPO_PUBLIC_API_URL` injected into the workflow                      |

**Do not commit the real URL to `eas.json`.** Use `eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "..."` and reference as `"$EXPO_PUBLIC_API_URL"` instead of the literal placeholder.

## Push notifications in builds

The app uses `expo-notifications`. For pushes to actually fire on a production build:

- **iOS:** enable Push Notifications capability on the provisioning profile. If you let EAS manage credentials, this is automatic once the capability is on the App ID.
- **Android:** provide a `google-services.json` (from Firebase — `__PLACEHOLDER_GOOGLE_SERVICES_FILE_PATH__`). Reference it from `app.json → android.googleServicesFile` (currently absent — add once you have the file). This doc notes the gap; see ticket 53 proposed-changes for where the server-side sends pushes through the Expo Push API.

## GitHub Actions (CI builds)

`.github/workflows/eas-build.yml` has a scaffolded workflow:

- Manual trigger (`workflow_dispatch`) only — won't fire on every push to avoid surprising builds while credentials are incomplete.
- Requires repo secret `EXPO_TOKEN`.
- Defaults to `--platform all --profile preview`.
- Enable push-trigger or schedule triggers when you're ready for automated builds.

## Troubleshooting (pre-filled from common cases)

| Symptom                                                 | Likely cause                                               | Fix                                                                      |
|---------------------------------------------------------|------------------------------------------------------------|--------------------------------------------------------------------------|
| `eas build` prompts for credentials every time          | No `credentials.json`, and haven't run `eas credentials`   | Run `eas credentials` once per platform to let EAS manage them           |
| iOS build fails with "No provisioning profile"          | Capability mismatch between App ID and profile              | `eas credentials` → sync. Or add capability on developer.apple.com       |
| Android build works but app crashes on launch           | Missing native module or wrong minSDK                       | Check `expo-dev-client` version matches `expo` major; rebuild dev client |
| Push notifications silent on Android                    | No `google-services.json` referenced in `app.json`          | Drop the file in repo root (gitignored), add `android.googleServicesFile`|
| `EXPO_PUBLIC_API_URL` still showing placeholder at run  | `eas.json` still has literal `__PLACEHOLDER_*_API_URL__`    | Set EAS Secret + reference by name, or edit `eas.json` locally           |

## When D3adMan gets Apple + Android set up

Follow-up work, in order:

1. Replace every `__PLACEHOLDER_*__` in `eas.json` with real values (or EAS Secret references).
2. Drop real `credentials.json` / `google-services.json` / `GoogleService-Info.plist` in repo root — `.gitignore` already hides them.
3. Run `eas build --platform ios --profile development` once to confirm signing resolves.
4. Run a `preview` build for each platform; install on a physical device; verify: app launches, can log in, can browse products, place a test order.
5. Verify push notifications fire end-to-end (needs ticket 53 server-side changes).
6. Only then run `production` builds and `eas submit`.
