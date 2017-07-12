call gulp
cd D:\workspaces\ra-ng-pub\ra-ng\dist
copy ..\package.json .
copy ..\README-npm.md .\README.md
dir
call npm publish .
cd ..