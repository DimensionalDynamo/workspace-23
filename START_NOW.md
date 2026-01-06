# FocusFlow 2026 - Quick Start Guide

## 🚀 START RIGHT NOW (Windows PC)

### Option 1: Run Locally (For Testing)
```powershell
# Navigate to your workspace directory>
cd C:\Users\Admin\Downloads\workspace

# Start development server>
bun run dev

# App opens at: http://localhost:3000

# Open this URL in Chrome or Edge browser
```

---

### Option 2: Build & Test Production Build
```powershell
# Build the app for production>
bun run build

# Test the build locally>
bun run start

# This will run the production version
```

---

## 📱 HOW TO CREATE APK FOR ANDROID 13

### EASIEST WAY: Capgo (RECOMMENDED)

**Why Capgo?**
- ✅ Works directly from your PC (no GitHub required)
- ✅ Free for up to 5 projects
- ✅ Simple drag-and-drop upload
- ✅ Builds APK in 5-10 minutes
- ✅ No sign-up required (guest mode available)

**Steps:**
1. Build your app:
   ```powershell
   bun run build
   ```

2. Go to [https://capgo.app](https://capgo.app)

3. Click "Try for Free" (or sign up with email)

4. Click "New Project"

5. Fill in details:
   - **Project Name**: FocusFlow 2026
   - **Framework**: Next.js
   - **Template**: Leave blank or select "PWA" (auto-detect)

6. Click "Create Project"

7. Upload your files:
   - Drag and drop the `.next` folder from your workspace
   - OR click "Select Folder" and navigate to:
     ```
     C:\Users\Admin\Downloads\workspace\.next
     ```

8. Wait for files to upload (shows progress bar)

9. Configure your app:
   - Click "Config" in the left menu
   
   **App Settings Tab:**
   - **App Name**: FocusFlow 2026
   - **Package Name**: com.focusflow.nimcet
   - **Version**: 1.0.0
   
   **Icon Tab:**
   - Click "Upload" and select a 512x512 PNG icon
   - Can create free icon at: https://favicon.io/
   
   **Splash Screen Tab (Optional):**
   - Upload a 1080x1920 PNG image
   
   **Android Tab:**
   - **Minimum SDK**: 8.0 (Android 13+)
   - **Target SDK**: 33 (Android 13)
   - **Status Bar**: Black Translucent
   
   **Orientation Tab:**
   - **Device Orientation**: Portrait (or Auto if you want rotation)
   
   **Display Tab:**
   - Uncheck "Show Status Bar" (for more immersive)
   
   **Distribution Tab:**
   - **Distribution**: Public (free)

10. Click "Build" button (top right)

11. Wait for build to complete (5-10 minutes)
    - You'll see progress bar
    - Once complete, you'll see download button

12. Click "Download APK"

13. Transfer to your Android phone:
    - Via USB cable
    - Bluetooth file transfer
    - Upload to Google Drive and download on phone
    - Send via email/Telegram/WhatsApp (if under 50MB)

14. Install on Android phone:
    - Go to Settings → Security
    - Enable "Install from Unknown Sources"
    - Find APK file in Downloads
    - Tap APK file
    - Follow on-screen instructions
    - App icon "FocusFlow" will appear

**APK Size**: ~80-120MB (depends on content)

---

## 🌐 HOW TO DEPLOY AS WEB APP

### EASIEST WAY: Vercel (RECOMMENDED)

**Why Vercel?**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Free hosting forever
- ✅ Auto-updates when you push code
- ✅ Works on all devices immediately
- ✅ Progressive Web App (PWA) install support

**Steps:**
1. Create GitHub account (if you don't have)
   - Go to github.com
   - Click "Sign up" (free)
   - Verify your email

2. Create a new repository:
   - Click "+" in top right
   - Repository name: `focusflow-2026`
   - Make it Public (for free hosting)
   - Click "Create repository"
   - Click "Upload an existing file" (at the bottom)
   - Drag and drop your ENTIRE workspace folder

3. Push your code to GitHub:
   ```powershell
   # In your workspace directory>
   git init
   git add .
   git commit -m "Initial commit: FocusFlow 2026"
   git remote add origin https://github.com/yourusername/focusflow-2026.git
   git branch -M main
   git push -u origin main
   ```
   **Note**: Replace `yourusername` with your actual GitHub username

4. Deploy to Vercel:
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Sign up" or "Sign in" (use GitHub for easiest)
   - Click "New Project"

5. Import from GitHub:
   - Click "Import from Git"
   - Select your `focusflow-2026` repository
   - Click "Import"

6. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Leave as `.` (default)
   - **Build Command**: `npm run build` or leave as auto
   - **Output Directory**: Leave as `.next`
   - **Install Command**: Leave as auto
   - Click "Deploy"

7. Wait for deployment (~2-3 minutes)
    - You'll see live URL like: `https://focusflow-2026.vercel.app`

8. Test on your phone:
    - Open the Vercel URL in your phone browser
    - On iOS Safari: Tap "Share" → "Add to Home Screen"
    - On Android Chrome: Tap menu (three dots) → "Add to Home Screen" or "Install App"

**Your app is now live!** 🎉

---

## 🎯 RECOMMENDED WORKFLOW

### For Daily Use (Web App):
1. Deploy to Vercel (takes 5 minutes)
2. Bookmark the URL on your PC browser
3. Add to Home Screen on your phone
4. Use the PWA version (fast, auto-updates)

### For Offline/Android Use (APK):
1. Build APK using Capgo (takes 20 minutes)
2. Install on your Android phone
3. Use offline without any browser
4. Native notifications and file access
5. Install once, use forever (no updates needed)

---

## 📋 CHECKLIST BEFORE DEPLOYING

### Test Locally First:
```powershell
# Run dev server>
bun run dev

# Open http://localhost:3000

# Test these features:>
[ ] Dashboard shows "Hello, Aditya Anand"
[ ] NIMCET countdown is working
[ ] Start a Pomodoro session
[ ] Test fullscreen mode (click square button)
[ ] Add a custom music file
[ ] Add a task
[ ] Add a habit
[ ] Check analytics (no fake data!)
[ ] Generate AI summary
[ ] Switch AI engine (Gemini ↔ ChatGPT)
[ ] Check notifications (bell icon)
[ ] Customize your name in Settings
[ ] Change background
[ ] Export your data
```

### Check Requirements:
- [ ] Windows 10 or higher (for development)
- [ ] Node.js 18+ (Bun includes this)
- [ ] Chrome or Edge browser (for testing)
- [ ] Android 13+ phone (for APK)
- [ ] GitHub account (for web deployment)
- [ ] Stable internet connection (for deployment)

---

## 🎨 CUSTOMIZATION STEPS

### 1. Update Your Name (Already: "Aditya Anand")
The app already shows your name! If you want to change it:
1. Open the app
2. Go to "Settings" screen (bottom right icon)
3. Find "Profile" section
4. Enter new name in "Your Name" field
5. Click "Update" button
6. Greeting changes immediately

### 2. Try Fullscreen Mode
1. Open "Focus" (Pomodoro) screen
2. Click the square button (maximize icon) at bottom of timer
3. Browser goes fullscreen (hides all chrome)
4. Click "X" button (top right) to exit fullscreen
5. Press ESC key to exit fullscreen

### 3. Upload Custom Music
1. Open "Settings" screen
2. Click "Music" tab
3. Click "Choose File" button
4. Select an MP3, WAV, or M4A file from your PC
5. Click "Upload" button
6. Track appears in "Your Tracks" list
7. Go to Pomodoro screen to use it

### 4. Change Background
1. Open "Settings" screen
2. Click "Background" tab
3. Click on a preset button (6 options):
   - Calm Dark (default)
   - Ocean Deep
   - Forest Night
   - Midnight Purple
   - Solid Dark
   - Solid Gray
4. OR upload custom image:
   - Click "Upload Image"
   - Select PNG/JPG file
   - Click "Save"
   - See preview before applying
5. Go to Pomodoro → fullscreen to see background

### 5. Switch AI Engine
1. Open "AI" screen
2. Click dropdown at top right (shows "Gemini" or "GPT-4")
3. Click "Switch to ChatGPT" or "Switch to Gemini"
4. Toast confirmation appears
5. All AI features now use selected engine

---

## 📱 USING ON YOUR ANDROID 13 PHONE

### Installing APK from PC:
1. **USB Method** (Fastest):
   - Connect phone to PC via USB
   - On phone: Settings → Developer Options → Enable "USB Debugging"
   - On PC: File Explorer → Phone name → Download folder
   - Copy APK file to phone's Download folder
   - Disconnect and open file manager on phone
   - Tap APK to install

2. **Bluetooth Method**:
   - Enable Bluetooth on both devices
   - Right-click APK on PC → Send via Bluetooth
   - Accept pairing on phone
   - Receive file in Bluetooth app
   - Tap received file to install

3. **Google Drive Method**:
   - Upload APK to Google Drive on PC
   - Open Google Drive app on phone
   - Download APK from Drive
   - Tap to install

4. **Cloud Method** (Dropbox, OneDrive):
   - Upload APK to cloud storage on PC
   - Download from phone's cloud app
   - Tap to install

**Installation Settings Required:**
- Go to Settings → Security
- Enable "Install from Unknown Sources"
- You'll see warning about unknown sources (this is normal)
- Tap "Settings" → "Install anyway" to proceed

---

## 🔧 TROUBLESHOOTING

### Port 3000 Already in Use:
```powershell
# Find and kill process>
netstat -ano | findstr :3000
# Note the PID (last number)

# Kill the process>
taskkill /PID <PID> /F

# Or use different port>
bun run dev -- -p 3001
```

### Build Fails:
```powershell
# Clean and rebuild>
rm -rf .next
rm -rf node_modules
bun install
bun run build
```

### "bun run dev" Doesn't Start:
```powershell
# Check if you're in correct directory>
pwd
# Should show: C:\Users\Admin\Downloads\workspace

# Navigate if needed>
cd C:\Users\Admin\Downloads\workspace

# Try again>
bun run dev
```

### Browser Shows White Screen:
- Open browser developer tools (F12)
- Check Console tab for errors
- Check Network tab for failed API calls
- Reload the page (Ctrl + Shift + R)

### APK Won't Install:
- Make sure you enabled "Install from Unknown Sources"
- Check Android version (must be 13+)
- Clear app cache: Settings → Apps → FocusFlow → Clear Cache
- Restart phone
- Try a different file transfer method

### App Crashes on Launch:
- Check if phone has enough storage (need ~200MB free)
- Clear cache before installing
- Reinstall APK
- Check logs: Settings → Apps → FocusFlow → Clear Data

---

## 📊 PERFORMANCE TIPS

### For Best App Performance:
1. Use Chrome or Edge on PC (best Next.js support)
2. Keep at least 8GB RAM free
3. Close other browser tabs when developing
4. Use latest version of Bun
5. Clear .next folder and rebuild frequently

### For Best APK Performance:
1. Use a stable internet connection when building
2. Upload only `.next` folder (not entire workspace)
3. Use simple app icon (no animations)
4. Keep splash screen file size under 1MB
5. Don't include unnecessary assets in build

---

## 🎓 USING FOR NIMCET PREPARATION

### Daily Study Routine:
1. **Morning (9:00 - 11:00)**
   - Open Dashboard to see countdown
   - Start Pomodoro session (25 min focus, 5 min break)
   - Study Mathematics or Logical Ability
   - Use YouTube video background for focus

2. **Afternoon (2:00 - 5:00)**
   - Check Analytics for progress
   - Review weak chapters
   - Practice with mock tests
   - Log test results
   - Track habits

3. **Evening (7:00 - 9:00)**
   - Generate AI Study Plan
   - Review AI insights
   - Work on weak areas
   - Update syllabus progress
   - Check off pending tasks

### Weekly Goals:
- Complete 35-40 Pomodoro sessions (approx. 15-20 hours study)
- Take 2-3 full mock tests
- Review and mark 10 chapters as "Practiced"
- Maintain 7-day streak
- Earn at least 2-3 new badges

---

## 💾 DATA MANAGEMENT

### Export Your Data (Backup):
1. Open "Settings" screen
2. Go to "Data" tab
3. Click "Export All Data" button
4. Downloads JSON file to PC
5. Keep this file as backup

### Import Your Data:
1. Copy JSON backup file to device
2. Open app (PC or APK)
3. Data will automatically load from localStorage
4. Verify all settings, tasks, progress are present

### Reset App:
1. Open "Settings" screen
2. Go to "Data" tab
3. Scroll to "Danger Zone" section
4. Click "Reset All Data" red button
5. Confirm in dialog
6. All data cleared, app restarts fresh

---

## 🌟 FEATURE HIGHLIGHTS

### Premium Typography:
- Your name "Aditya Anand" displayed in Playfair Display font
- Gradient text effect for elegance
- Premium, calming design

### Advanced Focus Mode:
- True browser fullscreen (no chrome)
- 6 beautiful background presets
- Custom image backgrounds
- YouTube video backgrounds in fullscreen
- Custom music file support
- Volume control with mute

### AI Intelligence:
- Switch between Gemini and ChatGPT with one click
- Weekly performance summary
- Strength and weakness analysis
- Smart study plan generator
- AI study chat assistant
- All insights saved locally

### Real Data Throughout:
- Dashboard uses actual study data
- Analytics shows real sessions, tests, progress
- No fake numbers or mock data
- Accurate calculations and trends

### Complete PWA:
- Install to Home Screen on mobile
- Offline capability
- Safe area insets for notches
- Auto-optimization for networks
- Persistent local storage

---

## 🚀 START NOW!

### Run Development Server (Windows):
```powershell
cd C:\Users\Admin\Downloads\workspace
bun run dev
```

**Then open**: http://localhost:3000

---

### Build APK (Windows):
```powershell
# Step 1: Build>
bun run build

# Step 2: Go to capgo.app
# Step 3: Upload .next folder
# Step 4: Configure app and build APK
# Step 5: Download and install on Android 13
```

---

### Deploy Web App (Windows):
```powershell
# Step 1: Create GitHub repo>
# (See instructions above in "HOW TO DEPLOY AS WEB APP")

# Step 2: Push code to GitHub>
git add .
git commit -m "FocusFlow 2026"
git push

# Step 3: Deploy to Vercel>
# (See vercel.com instructions)
```

---

## 🎉 YOU'RE READY!

**Your FocusFlow 2026 app has:**
- ✅ Premium design with your name
- ✅ Real data tracking (no mocks)
- ✅ Advanced focus mode with fullscreen
- ✅ Custom music and backgrounds
- ✅ AI intelligence with engine switcher
- ✅ Complete analytics and progress tracking
- ✅ Achievement and badge system
- ✅ Notification center
- ✅ All settings customizable
- ✅ Ready for web deployment
- ✅ Ready for APK creation

**Start your NIMCET 2026 preparation journey now!** 🎓
