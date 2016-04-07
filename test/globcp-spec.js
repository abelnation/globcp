
var _ = require('lodash')
var fs = require('fs-extra')
var path = require('path')
var assert = require('chai').assert
var fsAssert = require('./helpers/fs-assert')

var globcp = require('../lib/globcp')

describe('globcp', function() {

    var tmpDir
    var fixturesDir

    function checkResult(destDir, expectedFiles, done) {
        return function(err) {
            if (err) { return done(err) }
            _.each(expectedFiles, function(relPath) {
                var destPath = path.resolve(destDir, relPath)
                assert(fs.existsSync(destPath), 'file exists: ' + destPath)
            })
            done()
        }
    }

    before(function() {
        tmpDir = '/tmp/globcp'
        fs.ensureDirSync(tmpDir)

        fixturesDir = path.resolve(__dirname, 'fixtures')
    })

    beforeEach(function() {
        fs.emptyDirSync(tmpDir)
    })

    after(function() {
        // fs.removeSync(tmpDir)
    })

    describe('flat copy to dest dir', function() {

        it('**', function(done) {
            var srcDir = path.resolve(fixturesDir, 'flat_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyFlat(srcDir, '**', destDir, checkResult(destDir, [
                'a.html', 'a.txt', 'b.txt', 'c.txt'
            ], done))
        })

        it('*.txt', function(done) {
            var srcDir = path.resolve(fixturesDir, 'flat_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyFlat(srcDir, '**', destDir, checkResult(destDir, [
                'a.txt', 'b.txt', 'c.txt'
            ], done))
        })

        it('a.*', function(done) {
            var srcDir = path.resolve(fixturesDir, 'flat_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyFlat(srcDir, 'a.*', destDir, checkResult(destDir, [
                'a.html', 'a.txt'
            ], done))
        })

        it('nested src, **/*.txt', function(done) {
            var srcDir = path.resolve(fixturesDir, 'tree_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyFlat(srcDir, '**/*.txt', destDir, checkResult(destDir, [
                'a.txt', 'b.txt', 'c.txt'
            ], done))
        })

        it('nested src, **/b*', function(done) {
            var srcDir = path.resolve(fixturesDir, 'tree_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyFlat(srcDir, '**/*.txt', destDir, checkResult(destDir, [
                'b.txt'
            ], done))
        })
    })

    describe('copy and preserve tree with base dir', function() {
        it('**', function(done) {
            var srcDir = path.resolve(fixturesDir, 'flat_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyTree(srcDir, '**', destDir, checkResult(destDir, [
                'a.html', 'a.txt', 'b.txt', 'c.txt'
            ], done))
        })

        it('nested src, **', function(done) {
            var srcDir = path.resolve(fixturesDir, 'tree_01')
            var destDir = path.resolve(tmpDir, 'dest')
            globcp.copyTree(srcDir, '**', destDir, checkResult(destDir, [
                'a/a.txt', 'a/b/b.txt', 'a/b/c/c.txt'
            ], done))
        })
    })
})
