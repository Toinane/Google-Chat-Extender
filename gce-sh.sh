#! /bin/bash

path="/Applications/Chat.app"
previousGCE=false
GCELink="https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/googleChatExtender.js"
GCEPluginLink="https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/googleChatExtenderPlugin.js"
ThemePluginLink="https://raw.githubusercontent.com/Toinane/Google-Chat-Extender/master/plugins/themeLoader.js"

Error () {
  echo "\x1B[31m$1\x1B[0m"
  exit 1
}


installGCE () {
  cd "$path/Contents/Resources/app" || Error "Can't access to Chat.app"
  checkPreviousGCE
  if [ $previousGCE = false ]; then
    modifyMain
  fi
  curl $GCELink >> googleChatExtender.js
  echo "\x1B[32mInstalled GCE Launcher\x1B[0m"
  curl $GCEPluginLink >> googleChatExtenderPlugin.js
  echo "\x1B[32mInstalled GCE Plugin Loader\x1B[0m"
  mkdir plugins
  curl $ThemePluginLink >> plugins/themeLoader.js
  echo "\x1B[32mInstalled Theme Loader Plugin\x1B[0m"

  finish
}

finish () {
  echo ""
  echo "\x1B[97m\x1B[44m##############################\x1B[0m"
  echo "\x1B[44m\x1B[97m#\x1B[0m\x1B[34m GCE is correctly installed \x1B[97m\x1B[44m#\x1B[0m"
  echo "\x1B[97m\x1B[44m##############################\x1B[0m"
  exit 0
}

modifyMain () {
  echo "require(__dirname + '/googleChatExtender.js');" | cat - main.js > temp && mv temp main.js
  echo "\x1B[32mInstalled GCE Initiator\x1B[0m"
}

checkPreviousGCE () {
  if [ -f "./googleChatExtender.js" ]; then
    echo ""
    echo "\x1B[31mPrevious installation of GCE found! Should overwrite it? (Y/n)\x1B[0m"
    read response
    if [ $response = "Y" ] || [ $response = "y" ] || [ $response = "yes" ]; then
      previousGCE=true
    else
      Error "Bye bye!"
    fi
  fi
}

checkApp () {
  echo "Searching Chat.app..."
  echo "$path"
  if [ -d "$path" ]; then 
    echo "\x1B[32mChat.app found!\x1B[0m"
    installGCE
  else
    echo "\x1B[31mChat.app not found!\x1B[0m"
    echo "\x1B[31mPlease write path of Chat.app or quit with \x1B[24mCONTROL+C\x1B[0m"
    read path
    echo ""
    checkApp
  fi
}

echo "\x1B[97m\x1B[44m###############################\x1B[0m"
echo "\x1B[44m\x1B[97m#\x1B[0m\x1B[34m Running installation of GCE \x1B[97m\x1B[44m#\x1B[0m"
echo "\x1B[97m\x1B[44m###############################\x1B[0m"
echo ""

checkApp
