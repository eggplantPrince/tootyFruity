# tootyFruity
TootyFruity is an Ionic 2 app to access Mastodon and other instances on the go! (iOS and Android)

It's currently in open beta for android and available thru TestFlight for iOS users.

[Get TootyFruity for Android](https://play.google.com/apps/testing/ch.kevinegli.tootyfruity221258)


[Get TootyFruity for iOS](https://goo.gl/forms/hzb0b8SARX6CbUbu1)

![alt tag](http://tootyfruity.kevinegli.ch/img/android_ui.jpg)

![alt tag](http://tootyfruity.kevinegli.ch/img/ios_ui.jpg)

How to build
--------

You have to have Ionic 2, Cordova, and NPM installed on your machine.

1.  Clone git repo
2.  Start terminal and cd into the folder
3.  do npm install
4.  Go to src/assets
5.  Create an auth.ts file with the class name `MastodonCredentials`
6.  Get you `redirect_uri`, `client_id` and `client_secret` and assign them to variables in that class
7.  Now save that file and go back to terminal
8.  Do `ionic serve`. This should start the application thru localhost. If there's a new browser tab displaying the TootyFruity welocme screen, you are almost done!
9.  Now `ionic state restore`
10. The application should be ready to add platforms. Look up the `ionic add platform` command and choose your OS
11. To start the application thru an emulator enter `ionic run ios` or `ionic run android` (You may have to create a android emulator thru android studio)
