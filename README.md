# themes-google-chat
Customs Themes for Google Chat

### For MacOS :

Go in Chat.app :
Chat.app > Contents > Resources > app

in the app folder, modify the `main.js`

add this line before all :
```Javascript
  require(__dirname + '/customChat.js')
```

Copy the `customChat.js` from this repo alongside `main.js`

And here we go, launch Chat.app!

you will have a new settings line in settings.
You can add a custom CSS and apply it!
