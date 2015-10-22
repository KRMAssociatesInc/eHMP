module.exports = function (grunt) {
    'use strict';
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        jshint: { // configure the task
            // lint your project's server code
            gruntfile: {
                src: [
                    'Gruntfile.js'
                ],
                directives: {
                    node: true
                },
                options: {
                }
            },
            server: {  // could also specify 'client'
                src: [
                    'main/**/*.js', 'modules/**/*.js', 'test/specs/**/*.js', '!**/*.min.js', '!test/libs/**/*.js', '!**node_modules/**/*.js', 'js-built/**/*'
                ],
                directives: {
                    browser: true,  // from example for client
                    node: true,     // from example for server
                    globals: {
                        // 'jQuery' etc.
                    }
                },
                options: {
                    expr: true
                }
            }
        },
        jasmine: {
            app: {
                options: {
                    outfile: "_SpecRunner.html",
                    junit: {
                        path: "test/build/junit-reports"
                    },
                    specs: "test/unit/**/*Spec.js",
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: ['config.js' ]
                    },
                    //display: 'short',
                    summary: true
                }
            },
            inttest: {
                options: {
                    outfile: "_SpecRunner.html",
                    junit: {
                        path: "test/build/junit-reports"
                    },
                    specs: "test/integration/**/*.js",
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: ['config.js' ]
                    }
                }
            }
        },
        jade: {
            compile: {
                options: {
                    data: {
                        debug: false,
                        adkMin: false,
                        owa:true
                    },
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['*.jade'],
                        dest: '',
                        ext: '.html'
                    }
                ]
            },
            minify: {
                options: {
                    data: {
                        debug: false,
                        adkMin: true,
                        owa:true
                    },
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['*.jade'],
                        dest: '',
                        ext: '.html'
                    }
                ]
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: '_assets/sass',
                    cssDir: '_assets/css',
                    outputStyle: 'compressed',
                    require: 'breakpoint',
                    force: true
                }
            }
        },
        shell: {
            sass: {
                options: { stdout: true },
                command: [
                    "grunt compass"
                ].join("&&")
            },
            installBreakpointSass: {
                command: 'gem install breakpoint',
                options: {
                    stdout: true
                }
            },
            version: {
                command: 'git log -1 --pretty=format:%h',
                options: {
                    callback: function log(err, stdout, stderr, cb) {
                        grunt.file.write('version.json', JSON.stringify({
                            "name": pkg.name,
                            "title": pkg.title,
                            "hybrid": pkg.hybrid,
                            "version": pkg.version,
                            "description": pkg.description,
                            "resourceDirectory": pkg.resourceDirectory,
                            "artifact-name": pkg['artifact-name'],
                            "uber-portal": pkg['uber-portal'],
                            "applets": pkg.applets,
                            "widgets": pkg.widgets,
                            "links": pkg.links,
                            metaRevision: stdout,
                            date: grunt.template.today()
                        }));
                        cb();
                    }
                }
            }
        },
        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            compass: {
                files: ['_assets/sass/*.scss'],
                tasks: ['compass']
            },
            jade: {
                files: ["_assets/templates/**/*.jade", "modules/**/*.jade", "*.jade"],
                tasks: ['jade', 'jade:jadeHack', 'test']
            },
            scripts: {
                files: ['**/*.js', '!test/libs/**/*.js'],
                tasks: ['jshint:server'],
                options: {
                    spawn: false
                }
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    'js/**/*.js',
                    'css/*.css'
                ]
            }
        },
        copy:{
            testVersionJson: {
                src: 'version.json.test',
                dest: 'version.json'
            }
        },
        compress: {
            testImage: {
                options: {
                    mode: 'zip',
                    archive: 'build/wrapper.war'
                },
                files: [
                    { expand: true, src:['**/*', 'applets/summary-applet/**/*', '!**/node_modules/**/*', '!build/**/*',
                        '!applets/labs/**/*', '!applets/applet-home/**/*', '!applets/documents/**/*',
                        '!applets/medications-applet/**/*', '!applets/notifications-applet/**/*',
                        '!applets/orders-management/**/*', '!applets/radiology/**/*',
                        '!applets/wound-care-applet/**/*',
                        '!**/test/**/*', '!*SpecRunner.html',
                        '!README.md', '!.gitignore', '!**/package.json', '!**/Gruntfile.js', '!**/*.jade',
                        '!**/*.scss', '!graph/**/*', '!gems/**/*', '!**/*.gem', '!Gemfile'] }
                ]
            },
            artifact: {
                options: {
                    mode: 'tgz',
                    archive: 'build/<%= pkg["artifact-name"] %>.tgz'
                },
                files: [
                    { expand: true, src: ['**/*', '!**/node_modules/**', '!build/**', '!applets/**', '!**/test/**', '!*SpecRunner.html', '!README.md', '!.gitignore', '!**/package.json', '!**/Gruntfile.js', '!build.gradle', '!**/*.jade', '!**/*.scss', '!graph/**', '!gems/**', '!**/*.gem', '!Gemfile', '!app/**'] }
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './',
                    include: ["_assets/libs/custom/require/require-2.1.8.js"],
                    findNestedDependencies: true,
                    generateSourceMaps: false,
                    mainConfigFile: "./config.js",
                    name: 'config',
                    optimize: "uglify2",
                    //we use compass for this
                    optimizeCss: "none",
                    out: './app.min.js',
                    //no license comments in our minified files due to source maps
                    preserveLicenseComments: false,
                    removeCombined: false,
                    throwWhen: {
                        optimize: true
                    },
                    //necessary since we 'use strict' our files
                    useStrict: true,
                    wrapShim: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('version', ['shell:version']);
    grunt.registerTask('sass', ['shell:sass']);
    grunt.registerTask('test', [ 'jshint', 'jasmine:app' ]);
    grunt.registerTask('inttest', [ 'jshint', 'jasmine:inttest' ]);
    grunt.registerTask('minify', ['version', 'sass', 'jade:minify','requirejs']);
    grunt.registerTask('build', [ 'version', 'sass', 'jade:compile' ]);
    grunt.registerTask('buildTestWar',['build','copy:testVersionJson','compress:testImage']);
    grunt.registerTask('deploy', [ 'minify', 'compress:artifact' ]);
    grunt.registerTask('default', [ 'build', 'test', 'watch' ]);
};
