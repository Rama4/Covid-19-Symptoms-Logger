# Development History for healthmonitor app

## Initial Commit

    npx react-native@latest init healthmonitor

    mkdir components

    yarn add react-redux redux redux-thunk @reduxjs/toolkit

https://reactnavigation.org/docs/getting-started/

As part of this guide, added this code in the class in MainActivity.java:

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
super.onCreate(null);
}
```

added this in the MainActivity.java:

```java
import android.os.Bundle;
```

https://blog.logrocket.com/react-native-navigation-tutorial/#using-stack-navigator

yarn add @react-navigation/native
yarn add react-native-screens react-native-safe-area-context
yarn add @react-navigation/native-stack

Added screens for home and symptom logging with the required buttons and lists.

Successfully runs on Android device.

## Add React-Native Vision Camera

https://www.react-native-vision-camera.com/docs/guides

    yarn add react-native-vision-camera

    npx pod-install

https://medium.com/@sisongqolosi/vision-camera-react-native-326b9dfb3188

[Tesla's RN camera Doesn't support video]
https://github.com/teslamotors/react-native-camera-kit
yarn add react-native-camera-kit

[using Expo camera]
https://github.com/expo/expo/tree/main/packages/expo-camera#installation-in-bare-react-native-projects

    npx install-expo-modules@latest

    npx expo install expo-camera

Added a few lines in the build.gradle and podfile for maven and permissions

Ran this to build and run on Android: `npx expo run:android`

Successfully runs on Android device.

## Record video with flash and play it

https://github.com/imrohit007/Video-Recording-React-Native-Expo/blob/main/App.js

https://www.smashingmagazine.com/2018/04/audio-video-recording-react-native-expo/

Add react-native-video package

yarn add react-native-video

Able to record videos using expo-camera and play/pause them (not persisting them).

Flash also working and configurable (it is turning on if we set FlashMode.torch, instead of FlashMode.on)

## Add SQLite storage api and Star Rating component

https://blog.logrocket.com/using-sqlite-with-react-native/

yarn add react-native-sqlite-storage

DB connected and table created.

### Add Star Rating component

https://www.atomlab.dev/tutorials/react-native-star-rating

Rating component created and working successfully.

### add insertRow, printTable functions to check the functioning of the DB

sqlite db crud complete: clear db, drop table, insert row, print table functionalities.

## Sqlite crud working, change and store rating for each symptom.

able to change and set rating for every symptom and upload to sqlite db.

run app in Production mode:

    npx expo start --no-dev --minify

## Respiratory Rate Calculator - basic functionality

    using: https://www.npmjs.com/package/react-native-sensors

    https://react-native-sensors.github.io/docs/Installation.html

    install package  with : `yarn add react-native-sensors`

    Followed Android configuration instructions

    In MainApplication.java, linking at runtime was not necessary, got an error that the app is attempting to link an already linked library.. so skipped that part in the guide:

        // Adding react-native-sensors package link
        // Apparently not necessary, as it is linked already.
        // packages.add(new RNSensorsPackage());

    https://react-native-sensors.github.io/docs/Usage.html#Raw-device-acceleration

    https://github.com/react-native-sensors/react-native-sensors/blob/master/docs/API.md

    To compare previous and current emitted objects in the Subscription, used pairwise() to achieve it:
        https://rxjs.dev/api/operators/pairwise

        https://stackoverflow.com/questions/50059622/rxjs-observable-which-emits-both-previous-and-current-value-starting-from-first

    Basic functionality of Accelerometer is working.
    Code refactored, UI slightly improved..

## Sample Native Module invocation working

    able to invoke custom native module methods

## Resp Rate Calculator - better

    refactored the code.
    still not getting accurate readings, need to factor in gravity in the readings..

    1000ms has better accuracy
    100ms not good

## Heart Rate Calculator - initial code

    adding  FS package
        import RNFS from 'react-native-fs';

    The js moves the captured video to `/storage/emulated/0`.
    The native module accesses the file from that location and computes the heart rate.

    Successfully processes the video , but gives inaccurate heart rate.
    Also noticed: upload signs button throws a "no table found" error when it is pressed.

## Add redux read/update functionality - complete

        yarn add react-redux redux redux-thunk @reduxjs/toolkit

        configured Redux, all update actions working.
        symptoms array index update working.

## Make UI look better, sync all values with redux and use it when inserting row into DB,

    insert row and print table functionality working, takes values from redux store.
    redux connection is working for all screens.

## Display DB table in seperate Screen

    guide: https://www.waldo.com/blog/react-native-table

        yarn add react-native-table-component

## release apk for testing on device

    generated a keytool file inside OpenJdK's java path (found using "which java" command), used it to generate a keystore file

        cd "C:\Program Files\OpenJDK\openjdk-11.0.15_10\bin\"


        keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

    Disabled Upload symptoms button if heart rate or resp rate is null.

        cd android
        ./gradlew assembleRelease


    release apk works fine. DB operations work fine.

## toast messages and UX improvements

    https://www.npmjs.com/package/react-native-toast-message

        react-native-toast-message

    show toast upon upload symptoms button press.

    table styled
    symptom list styled
    Home screen:
        show camera -> measure heart rate (button disabled until calculation over).

## Heart rate calculation faster and more accurate

    reduce camera video record quality to 480p -> speed of processing 45 second video is incerased to 10 secs.
    bring all constants of HeartRate monitor algorithm from native to js side for faster testing of values.
    message for user to view table contents from the "See symptom history" button in home screen.

## Accelerometer accurate value

    removed the unused react-native-video package
    archived video playback code to a seperate file for future use.

## final changes

    tested multiple times for accuracy, refactor, etc.

https://stackoverflow.com/questions/66368126/text-color-is-overridden-to-white-when-tested-on-a-device-with-android-10-in-dar

    Font color was white in devices with dark mode enabled, so made the app light - only as a workaround.

## Java heartRate calc nativemodule acceses the same path that expo-camera stores the video file.

    [Note]:
    Iam assuming that expo-camera always stores in that location: data/com.appName/cache/Camera/file.mp4
    this may change with device and version in future!!

    [Note]:
    The docs state that the video is saved in cache directory only, so no issues as of now:
        https://docs.expo.dev/versions/latest/sdk/camera/#recordasyncoptions

## Add Google Maps DistanceMatrix API

    get the distance and duration in normal and heavy traffic conditions.

    sample api call:
    https://maps.googleapis.com/maps/api/distancematrix/json?origins=33.40939294282564,-111.92036727216396&destinations=33.43577345128576,-112.00883875389681&departure_time=now&key=API_KEY
