# True Frame — AdMob setup (iOS only)

> Development uses **Google test banner IDs** when `USE_TEST_ADS = true` in `mobile/constants/ads.ts`.

## Privacy / compliance (review with counsel)

- **ATT (iOS):** Required if you request IDFA for personalized ads. Current code uses `requestNonPersonalizedAdsOnly: true` — still complete App Store privacy labels for advertising.
- **UMP (EU/UK):** Integrate Google User Messaging Platform before serving ads to EEA/UK users — not in v1 code yet.
- **App Store Connect:** Declare advertising-related data uses; link privacy policy.
- **app-ads.txt:** Recommended if your App Store support/marketing URL uses a domain you control.

---

## A. AdMob account readiness

1. Sign in at [https://admob.google.com](https://admob.google.com).
2. Confirm account status is **Active**.
3. If disabled: resolve policy/payment issues — do not create duplicate accounts.

## B. Add the iOS app

1. **Apps** → **Add app**.
2. Platform: **iOS**.
3. Name: **True Frame**.
4. **Not published yet** if still in TestFlight.
5. Bundle ID: **`com.trueframe.app`** (must match App Store Connect).

## C. AdMob App ID

Format: `ca-app-pub-XXXXXXXX~YYYY` (tilde **~**).

1. **Apps** → **True Frame (iOS)** → **App settings**.
2. Copy **App ID**.

**In code:** `mobile/app.json` → plugin `iosAppId`:

```json
[
  "react-native-google-mobile-ads",
  {
    "iosAppId": "ca-app-pub-1571569580384263~3153506477"
  }
]
```

Rebuild native app with EAS after changing App ID. Expo Go does not support AdMob.

## D. Banner ad unit

Format: `ca-app-pub-XXXXXXXX/YYYY` (slash **/**).

1. **Apps** → **True Frame (iOS)** → **Ad units** → **Add ad unit**.
2. Format: **Banner**.
3. Name example: `TF_iOS_Banner_v1`.
4. Copy **Ad unit ID**.

**In code:** `mobile/constants/ads.ts` → `PRODUCTION_IOS_BANNER`.

One banner unit is used for Explore (after 4th card) and after-read completion.

## E. Test ads

- Keep `USE_TEST_ADS = true` during development.
- Do not click your own production ads.
- Optional: AdMob → **Settings** → **Test devices** → add iPhone IDFA.

## F. app-ads.txt

Host at site root, e.g. `https://yourdomain.com/app-ads.txt`:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

Publisher ID: AdMob → **Account** → **Publisher ID**.

## G. iOS privacy

1. Disclose ads in privacy policy.
2. App Store Connect → **App Privacy** questionnaire.
3. Add UMP before EU production ads if needed.
4. ATT only if you enable personalized ads later.

## H. Production switch

1. `mobile/constants/ads.ts` → `USE_TEST_ADS = false`
2. Confirm `PRODUCTION_IOS_BANNER` has your AdMob banner unit ID.
3. Confirm `app.json` `iosAppId` is your production App ID.
4. `eas build --platform ios`
5. New ad units may take up to ~1 hour to serve fill.

**Disable all ads:** `ADS_ENABLED = false` in `mobile/constants/ads.ts`.

## I. Pre-release checklist

- [ ] EAS iOS build (not Expo Go)
- [ ] Test ads on Explore + after-read completion
- [ ] No ads on Privacy / Terms / Support / About / Settings / onboarding / reader body
- [ ] App works when ad fails to load
- [ ] Tab bar not covered
- [ ] App Store privacy completed
- [ ] app-ads.txt (if using a listing domain)
