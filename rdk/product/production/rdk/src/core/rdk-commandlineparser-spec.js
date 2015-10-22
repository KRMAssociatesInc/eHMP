'use strict';

var parser = require('./rdk').utils.commandlineparser;

describe('rdk', function() {
    var rdk = require('./rdk');

    it('should expose a command line parser', function() {
        expect(rdk.utils.commandlineparser).not.to.be.undefined();
    });
});

describe('rdk command line parser', function() {
    beforeEach(function() {
        yargsWorkaround();
    });
    function yargsWorkaround() {
        // yargs.parse is not idempotent
        delete require.cache[require.resolve('yargs')];
        require('yargs');
    }

    it('should indicate param specified by `-` to exist', function() {
        var commandline = ['-a'];
        var argv = parser.parse(commandline);
        expect(argv.a).not.to.be.undefined();
        expect(argv.a).to.be.true();
    });

    it('should indicate param specified by `-` with a value to exist', function() {
        var commandline = ['-a', 'value'];
        var argv = parser.parse(commandline);
        expect(argv.a).not.to.be.undefined();
        expect(argv.a).to.equal('value');
    });

    it('should indicate missing params to not exist', function() {
        var commandline = ['-a'];
        var argv = parser.parse(commandline);
        expect(argv.b).to.be.undefined();
    });

    it('multi-char parameters are not handled by `-`', function() {
        var commandline = ['-longparam'];
        var argv = parser.parse(commandline);
        expect(argv.longparam).to.be.undefined();
    });

    it('multi-char parameters are handled by `--`', function() {
        var commandline = ['--longparam'];
        var argv = parser.parse(commandline);
        expect(argv.longparam).not.to.be.undefined();
    });

    it('`c` aliases to `config`', function() {
        var commandline = ['-c', 'filename'];
        var argv = parser.parse(commandline);
        expect(argv.config).to.equal('filename');
        expect(argv.c).to.equal('filename');
    });
});
