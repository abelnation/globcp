
var _ = require('lodash')
var Promise = require('bluebird')
var fs = require('fs-extra')
var path = require('path')
var glob = require('glob')

Promise.promisifyAll(fs)

function Globcp(options) {
    this.options = options
}

_.extend(Globcp.prototype, {
    copyFlat: function copyFlat(srcDir, pattern, destDir, done) {
        this.copy(srcDir, pattern, destDir, { flatten: true }, done)
    },

    copyTree: function copyTree(srcDir, pattern, destDir, done) {
        this.copy(srcDir, pattern, destDir, { flatten: false }, done)
    },

    copy: function(srcDir, pattern, destDir, options, done) {
        var self = this

        self.debug('copy(srcDir=' + srcDir + ', pattern=' + pattern + ', destDir=' + destDir + ')')
        self.debug(JSON.stringify(options))
        
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
                                    self.debug('ensure: ' + destAbsPath)
                                    self.debug('-> ' + destAbsPath)
                                    p = fs.ensureDirAsync(destAbsPath)
                                }
                            } else {
                                self.debug('cp: ' + srcAbsPath)
                                self.debug('-> ' + destAbsPath)
                                p = fs.copyAsync(srcAbsPath, destAbsPath)
                                    .catch(function(err) {
                                        self.debug('fs error for: ' + destAbsPath)
                                        self.debug(err)
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
                self.debug('glob done')
                Promise.all(promises)
                    .then(function() { done() })
                    .catch(function(err) { done(err) })
            })
    },

    debug: function debug(msg) {
        if (this.options.debug) {
            console.log(msg)
        }
    }
})

module.exports = Globcp
