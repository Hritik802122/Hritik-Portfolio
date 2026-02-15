@echo off
echo CHECKING STATUS... > git_debug.log
git status >> git_debug.log 2>&1

echo CHECKING CONFIG... >> git_debug.log
git config user.name >> git_debug.log 2>&1
git config user.email >> git_debug.log 2>&1

echo SETTING CONFIG... >> git_debug.log
git config user.email "hritik802122@gmail.com"
git config user.name "Hritik802122"

echo ADDING FILES... >> git_debug.log
git add . >> git_debug.log 2>&1

echo COMMITTING... >> git_debug.log
git commit -m "Final Cinematic Polish: Hero image redesign, blending, and project updates" >> git_debug.log 2>&1

echo PUSHING... >> git_debug.log
git push -u origin main --force >> git_debug.log 2>&1

echo DONE. >> git_debug.log
