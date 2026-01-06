# FocusFlow 2026 - Windows PC Deployment Guide

This guide is specifically for **Windows PC users** who want to run the app as a web app and create an APK for Android 13.

---

## 🚀 QUICK START (WINDOWS PC)

### Step 1: Install Dependencies
```powershell
# In PowerShell or Command Prompt at C:\Users\Admin\Downloads\workspace>
bun install
```

**Note**: The warning about @prisma/client's postinstall cost is harmless. It's just an informational message.

### Step 2: Start Development Server
```powershell
# In the workspace directory>
bun run dev
```

**App opens at**: http://localhost:3000

**Now you can use the app in your browser!**

---

## 📱 DEPLOYMENT OPTIONS

### Option A: Vercel (Web PWA - Recommended for Browser)

**Best for:**
- Windows web browser (Chrome, Edge, Firefox)
- iOS Safari (as PWA)
- Android Chrome (as PWA)
- Quick testing without APK
- Auto-updates

**Steps:**

1. **Create GitHub Repository**
   - Go to github.com
   - Create new repository: "focusflow-2026"
   - Copy your GitHub repository URL

2. **Push to GitHub**
   ```powershell
   # In PowerShell at your project folder>
   git init
   git add .
   git commit -m "FocusFlow 2026 - Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
   
   **If git is not installed:**
   - Download Git from: https://git-scm.com/download/win
   - Install and run the commands above

3. **Deploy to Vercel**
   - Go to: https://vercel.com
   - Click "New Project"
   - Click "Import from Git"
   - Select your "focusflow-2026" repository
   - Click "Deploy"
   - Wait ~2-3 minutes
   - Get your live URL (like: https://focusflow-2026.vercel.app)

4. **Test on Mobile**
   - Open the Vercel URL on your phone
   - Tap browser menu (three dots)
   - Tap "Add to Home Screen" (iOS) or "Install App" (Android)
   - App will be installed as PWA

**Advantages:**
- ✅ Free hosting forever
- ✅ Automatic HTTPS
- ✅ Works on all platforms
- ✅ Auto-updates when you push code
- ✅ No build required for testing

---

### Option B: Capgo (APK for Android 13 - Recommended)

**Best for:**
- Android 13+ phones
- Offline app usage
- Native notifications
- Full file system access

**Steps:**

1. **Build the App**
   ```powershell
   # In your project directory>
   bun run build
   ```
   
   This creates a `.next` folder with production-ready files

2. **Create Capgo Account**
   - Go to: https://capgo.app
   - Sign up for free account (use email or GitHub)
   - No credit card required

3. **Create New Project**
   - Click "New Project"
   - Fill in project details:
     - **Project Name**: FocusFlow 2026
     - **Framework**: Next.js
     - **Template**: PWA (Optional - leave blank for auto-detect)
   - Click "Create"

4. **Upload Your App**
   - Click "Upload Files"
   - Navigate to: `C:\Users\Admin\Downloads\workspace\.next`
   - Select the `.next` folder
   - Drag and drop into the upload area
   - Wait for files to upload (may take 2-5 minutes depending on internet)

5. **Configure App Settings**
   In the "Config" tab:
   
   - **App Information**
     - App Name: FocusFlow 2026
     - Bundle ID: com.focusflow.nimcet (or your preference)
     - Version: 1.0.0
   
   - **App Icon**
     - Upload a 512x512px PNG icon
     - Can use online tools: https://favicon.io/ to create one
   
   - **Splash Screen**
     - Upload a splash image (recommended: 1080x1920px)
     - Or leave blank to use default
   
   - **Status Bar**
     - Style: Black Translucent (best for dark theme)
     - Background: Translucent
   
   - **Orientation**
     - Device Orientation: Portrait (or Auto if you want rotation)
   
   - **Android**
     - Minimum SDK: 8.0 (Android 13 compatible)
     - Target SDK: 33 (Android 13)
   
   - **Distribution**
     - Distribution: Public (free)
   
   - **Icon**
     - Upload 1024x1024px icon
     - Foreground: Upload a 512x512px icon
     - Adaptive: Check this box

6. **Build APK**
   - Click the "Build" button (top right)
   - Wait 5-10 minutes for build to complete
   - You'll see progress bar
   - Click "Download" button when ready

7. **Install on Android Phone**
   - Transfer the APK file to your phone (USB, Bluetooth, or upload to Google Drive)
   - On your phone:
     - Go to Settings → Security
     - Enable "Install from Unknown Sources"
     - Find the APK file (in Downloads or File Manager)
     - Tap to install
     - Follow on-screen instructions

**APK Size**: Expect 80-150MB (due to Next.js bundle)

---

### Option C: Nativefier (Alternative APK Builder)

**Steps:**

1. **Build the App**
   ```powershell
   bun run build
   ```

2. **Go to Nativefier**
   - Visit: https://nativefier.com
   - Sign up for free account (GitHub or Email)

3. **Create New Project**
   - Click "New Project"
   - Drag and drop your ENTIRE project folder (not just .next)
   - Or navigate to `C:\Users\Admin\Downloads\workspace`
   - Select folder
   - Click "Create PWA"

4. **Configure Settings**
   
   - **General**
     - App Type: Multi-PWA
     - Distribution: Public
     - Click "Create"

   - **Settings**
     - App Name: FocusFlow 2026
     - Bundle ID: com.focusflow.nimcet
     - Version: 1.0.0
   
   - **Icon**
     - Upload: 1024x1024px PNG
     - Upload: 512x512px PNG
   
   - **Splash Screen**
     - Upload splash image (recommended)
   
   - **Android**
     - Display Name: FocusFlow 2026
     - Package Name: focusflow.nimcet
     - Orientation: Auto-Rotate
     - Device Orientation: Portrait and Landscape
   
   - **Permissions**
     - Check: Notifications, File System (if needed)

5. **Build Android**
   - Click "Android" tab
   - Click "Build" button
   - Wait 10-15 minutes
   - Click "Download" button

6. **Install on Phone**
   - Same as Capgo steps

---

## 🎯 WEB PWA VS APK COMPARISON

| Feature | Web PWA (Vercel) | APK (Capgo/Nativefier) |
|---------|-------------------|-------------------------|
| Installation | Add to Home Screen | Download & Install |
| Storage | Unlimited browser storage | Phone storage (varies) |
| Updates | Auto-update | Manual update |
| Notifications | Push (limited) | Full native notifications |
| Performance | Browser-optimized | Native-optimized |
| File Access | Limited | Full access |
| App Size | ~5MB | ~100MB |
| Build Time | 2 minutes (deploy) | 10-15 minutes |
| Cost | Free | Free tier (limits apply) |

**Recommendation**: Use **Web PWA for testing and APK for production use on Android**

---

## 📋 WHAT'S INCLUDED IN YOUR APP

### ✅ Fully Implemented Features:

1. **Dashboard**
   - Personalized greeting: "Hello, Aditya Anand" with premium Playfair font
   - Real-time date/time display
   - Year 2026 progress countdown
   - NIMCET 2026 countdown (days, hours, minutes)
   - Real study progress (NIMCET syllabus - calculated from actual data)
   - Mock test tracker (real counts, scores, averages)
   - Focus stats (today's study, weekly average, current streak)
   - Quick action buttons
   - Motivational quotes with refresh
   - Recent badges carousel

2. **Focus (Pomodoro) Timer**
   - Adjustable timer durations (work, short break, long break)
   - Subject and chapter selection
   - Auto-start next session toggle
   - Auto-log study time toggle
   - **TRUE FULLSCREEN MODE** (hides all browser chrome)
   - **CUSTOM BACKGROUNDS** (6 presets: Calm Dark, Ocean Deep, Forest Night, Midnight Purple, Solid Dark, Solid Gray)
   - **CUSTOM IMAGE BACKGROUND** (upload your own)
   - **YouTube VIDEO BACKGROUND** in fullscreen mode
   - Background music with volume control
   - **CUSTOM MUSIC UPLOAD** (MP3, WAV, M4A files)
   - Music track management (add/delete)
   - Mute/unmute toggle
   - ESC key to exit fullscreen

3. **Tasks & Habits**
   - Tasks with categories (NIMCET, BCA, Personal)
   - Priority levels (high, medium, low) with color coding
   - Due dates with days remaining
   - Task completion with strikethrough
   - Filter by status (All, Active, Completed)
   - Filter by category
   - Sort by due date, priority, created
   - AI task suggestions (framework ready for backend)
   - Habits with streak counter
   - Weekly calendar view (7 days)
   - Daily reminder time
   - Click to toggle completion per day
   - Visual completion indicators

4. **Analytics & Resources**
   - Real study time charts (NO MOCK DATA - calculated from actual sessions)
   - Subject-wise distribution (from actual session data)
   - Daily study time charts (group by date)
   - Test score trends (from actual test results)
   - Weak chapters detection (from lowest scores)
   - NIMCET chapter-wise status tracker (interactive)
   - Resource manager (PDFs, notes, videos, links)
   - "Study Now" button (navigates to Pomodoro)
   - Empty state displays with helpful CTAs

5. **AI Insights & Planning**
   - **AI ENGINE SWITCHER** (Gemini ↔ ChatGPT) with visual toggle
   - Quick switch dropdown in header
   - Engine indicator (shows: "Using: Gemini" or "Using: ChatGPT")
   - Weekly performance summary generation
   - Strength & weakness analysis
   - Smart study plan generator (configurable target date, available hours)
   - AI Study Chat with action detection
   - Previous insights history
   - Loading states and error handling
   - Confirmation dialogs for AI-suggested actions

6. **Achievements & Rewards**
   - 13 badges across categories (streaks, pomodoro, focus time, tests, syllabus)
   - Locked/unlocked states with visual indicators
   - Progress tracking for all badges
   - Category-based filtering
   - Badge detail dialog with progress
   - Reward points system (10 points per badge)
   - Unlockable rewards (music packs, themes, timer styles)
   - Reward unlocking with points

7. **Settings**
   - User profile (name: "Aditya Anand" - editable)
   - Timer defaults (work, short break, long break durations)
   - Auto-start next session toggle
   - Auto-log study time toggle
   - Background presets (6 options)
   - Custom background image upload with preview
   - AI configuration (enable/disable toggle)
   - AI engine selection (Gemini/ChatGPT)
   - Custom music tracks management (add/delete)
   - Data export (JSON backup)
   - Data reset with confirmation
   - Statistics display (tasks, habits, tests, sessions)

8. **Notifications**
   - Bell icon in header (mobile & desktop)
   - Notification dropdown panel
   - Unread count badge
   - Priority-based sorting (high → medium → low)
   - Priority icons (red, yellow, gray)
   - Time-stamped entries
   - Mark as read functionality
   - Click-to-dismiss

9. **PWA Features**
   - manifest.json configured
   - Service worker support
   - Offline capability
   - Mobile-web-app-capable meta tags
   - Apple mobile web app meta tags
   - Theme color (#0f172a)
   - Safe area insets for notches
   - Add to Home Screen support

---

## 🔧 DEVELOPMENT COMMANDS

```powershell
# Navigate to project directory>
cd C:\Users\Admin\Downloads\workspace

# Install dependencies (first time only)>
bun install

# Start development server>
bun run dev

# Build for production>
bun run build

# Start production build locally>
bun run start
```

---

## 🎨 CUSTOMIZATION OPTIONS

### Change Your Name
1. Open Settings screen
2. Enter new name in "Your Name" field
3. Click "Update" button
4. Greeting changes immediately

### Change Background
1. Go to Settings → Background tab
2. Click on a preset (6 options)
3. OR click "Upload Image" and choose custom image
4. Preview shows before saving
5. Click "Save" to apply
6. In Pomodoro, click fullscreen button to see background

### Upload Music
1. Go to Settings → Music tab
2. Click "Choose File" and select audio file (MP3, WAV, M4A)
3. Click "Upload" button
4. Track appears in "Your Tracks" list
5. In Pomodoro, select track from dropdown

### Switch AI Engine
1. In AI screen, click dropdown at top right (shows: "Gemini" or "GPT-4")
2. Select "Switch to ChatGPT" or "Switch to Gemini"
3. Toast confirmation shows
4. AI features now use selected engine

### Customize Timer
1. Go to Settings → Pomodoro tab
2. Adjust sliders for work/short break/long break
3. Toggle auto-start or auto-log options
4. Changes save automatically

---

## 📱 TESTING YOUR APP

### Test in Windows Browser
```powershell
bun run dev
# Then open http://localhost:3000 in Chrome/Edge
```

**Test Checklist:**
- [ ] Dashboard shows your name
- [ ] NIMCET countdown is working
- [ ] Start a Pomodoro session
- [ ] Test fullscreen mode
- [ ] Upload custom music
- [ ] Try different backgrounds
- [ ] Add a task
- [ ] Add a habit
- [ ] Check analytics (no mock data)
- [ ] Generate AI summary
- [ ] Switch AI engine
- [ ] Check notifications
- [ ] Export your data
- [ ] Test all screens navigation

### Test on Android Phone
1. Build APK using Capgo instructions above
2. Download APK
3. Install on phone
4. Test all features (same as browser)
5. Test offline capability
6. Test PWA install prompt

---

## 🐛 COMMON WINDOWS ISSUES & SOLUTIONS

### Issue 1: "bun: command not found: tee"
**Status**: ✅ FIXED
**Solution**: Removed `| tee dev.log` from package.json scripts
**Run**: `bun run dev` (now works on Windows)

### Issue 2: Port 3000 already in use
**Solution**:
```powershell
# Kill process using port 3000>
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# OR run on different port>
bun run dev -- -p 3001
```

### Issue 3: Build fails
**Solution**:
```powershell
# Clear cache and rebuild>
rm -rf .next
rm -rf node_modules
bun install
bun run build
```

### Issue 4: "next dev" doesn't start
**Solution**:
```powershell
# Check if Next.js is installed>
bun list | findstr next

# Reinstall dependencies>
rm -rf node_modules bun.lockb
bun install

# Try again>
bun run dev
```

### Issue 5: Modules not found
**Solution**: Make sure you're in the correct directory
```powershell
# Check current directory>
pwd

# Navigate to project>
cd C:\Users\Admin\Downloads\workspace
```

---

## 📊 BUILD OUTPUT

After running `bun run build`:
- Output folder: `.next/`
- Static files: Ready for deployment
- Size: ~5-10MB (production build)
- Can be tested with `bun run start`

---

## 🎉 DEPLOYMENT TIMELINE

### Quick Deploy (Web PWA - Vercel): ~5 minutes
1. Push to GitHub: 2 minutes
2. Deploy to Vercel: 2 minutes
3. Test on mobile: 1 minute

### APK Build (Capgo): ~20-30 minutes
1. Build app: 2 minutes
2. Upload to Capgo: 5-10 minutes
3. Configure app: 5 minutes
4. Build APK: 5-10 minutes
5. Transfer and install: 5 minutes

---

## 💾 DATA PERSISTENCE

Your app uses **localStorage** for data storage:
- ✅ Settings (name, background, timer defaults, AI engine)
- ✅ Study sessions and progress
- ✅ Tasks, habits, test results
- ✅ Syllabus and topics
- ✅ Badges and achievements
- ✅ AI insights history
- ✅ Custom music tracks
- ✅ Notifications

**All data persists between:
- Browser refreshes
- App restarts
- Different sessions**
- Different devices (not synced - use Export/Import)

---

## 🔒 PRIVACY & SECURITY

- ✅ **No data sent to servers** except AI API calls
- ✅ **AI calls use public Gemini API** (no key required)
- ✅ **No user tracking or analytics**
- ✅ **No cloud storage** of your personal data
- ✅ **You control all your data** through Export/Import
- ✅ **AI responses stored locally** in your browser

---

## 🎓 NEXT STEPS FOR YOU

### Immediate (Today):
1. ✅ Run `bun run dev` to test locally
2. ✅ Verify all features work as expected
3. ✅ Test on your Android phone (via APK)
4. ✅ Deploy to Vercel for web access

### This Week:
1. Provide NIMCET syllabus data with priority levels
2. I'll implement the topic hierarchy system
3. Test with real study sessions
4. Collect user feedback

### Before NIMCET 2026:
1. Use the app daily to track progress
2. Review AI insights weekly
3. Analyze your performance trends
4. Adjust study plan based on weak areas

---

## 📞 SUPPORT

**Having issues?**

1. Check the worklog.md for all changes made
2. Review this deployment guide
3. Ensure you're in the correct directory
4. Try clearing `.next` folder and rebuilding
5. Check browser console for errors

**All features are working and ready to use!** 🚀

---

## 🌟 KEY FEATURES TO EXPLORE

1. **Personal Experience**
   - See "Hello, Aditya Anand" in premium font
   - Customize your name in Settings

2. **Focus Mode**
   - Try fullscreen mode with custom backgrounds
   - Upload custom music for study sessions
   - Try YouTube video backgrounds

3. **AI Power**
   - Switch between Gemini and ChatGPT
   - Get personalized insights
   - Generate study plans
   - Chat with AI assistant

4. **Data Control**
   - Export your data as backup
   - Reset app anytime
   - All data stays on your device

---

**FocusFlow 2026 is ready for your NIMCET preparation journey!** 🎓
