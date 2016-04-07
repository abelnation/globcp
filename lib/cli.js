var Cli = require('cli-ck')
var globcp = require('./globcp')

function done(err) {
    if (err) {
        console.log('error: ' + err.message)
        return process.exit(1)
    }
    process.exit(0)
}

var cli = new Cli()
    .usage('$0 [--srcdir <srcdir>] [--basedir <basedir>] <...patterns> <destdir>')
    .option('srcdir', {
        alias: 's',
        desc: 'srcdir to search in for pattern',
        type: 'string',
        defaultValue: '.'
    })
    .option('flatten', {
        alias: 'f',
        desc: 'flatten all found files into destDir'
    })
    .handler(function (args, opts) {
        console.dir(opts)

        args = args.slice(2)
        if (args.length < 2) {
            done(new Error('at least two arguments must be provided'))
        }

        var patterns = args.slice(0, -1)
        var destdir = args.slice(-1)[0]

        console.dir(patterns)

        for (var i = 0; i < patterns.length; i++) {
            if (opts.flatten) {
                globcp.copyFlat(opts.srcdir, patterns[i], destdir, done)
            } else {
                globcp.copyTree(opts.srcdir, patterns[i], destdir, done)
            }
        }
    })

module.exports = cli
