
var Promise = require('bluebird')
var fs = require('fs-extra')
var path = require('path')
var glob = require('glob')

Promise.promisifyAll(fs)

module.exports = {
    copyFlat: function copyFlat(srcDir, pattern, destDir, done) {
        console.log('copyFlat(srcDir=' + srcDir + ', pattern=' + pattern + ', destDir=' + destDir + ')')

        var options = { cwd: srcDir }
        var promises = []

        new glob.Glob(pattern, options)
            .on('match', function(relPath) {
                var srcAbsPath = path.resolve(srcDir, relPath)
                var destAbsPath = path.resolve(destDir, path.basename(relPath))

                promises.push(
                    fs.statAsync(srcAbsPath)
                        .then(function(stats) {
                            var p
                            if (stats.isDirectory()) {
                                console.log("ensure: " + destAbsPath)
                                console.log('-> ' + destAbsPath)
                                p = fs.ensureDirAsync(destAbsPath)
                            } else {
                                console.log("ensure: " + path.dirname(destAbsPath))
                                p = fs.ensureDirAsync(path.dirname(destAbsPath))
                                    .then(function() {
                                        console.log("cp: " + srcAbsPath)
                                        console.log('-> ' + destAbsPath)
                                        return fs.copyAsync(srcAbsPath, destAbsPath)
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
    },

    copyTree: function copyTree(srcDir, pattern, baseDir, destDir, done) {
        console.log('copyTree(srcDir=' + srcDir + ', pattern=' + pattern + 'baseDir=' + baseDir + ', destDir=' + destDir + ')')

        var options = { cwd: srcDir }
        var promises = []

        new glob.Glob(pattern, options)
            .on('match', function(relPath) {
                var srcAbsPath = path.resolve(srcDir, relPath)

                var destRelPath = path.relative(baseDir, srcAbsPath)
                var destAbsPath = path.resolve(destDir, destRelPath)

                promises.push(
                    fs.statAsync(srcAbsPath)
                        .then(function(stats) {
                            var p
                            if (stats.isDirectory()) {
                                console.log("ensure: " + destAbsPath)
                                console.log('-> ' + destAbsPath)
                                p = fs.ensureDirAsync(destAbsPath)
                            } else {
                                console.log("ensure: " + path.dirname(destAbsPath))
                                p = fs.ensureDirAsync(path.dirname(destAbsPath))
                                    .then(function() {
                                        console.log("cp: " + srcAbsPath)
                                        console.log('-> ' + destAbsPath)
                                        return fs.copyAsync(srcAbsPath, destAbsPath)
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
