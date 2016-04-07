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
