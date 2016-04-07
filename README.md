# globcp
Simple util to copy files matching a pattern to a dest dir

### Cli Usage

```
globcp [--flatten] [--srcdir=<srcdir>] <pattern> [<patterns...>] <destdir>
globcp '**' ./tmp
globcp '**/*.txt' ./tmp
globcp --flatten --srcdir=./files '**/*.{jpg,png,gif}' ./images
```

### API Usage

```
var Globcp = require('globcp')
var globcp = new Globcp()

globcp.copyFlat(srcDir, pattern, destDir, done)
globcp.copyTree(srcDir, pattern, destDir, done)
```

### Development

Main dev commands:

```
# setup
npm install

# compile src
npm run build

# watch src files and re-build on change
npm run watch

# run tests, outputs result to mocha-test.html
npm test

# watch compiled files, and re-run tests on change
npm run testwatch
```
