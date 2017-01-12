cd C:\portable\data\git\ra-ng\dist
copy ..\package.json .
copy ..\README-npm.md .\README.md
dir
npm publish .
cd ..