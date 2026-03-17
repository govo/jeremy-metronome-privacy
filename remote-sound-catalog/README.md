# Remote Background Sound Catalog

This folder is the GitHub-hostable structure for remote background music.

Bundled in app by default (not remote):
- `white_noise.mp3`
- `ocean_waves.mp3`
- `rain.mp3`

## Directory layout

- `catalog/sounds-catalog.json`: manifest consumed by app
- `tracks/*.mp3`: downloadable files

## App URL config (primary + fallback)

`RemoteBackgroundSoundConfig` supports two switchable base URLs:

- Primary: `https://raw.githubusercontent.com/your-org/fanqie-sounds/main`
- Fallback: `https://raw.githubusercontent.com/your-org/fanqie-sounds-backup/main`

The app fetches `catalog/sounds-catalog.json` from primary first.
If primary fails, it retries fallback automatically.

To update URLs in app runtime:

```swift
RemoteBackgroundSoundConfig.updateBaseURLs(
    primary: "https://raw.githubusercontent.com/<org>/<repo>/main",
    fallback: "https://raw.githubusercontent.com/<org>/<backup-repo>/main"
)
```

Each track entry uses a path relative to base URL, for example:

`tracks/rain.mp3`

So the final URL becomes:

`<base-url>/tracks/rain.mp3`
