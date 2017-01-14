call npm run build
cd C:\portable\data\git\ra-ng\dist
copy ..\package.json .
copy ..\README-npm.md .\README.md
dir
call npm publish .
cd ..