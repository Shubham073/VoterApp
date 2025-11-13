# Update App Icon Instructions

To use the ECM logo as your app icon, you need to generate different sizes and place them in the Android mipmap folders.

## Quick Steps:

1. **Use an online tool** like [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) or [AppIcon](https://www.appicon.co/)

2. **Upload** `src/assets/ecmapplogo.png`

3. **Download** the generated icons

4. **Replace** the files in these folders:
   - `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
   - `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
   - `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
   - `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

5. **Also replace the round icons** if needed:
   - `ic_launcher_round.png` in each folder

## OR Manual Resize (using any image editor):

- **mdpi**: 48x48 px
- **hdpi**: 72x72 px
- **xhdpi**: 96x96 px
- **xxhdpi**: 144x144 px
- **xxxhdpi**: 192x192 px

After replacing the icons, rebuild the app:
```powershell
cd android
./gradlew clean
./gradlew assembleRelease
```

The logo is already added to the landing page! ✅
