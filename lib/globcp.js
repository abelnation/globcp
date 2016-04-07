
var Promise = require('bluebird')
var fs = require('fs-extra')
var path = require('path')
var glob = require('glob')

Promise.promisifyAll(fs)

var globcp = {
    copyFlat: function copyFlat(srcDir, pattern, destDir, done) {
        globcp.copy(srcDir, pattern, destDir, { flatten: true }, done)
    },

    copyTree: function copyTree(srcDir, pattern, destDir, done) {
        globcp.copy(srcDir, pattern, destDir, { flatten: false }, done)
    },

    copy: function(srcDir, pattern, destDir, options, done) {
        console.log('copy(srcDir=' + srcDir + ', pattern=' + pattern + ', destDir=' + destDir + ')')
        console.log(JSON.stringify(options))

        var globOptions = { cwd: srcDir }
        var promises = []

        new glob.Glob(pattern, globOptions)
            .on('match', function(relPath) {
                var srcAbsPath = path.resolve(srcDir, relPath)
                var destAbsPath
                if (options.flatten) {
                    destAbsPath = path.resolve(destDir, path.basename(srcAbsPath))
                } else {
                    destAbsPath = path.resolve(destDir, relPath)
                }

                promises.push(
                    fs.statAsync(srcAbsPath)
                        .then(function(stats) {
                            var p
                            if (stats.isDirectory()) {
                                if (!options.flatten) {
                                    console.log("ensure: " + destAbsPath)
                                    console.log('-> ' + destAbsPath)
                                    p = fs.ensureDirAsync(destAbsPath)
                                }
                            } else {
                                console.log("cp: " + srcAbsPath)
                                console.log('-> ' + destAbsPath)
                                p = fs.copyAsync(srcAbsPath, destAbsPath)
                                    .catch(function(err) {
                                        console.log('fs error for: ' + destAbsPath)
                                        console.log(err)
                                        throw err
                                    })
                            }
                            return p
                        })
                )

            })
            .on('error', function(err) {
                done(err)
            })
            .on('end', function() {
                console.log('glob done')
                Promise.all(promises)
                    .then(function() { done() })
                    .catch(function(err) { done(err) })
            })
    }
}
module.exports = globcp
