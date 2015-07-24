rm -rfv ../.doc.build
cd ../
mkdir .doc.build
cd .doc.build
git init
heroku git:remote -a app-kit
cd ../bin