$ErrorActionPreference = "Stop"
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$ScriptDir = "c:\Users\Admin\Downloads\workspace-23"
$env:ANDROID_HOME = "$ScriptDir\android-sdk"
$TempExtract = "$env:ANDROID_HOME\temp_extract"

Write-Host "setup_android_final.ps1 (Copy-Recurse Strategy)"
Write-Host "Java: $env:JAVA_HOME"

# 1. Clean
if (Test-Path "$env:ANDROID_HOME") {
    Write-Host "Cleaning..."
    Remove-Item -Path "$env:ANDROID_HOME" -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}
New-Item -ItemType Directory -Force -Path "$env:ANDROID_HOME"

# 2. Extract to Temp
Write-Host "Extracting to temp..."
Expand-Archive -Path "android-tools.zip" -DestinationPath $TempExtract -Force
Start-Sleep -Seconds 2

# 3. Copy to structure
Write-Host "Copying to final structure..."
$Dest = "$env:ANDROID_HOME\cmdline-tools\latest"
New-Item -ItemType Directory -Force -Path $Dest

if (Test-Path "$TempExtract\cmdline-tools") {
    Copy-Item -Path "$TempExtract\cmdline-tools\*" -Destination $Dest -Recurse -Force
} else {
    Write-Host "ERROR: cmdline-tools not found in temp!"
    exit 1
}

# Cleanup temp (optional, can fail without blocking)
Remove-Item -Path $TempExtract -Recurse -Force -ErrorAction SilentlyContinue

$SdkManager = "$Dest\bin\sdkmanager.bat"

# 4. Licenses
Write-Host "Licenses..."
"y`ny`ny`ny`ny`ny`ny`ny`n" | Out-File "yes.txt" -Encoding ascii
Get-Content "yes.txt" | & $SdkManager --sdk_root="$env:ANDROID_HOME" --licenses

# 5. Packages
Write-Host "Installing Packages..."
Get-Content "yes.txt" | & $SdkManager --sdk_root="$env:ANDROID_HOME" "platform-tools" "platforms;android-33" "build-tools;33.0.1"

# 6. Build
Write-Host "Building..."
cd android
"sdk.dir=$env:ANDROID_HOME" | Out-File "local.properties" -Encoding ascii
.\gradlew.bat assembleDebug
