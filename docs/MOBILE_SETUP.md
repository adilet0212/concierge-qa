# Running the Appium (Android) suite locally

The native suite in `tests/mobile/` drives the official
[WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app) on an Android
emulator through Appium. You don't need any of this to run the web suites. CI runs the mobile
suite on every push to `main` (see `.github/workflows/android.yml`), so you can skip local setup
entirely if your machine is short on memory.

```
test code ─► WebdriverIO ─► Appium server ─► UiAutomator2 driver ─► emulator / phone
            (this repo)    (started for you    (Android automation
                            by @wdio/appium-    on the device)
                            service)
```

## What you need

| Tool | Why | Notes |
|---|---|---|
| Node.js 22.12+ | runs everything | `node --version` |
| JDK 17 (11 also works) | Appium uses Java tools to sign and inspect APKs | set `JAVA_HOME` |
| Android Studio | gives you the Android SDK, `adb` and the emulator | set `ANDROID_HOME` |
| A computer with 8 GB+ RAM | an emulator needs 2 to 4 GB of its own | on 6 GB machines the emulator is too slow; use CI |

Appium itself and its UiAutomator2 driver are **dev dependencies of this repo**, so
`npm install` already installed them. (Many tutorials say `npm i -g appium` and
`appium driver install uiautomator2`; that's the global way and is not needed here.)

## Windows

1. Install [Android Studio](https://developer.android.com/studio). On first start, let it install
   the default SDK. Then open **More Actions → SDK Manager** and make sure these are installed:
   *Android SDK Platform 35*, *Android SDK Platform-Tools*, *Android Emulator*,
   *Android SDK Command-line Tools*.
2. Create an emulator: **More Actions → Virtual Device Manager → Create device → Pixel 8 →
   API 35 "Google APIs" x86_64 image**. Finish and press ▶ once to check it boots.
3. Install a JDK, e.g. [Eclipse Temurin 17](https://adoptium.net/).
4. Set the environment variables (PowerShell, then open a new terminal):
   ```powershell
   [Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
   [Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot', 'User')
   $path = [Environment]::GetEnvironmentVariable('Path', 'User')
   [Environment]::SetEnvironmentVariable('Path', "$path;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\emulator", 'User')
   ```
   (Adjust the `JAVA_HOME` path to where your JDK was installed.)

## macOS

```bash
brew install --cask android-studio temurin@17
```
Then do steps 1 and 2 above in Android Studio, and add to `~/.zshrc`:
```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
```
On Apple Silicon, create the emulator with an **arm64-v8a** system image instead of x86_64.

## Check your setup

```bash
adb devices
npx appium driver list --installed
npx appium driver doctor uiautomator2
```
- `adb devices` should list `emulator-5554  device` while the emulator runs.
- The doctor must report **0 required fixes**. The optional ones (bundletool, ffmpeg, GStreamer)
  are only for app bundles, screen recording and streaming, which this suite doesn't use.
  (`appium-doctor` is the old standalone tool; with Appium 2 and 3 use `appium driver doctor`.)

## Run the suite

```bash
emulator -list-avds                  # find your emulator's name
emulator -avd Pixel_8_API_35         # or press ▶ in Android Studio
npm run mobile:download-app          # once: downloads the demo APK (~120 MB) into apps/
npm run test:mobile
```

The first run is slow: Appium installs the app and its own helper apps on the emulator.
To use a real phone instead, enable *Developer options → USB debugging*, plug it in, check that
`adb devices` lists it, and run with `ANDROID_DEVICE_NAME=<anything descriptive>`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Timeout: Appium did not start within expected time` | Appium can take 40 s+ to start on Windows (antivirus scans `node_modules`). The config already allows 2 minutes (`appiumStartTimeout`). |
| `ANDROID_HOME is not set` / `adb not found` | Set the variables above and open a **new** terminal. |
| `The instrumentation process cannot be initialized` | The emulator is too slow or still busy after first boot. Wait a few minutes after boot, close other apps, or give the emulator more RAM in Device Manager. |
| A system dialog like "… isn't responding" covers the app | The emulator is overloaded. Tap **Wait**, then use a smaller device, a cold boot, or CI. |
| `Unable to connect to "http://127.0.0.1:4723/"` | Another Appium may already use port 4723. Stop it and retry. |

## How it runs in CI

`.github/workflows/android.yml` starts an Android emulator on a GitHub-hosted Linux runner with
[`reactivecircus/android-emulator-runner`](https://github.com/ReactiveCircus/android-emulator-runner)
(hardware acceleration through KVM), downloads the APK and runs `npm run test:mobile`.
It runs on every push to `main` and can be started by hand (**Actions → Android (Appium) → Run workflow**).
