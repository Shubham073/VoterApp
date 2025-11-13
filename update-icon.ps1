# PowerShell script to copy ECM logo as app icon
# Note: This copies the same image to all sizes. For best results, resize appropriately.

$sourceLogo = "src\assets\ecmapplogo.png"
$androidRes = "android\app\src\main\res"

# Check if source logo exists
if (!(Test-Path $sourceLogo)) {
    Write-Host "Error: Logo file not found at $sourceLogo" -ForegroundColor Red
    exit 1
}

Write-Host "Copying ECM logo to Android app icon folders..." -ForegroundColor Green

# Define all mipmap folders
$mipmapFolders = @(
    "mipmap-mdpi",
    "mipmap-hdpi",
    "mipmap-xhdpi",
    "mipmap-xxhdpi",
    "mipmap-xxxhdpi"
)

# Copy to each folder
foreach ($folder in $mipmapFolders) {
    $destPath = Join-Path $androidRes $folder
    
    if (Test-Path $destPath) {
        # Copy as ic_launcher.png
        Copy-Item $sourceLogo -Destination (Join-Path $destPath "ic_launcher.png") -Force
        Write-Host "  ✓ Copied to $folder/ic_launcher.png" -ForegroundColor Cyan
        
        # Copy as ic_launcher_round.png
        Copy-Item $sourceLogo -Destination (Join-Path $destPath "ic_launcher_round.png") -Force
        Write-Host "  ✓ Copied to $folder/ic_launcher_round.png" -ForegroundColor Cyan
    } else {
        Write-Host "  ✗ Folder not found: $destPath" -ForegroundColor Yellow
    }
}

Write-Host "`nApp icon updated successfully!" -ForegroundColor Green
Write-Host "Note: For best results, you should resize the logo appropriately for each density." -ForegroundColor Yellow
Write-Host "Rebuild the app to see the changes:" -ForegroundColor Cyan
Write-Host "  cd android" -ForegroundColor White
Write-Host "  .\gradlew clean" -ForegroundColor White
Write-Host "  .\gradlew assembleRelease" -ForegroundColor White
