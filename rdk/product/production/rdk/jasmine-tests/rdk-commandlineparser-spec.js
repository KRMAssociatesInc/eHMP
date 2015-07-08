/*jslint node: true */
'use strict';

describe('rdk', function() {
    var rdk = require('../rdk/rdk');

    it('should expose a command line parser', function() {
        expect(rdk.utils.commandlineparser).not.toBeUndefined();
    });
});

describe('rdk command line parser', function() {
    var parser = require('../rdk/rdk').utils.commandlineparser;

    it('should indicate param specified by `-` to exist', function() {
        var commandline = ['-a'];
        var argv = parser.parse(commandline);
        expect(argv.a).not.toBeUndefined();
        expect(argv.a).toBe(true);
    });

    it('should indicate param specified by `-` with a value to exist', function() {
        var commandline = ['-a', 'value'];
        var argv = parser.parse(commandline);
        expect(argv.a).not.toBeUndefined();
        expect(argv.a).toBe('value');
    });

    it('should indicate missing params to not exist', function() {
        var commandline = ['-a'];
        var argv = parser.parse(commandline);
        expect(argv.b).toBeUndefined();
    });

    it('multi-char parameters are not handled by `-`', function() {
        var commandline = ['-longparam'];
        var argv = parser.parse(commandline);
        expect(argv.longparam).toBeUndefined();
    });

    it('multi-char parameters are handled by `--`', function() {
        var commandline = ['--longparam'];
        var argv = parser.parse(commandline);
        expect(argv.longparam).not.toBeUndefined();
    });

    it('`c` aliases to `config`', function() {
        var commandline = ['-c', 'filename'];
        var argv = parser.parse(commandline);
        expect(argv.config).toBe('filename');
        expect(argv.c).toBe('filename');
    });
});
