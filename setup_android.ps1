$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$ScriptDir = "c:\Users\Admin\Downloads\workspace-23"
$env:ANDROID_HOME = "$ScriptDir\android-sdk"
$TempExtract = "$env:ANDROID_HOME\temp_extract"

Write-Host "Setting up Android SDK (Attempt 4)..."
Write-Host "Java Home: $env:JAVA_HOME"

# FUNCTION: Robust Extract
function Extract-And-Setup {
    Write-Host "Checking if SDK tools need extraction..."
    $SdkManagerCheck = "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat"
    
    if (Test-Path $SdkManagerCheck) {
        Write-Host "SDK tools already extracted at $SdkManagerCheck"
        return
    }

    Write-Host "Fresh setup required. Cleaning old attempts..."
    if (Test-Path "$env:ANDROID_HOME") {
        Remove-Item -Path "$env:ANDROID_HOME" -Recurse -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
    New-Item -ItemType Directory -Force -Path "$env:ANDROID_HOME"

    Write-Host "Extracting tools to temp..."
    if (!(Test-Path "android-tools.zip")) {
        Write-Host "ERROR: android-tools.zip not found!"
        exit 1
    }
    Expand-Archive -Path "android-tools.zip" -DestinationPath $TempExtract -Force

    Write-Host "Restructuring folders..."
    if (Test-Path "$TempExtract\cmdline-tools") {
        New-Item -ItemType Directory -Force -Path "$env:ANDROID_HOME\cmdline-tools"
        Move-Item -Path "$TempExtract\cmdline-tools" -Destination "$env:ANDROID_HOME\cmdline-tools\latest"
        Remove-Item -Path $TempExtract -Recurse -Force
    } else {
        Write-Host "ERROR: cmdline-tools not found in temp extract!"
        Get-ChildItem $TempExtract
        exit 1
    }
}

# Run Extraction
Extract-And-Setup

$SdkManager = "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat"

if (!(Test-Path $SdkManager)) {
    Write-Host "ERROR: sdkmanager not found at $SdkManager after setup."
    exit 1
}

Write-Host "Installing Components..."
Write-Host "Accepting licenses..."
# Robust license acceptance: pipe many 'y' characters
1..30 | ForEach-Object { echo "y" } | & $SdkManager --sdk_root="$env:ANDROID_HOME" --licenses

Write-Host "Installing platform-tools and android-33..."
# We reuse the yes pipe just in case, though usually not needed for install if licenses accepted
1..10 | ForEach-Object { echo "y" } | & $SdkManager --sdk_root="$env:ANDROID_HOME" "platform-tools" "platforms;android-33" "build-tools;33.0.1"

Write-Host "Building APK..."
if (!(Test-Path "android")) {
    Write-Host "ERROR: 'android' directory not found. Is Capacitor initialized?"
    exit 1
}
cd android
"sdk.dir=$env:ANDROID_HOME" | Out-File "local.properties" -Encoding ascii
.\gradlew.bat assembleDebug
