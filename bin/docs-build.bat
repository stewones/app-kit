cd ../
rm -rfv .doc.build/*
cp -rfv docs .doc.build
cp docs-server.js .doc.build
cp package.json .doc.build
cd .doc.build
git add -A
git commit -am "new docs build"
git push --force heroku master