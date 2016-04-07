var Cli = require('cli-ck')
var globcp = require('./globcp')

function done(err) {
    if (err) {
        return process.exit(1)
    }
    process.exit(0)
}

var cli = new Cli()
    .usage('$0 [--srcdir <srcdir>] [--basedir <basedir>] <...patterns> <destdir>')
    .option('srcdir', {
        alias: 's',
        desc: 'srcdir to search in for pattern',
        defaultValue: '.'
    })
    .option('basedir', {
        alias: 'b',
        desc: 'preserves structure of files, with rel path rooted at <basedir>'
    })
    .handler(function (args, opts) {
        var patterns = args.slice(0, -1)
        var destdir = args.slice(-1)

        for (var i = 0; i < patterns.length; i++) {
            if (opts.basedir) {
                globcp.copyTree(opts.srcdir, patterns[i], opts.basedir, destdir, done)
            } else {
                globcp.copyFlat(opts.srcdir, patterns[i], destdir, done)
            }
        }
    })

module.exports = cli