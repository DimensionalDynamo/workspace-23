# FocusFlow 2026 - Deployment Guide

This guide helps you deploy your FocusFlow app as a PWA and create an APK.

---

## Option 1: Vercel (Recommended - Web PWA)

### Steps:

1. **Push to GitHub**
   ```bash
   cd /home/z/my-project
   git init
   git add .
   git commit -m "Initial commit: FocusFlow 2026"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Deploy"
   - Wait ~2 minutes
   - Get your live URL

3. **Install as PWA on Mobile**
   - Open your Vercel URL on your phone
   - Tap browser menu (three dots)
   - Tap "Add to Home Screen" or "Install App"
   - App will be installed as PWA

---

## Option 2: Capgo (Best for APK)

### Steps:

1. **Build the App**
   ```bash
   cd /home/z/my-project
   bun run build
   ```

2. **Create Capgo Account**
   - Go to [capgo.app](https://capgo.app)
   - Sign up for free account

3. **Create New Project**
   - Click "New Project"
   - Name: "FocusFlow 2026"
   - Framework: Next.js
   - Template: PWA (Optional)

4. **Upload Files**
   - Drag and drop the `.next` folder from build
   - Or upload your entire project folder

5. **Configure App**
   - **App Name**: FocusFlow 2026
   - **Package Name**: com.focusflow.nimcet (or your preference)
   - **Version**: 1.0.0
   - **Icon**: Upload an icon (512x512px PNG)
   - **Splash Screen**: Upload splash image
   - **Status Bar**: Black Translucent
   - **Orientation**: Portrait (or Auto)
   - **Minimum Android**: 8.0
   - **Target Android**: 13.0 (or 14.0)

6. **Build APK**
   - Click "Build" button
   - Wait 5-10 minutes
   - Download APK file

7. **Install on Phone**
   - Transfer APK to your Android phone
   - Enable "Install from Unknown Sources" in Settings
   - Tap APK file to install

---

## Option 3: Nativefier (Alternative for APK)

### Steps:

1. **Build the App**
   ```bash
   cd /home/z/my-project
   bun run build
   ```

2. **Go to Nativefier**
   - Visit [nativefier.com](https://nativefier.com)
   - Sign up for free account

3. **Create New Project**
   - Click "New Project"
   - Drag and drop the entire project folder

4. **Configure App**
   - **App Name**: FocusFlow 2026
   - **Bundle ID**: com.focusflow.nimcet
   - Click "Create PWA"

5. **Settings Tab**
   - **App Type**: Multi-PWA
   - **Distribution**: Public
   - **Icon**: Upload 1024x1024px PNG
   - **Splash Screen**: Upload image
   - **Permissions**: Enable needed permissions

6. **Build Android**
   - Click "Android" tab
   - Click "Build" button
   - Wait 10-15 minutes
   - Download APK

7. **Install on Phone**
   - Same as Capgo steps

---

## Key Features Configured for PWA/APK:

✅ **PWA Ready**
- manifest.json configured with app name, icons, theme colors
- Service worker support
- Offline capability
- Install to home screen
- Standalone app mode

✅ **Mobile Optimized**
- Touch-friendly interface
- Bottom navigation on mobile
- Swipe gestures support
- Responsive layouts
- Safe area insets for notches

✅ **Data Sync**
- All data stored in localStorage
- Works offline
- Persists between sessions
- Export/Import support

✅ **Features Included**
- Dashboard with real-time updates
- Pomodoro timer with fullscreen mode
- Tasks & Habits management
- Analytics with real data
- AI insights (Gemini/ChatGPT)
- Achievement system with badges
- Settings with customization
- Custom backgrounds
- Music/audio support

---

## APK vs Web PWA:

| Feature | Web PWA | APK |
|---------|-----------|-----|
| Installation | Add to Home Screen | Download & Install |
| Storage | Unlimited | Varies by phone |
| Updates | Auto-update | Manual update |
| Notifications | Push (limited) | Full native |
| Performance | Browser-based | Native-optimized |
| File Access | Limited | Full access |

---

## One-Command Development:

To start development:
```bash
cd /home/z/my-project
bun run dev
```

To build for production:
```bash
bun run build
```

To test build locally:
```bash
bun run start
```

---

## Important Notes:

1. **Data Persistence**: All your data is stored in localStorage and will be preserved in both PWA and APK versions

2. **Cross-Platform**: Same codebase works on:
   - Web browsers
   - iOS (Safari - as PWA)
   - Android (Chrome - as PWA or APK)
   - Desktop browsers

3. **API Keys**: AI features use public Gemini API. For production:
   - Add your own API keys
   - Update AI API routes
   - Secure keys in environment variables

4. **Customization**: All your settings (name, background, music, timer preferences) are saved locally

5. **Synchronization**: If you use both web and APK, data won't sync automatically. Use Export/Import to transfer data.

---

## Troubleshooting:

**PWA Not Installing:**
- Ensure you're on HTTPS
- Check manifest.json is accessible
- Try in Chrome Mobile instead of Safari

**APK Not Installing:**
- Enable "Unknown Sources" in phone settings
- Check Android version compatibility
- Clear cache before reinstalling

**Build Errors:**
- Run `bun run clean` before building
- Check node_modules are installed
- Update Bun to latest version

**Blank Screen on Launch:**
- Check browser console for errors
- Verify all API routes are working
- Try clearing app data in Settings

---

## Cost Comparison:

- **Vercel**: Free hosting, custom domain available ($10/yr)
- **Capgo**: Free (5 projects) or $5/mo unlimited
- **Nativefier**: Free tier with branding, $99/yr Pro

---

Need help? Check the worklog.md for all changes made to the project.
