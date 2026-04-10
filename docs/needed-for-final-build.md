## Add this into `android/app/build.gradle` at the very end:

```
apply plugin: 'com.google.gms.google-services'
```

## Add this to `android/build.gradle` with the rest of the `classPaths`

```
classpath('com.google.gms:google-services:4.4.2')
```

## Make sure to download the `google-services.json` file from Firebase and add to `android/app`
