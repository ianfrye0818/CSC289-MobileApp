## Register for push notifications

### iOS Setup (Must have an Apple Developer Account)

1. Login with eas -> `eas login`
2. Run `eas build` and select iOS as the platform
3. Choose iOS bundle ID
4. Enter Apple Credentials
5. Run `npx expo run:ios --device`
6. Select the device you want to test on

### Android Firebase Setup (Must have a Firebase Account)

1. Login to Firebase Console and create a new project -> https://console.firebase.google.com/
2. In terminal run `npx expo prebuild` to generate the android folder
3. Enter android package name
4. Create a new android app in Firebase Console and put in package name
5. Download the google.services.json file and place it in the android folder
   `android/app/google-services.json`
6. In `app.json` add the following:
   ```json
   "android": {
    "package": "Your-Android-Package-Name",
    "googleServicesFile": "./android/app/google-services.json"
   }
   ```
7. Run `eas build` and select android as the platform
8. Go back to Firebase -> go to Settings -> Project Settings -> Service Accounts -> Generate New
   Private Key
9. Go to Expo App Services Page -> Credentials (Should see Android App)
10. Scroll to FMC V1 Service Account Key -> Add a service account key
11. Upload your generated private key file
12. In terminal run `npx expo run:android --device` and select the device you want to test on

**NOTE** After building - you may get an error that you need to add firebase or google services to
your app - even with the `google-services.json` file in the android folder If this is the case,
follow the steps below:

1. Update `android/build.gradle` and add this in the `buildscript.dependencies` block:

```groovy
classpath('com.google.gms:google-services:4.4.2')
```

2. Add this to the `android/app/build.gradle` at the very bottom:

```groovy
apply plugin: 'com.google.gms.google-services'
```
