# Size and content quality cleanup

Release notes for True Frame v2.0.0 (build 18+).

## Summary

- TR content quality cleanup completed: **367 A / 0 B / 0 C**
- Fixed TR language, encoding and incomplete sentence issues
- Optimized app icon and splash assets
- Removed unused SpaceMono font
- Minified mobile data sync output
- Changed catalog preload to active locale only
- Build **#18** IPA: **22.89 MB**, down from **23.94 MB** (build #17)

## Phase 3

Not planned at this time. Wait for App Store Connect **App File Sizes** after build 18 is processed. Candidates only if needed later: font subsetting, single-locale bundle, remote content, content lazy fetch.

## Submit

```powershell
cd mobile
eas submit --platform ios --latest
```

After processing in App Store Connect: version → build 18 → **App File Sizes** for per-device download and install sizes.
