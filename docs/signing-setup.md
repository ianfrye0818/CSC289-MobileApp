# Native signing setup (iOS + Android)

Walks through getting signing credentials in place for `eas build` and `eas submit`. Companion to `docs/native-build.md`.

## Two approaches

1. **EAS-managed credentials (recommended for most cases).** EAS generates and stores certs/keys on Expo's servers. You run `eas credentials` interactively once per platform; EAS handles everything.
2. **Self-managed via `credentials.json`.** You drop the cert + provisioning profile (iOS) and keystore (Android) in the repo root as a `credentials.json` file that points to the actual artefacts. Needed if you have strict signing requirements or need to match an existing Apple cert that's shared with a non-Expo team.

This project defaults to EAS-managed. `credentials.json` is gitignored so it can exist locally if someone later switches to self-managed without leaking secrets.

## iOS

### What you need

| Item                            | Where to get it                                                            | Placeholder token                           |
|---------------------------------|----------------------------------------------------------------------------|---------------------------------------------|
| Apple Developer account         | [developer.apple.com](https://developer.apple.com/) — paid membership ($99/yr) | (no token — account required)              |
| Apple Team ID (10 chars)        | developer.apple.com → Membership page                                      | `__PLACEHOLDER_APPLE_TEAM_ID__`             |
| Apple ID email                  | The email on the Apple Developer account                                   | `__PLACEHOLDER_APPLE_ID_EMAIL__`            |
| App Store Connect App ID        | App Store Connect → your app → App Information → "Apple ID" (numeric)      | `__PLACEHOLDER_ASC_APP_ID__`                |
| App-specific password (for `eas submit`) | [appleid.apple.com](https://appleid.apple.com) → Sign-In & Security → App-Specific Passwords | not stored in repo — set as EAS Secret or env var |
| Distribution certificate + provisioning profile | EAS generates these for you on `eas credentials`       | tokens only if self-managed                 |

### Steps (EAS-managed, preferred)

```
# 1. Log in to Expo + Apple via EAS
eas login                              # asks for Expo credentials
eas credentials --platform ios         # asks for Apple ID + Team; generates cert + profile

# 2. Verify
eas build --platform ios --profile development
```

### Steps (self-managed)

1. Generate a Distribution Certificate (`.p12`) via Keychain Access (Mac) or `openssl`.
2. Download a Provisioning Profile (`.mobileprovision`) from developer.apple.com.
3. Place both in the repo root (already gitignored via `*.p12`, `*.mobileprovision` patterns).
4. Create `credentials.json` at repo root with the template below.

### `credentials.json` template (iOS portion)

This file is **gitignored** — never commit. Local-only. Each placeholder below is listed in `.claude/placeholder-tokens.md`.

```json
{
  "ios": {
    "provisioningProfilePath": "__PLACEHOLDER_IOS_PROVISIONING_PROFILE_PATH__",
    "distributionCertificate": {
      "path": "__PLACEHOLDER_IOS_DISTRIBUTION_CERT_PATH__",
      "password": "__PLACEHOLDER_IOS_DISTRIBUTION_CERT_PASSWORD__"
    }
  }
}
```

## Android

### What you need

| Item                              | Where to get it                                                       | Placeholder token                              |
|-----------------------------------|-----------------------------------------------------------------------|------------------------------------------------|
| Android keystore (`.jks` / `.keystore`) | Generate via `keytool -genkey ...` or let EAS generate on `eas credentials` | `__PLACEHOLDER_ANDROID_KEYSTORE_PATH__`       |
| Keystore password                 | Set during `keytool` generation                                       | `__PLACEHOLDER_ANDROID_KEYSTORE_PASSWORD__`    |
| Key alias                         | Set during `keytool` generation                                       | `__PLACEHOLDER_ANDROID_KEY_ALIAS__`            |
| Key password                      | Set during `keytool` generation (often same as keystore password)     | `__PLACEHOLDER_ANDROID_KEY_PASSWORD__`         |
| Google Play Service Account JSON  | Google Play Console → Settings → API access → create service account  | `__PLACEHOLDER_GOOGLE_SERVICE_ACCOUNT_PATH__`  |
| Firebase `google-services.json`   | Firebase Console → Project settings → Android app → download JSON     | `__PLACEHOLDER_GOOGLE_SERVICES_FILE_PATH__`    |

### Steps (EAS-managed, preferred)

```
eas credentials --platform android     # prompts; generates keystore; stores on Expo
eas build --platform android --profile development
```

### Steps (self-managed)

1. Generate a keystore:
   ```
   keytool -genkeypair -v -keystore csc289mobile.keystore -alias csc289mobile -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Place in repo root (gitignored via `*.jks` / new `*.keystore` line in `.gitignore`).
3. Add Android section to `credentials.json`:

```json
{
  "android": {
    "keystore": {
      "keystorePath": "__PLACEHOLDER_ANDROID_KEYSTORE_PATH__",
      "keystorePassword": "__PLACEHOLDER_ANDROID_KEYSTORE_PASSWORD__",
      "keyAlias": "__PLACEHOLDER_ANDROID_KEY_ALIAS__",
      "keyPassword": "__PLACEHOLDER_ANDROID_KEY_PASSWORD__"
    }
  }
}
```

### Google Play submission

1. Create a service account in Google Cloud Console.
2. Grant it the "Service Account User" role in Google Play Console → Settings → API access.
3. Download the JSON key. Place at `./__PLACEHOLDER_GOOGLE_SERVICE_ACCOUNT_PATH__.json` or update `eas.json#submit.production.android.serviceAccountKeyPath` to the real path.

### Firebase / push notifications

For Android push to work, you also need Firebase Cloud Messaging set up:

1. [Firebase Console](https://console.firebase.google.com) → Add project → Add Android app with package `com.csc289sp2026.elevateretail`.
2. Download `google-services.json`.
3. Place at repo root (gitignored).
4. Add to `app.json`:

```json
"android": {
  "...": "...",
  "googleServicesFile": "./google-services.json"
}
```

(Currently missing — flagged in ticket 54 follow-up.)

## Rotation / security notes

- Every placeholder in this doc and in `eas.json` is logged in `.claude/placeholder-tokens.md`. Do a full-repo grep for `__PLACEHOLDER_` when rotating to make sure no reference is missed.
- Once real credentials exist, strongly prefer EAS Secrets (`eas secret:create --scope project ...`) over putting values in `eas.json`. That way `eas.json` stays safe to commit.
- If you commit a secret by accident, rotate it immediately — don't just revert the commit. Git history remembers.
