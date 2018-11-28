electron-packager ./ Drips --platform=darwin --icon=icon/icon.icns
rm -r Drips-darwin-x64/Drips.app/Contents/Resources/app/node_modules
cp -r node_modules Drips-darwin-x64/Drips.app/Contents/Resources/app/node_modules
