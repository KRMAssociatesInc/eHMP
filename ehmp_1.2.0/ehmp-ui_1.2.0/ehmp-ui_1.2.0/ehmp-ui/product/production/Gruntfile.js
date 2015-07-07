module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
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
                    'app/applets/**/*.js',
                    'app/screens/**.js'
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
                    specs: "app/applets/**/test/unit/**/*.js",
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: ['testconfig.js' ]
                    }
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'assets/sass',
                    cssDir: 'assets/css',
                    outputStyle: 'compressed',
                    force: true
                }
            }
        },
        concat: {
            dist: {
                src: ['app/applets/**/assets/sass/*.scss'],
                dest: 'assets/sass/applets.scss',
                nonull: true,
                stripBanners: true
            }
        },
        cssmin: {
           my_target: {
             files: [{
                expand: true,
                cwd: 'assets/css',
                src: ['applets.css'],
                dest: 'assets/css',
             }]
           }
        },
        requirejs: {
            minify: {
                options: {
                    baseUrl: '',
                    appDir:'./app',
                    dir: './min',
                    mainConfigFile: "./config.js",
                    allowSourceOverwrites: true,
                    done: function(){
                        console.log('Minification completed successfully');
                    },
                    findNestedDependencies: true,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    // modules: [
                    //     { name: 'min/applets/activeMeds/applet' },
                    //     { name: 'min/applets/add_nonVA_med/applet' },
                    //     { name: 'min/applets/addAllergy/applet' },
                    //     { name: 'min/applets/addApplets/applet' },
                    //     { name: 'min/applets/addLabOrder/applet' },
                    //     { name: 'min/applets/addOrder/applet' },
                    //     { name: 'min/applets/addVitals/applet' },
                    //     { name: 'min/applets/allergy_grid/applet' },
                    //     { name: 'min/applets/allergyEiE/applet' },
                    //     { name: 'min/applets/appointments/applet' },
                    //     { name: 'min/applets/ccd_grid/applet' },
                    //     { name: 'min/applets/cds_advice/applet' },
                    //     { name: 'min/applets/consults/applet' },
                    //     { name: 'min/applets/discharge_summary/applet' },
                    //     { name: 'min/applets/discontinueNonVaMed/applet' },
                    //     { name: 'min/applets/documents/applet' },
                    //     { name: 'min/applets/encounters/applet' },
                    //     { name: 'min/applets/immunizations/applet' },
                    //     { name: 'min/applets/immunizations_add_edit/applet' },
                    //     { name: 'min/applets/lab_panels/applet' },
                    //     { name: 'min/applets/lab_results_grid/applet' },
                    //     { name: 'min/applets/logon/applet' },
                    //     { name: 'min/applets/medication_review/applet' },
                    //     { name: 'min/applets/medication_review_v2/applet' },
                    //     { name: 'min/applets/modalTest/applet' },
                    //     { name: 'min/applets/newsfeed/applet' },
                    //     { name: 'min/applets/orders/applet' },
                    //     { name: 'min/applets/patient_search/applet' },
                    //     { name: 'min/applets/problem_details/applet' },
                    //     { name: 'min/applets/problems/applet' },
                    //     { name: 'min/applets/problems_add_edit/applet' },
                    //     { name: 'min/applets/progress_notes/applet' },
                    //     { name: 'min/applets/reports/applet' },
                    //     { name: 'min/applets/ssoLogon/applet' },
                    //     { name: 'min/applets/stackedGraph/applet' },
                    //     { name: 'min/applets/surgery/applet' },
                    //     { name: 'min/applets/time_graph/applet' },
                    //     { name: 'min/applets/timeline_summary/applet' },
                    //     { name: 'min/applets/visit/applet' },
                    //     { name: 'min/applets/visit_selection/applet' },
                    //     { name: 'min/applets/vista_health_summaries/applet' },
                    //     { name: 'min/applets/vitals/applet' },
                    //     { name: 'min/applets/vitalsEiE/applet' },
                    //     { name: 'min/applets/vitalsObservationList/applet' },
                    //     { name: 'min/applets/workspaceManager/applet' }
                    // ],
                    onModuleBundleComplete: function(data) {
                        console.log('Module ' + data.name + ' created successfully!');
                    },
                    optimize: "uglify2",
                    //we use compass for this
                    optimizeCss: "none",
                    //no license comments in our minified files due to source maps
                    optimizeAllPluginResources: false,
                    preserveLicenseComments: false,
                    removeCombined: false,
                    throwWhen: {
                        optimize: true
                    },
                    //necessary since we 'use strict' our files
                    useStrict: true,
                    stubModules: [
                        'backbone',
                        'marionette',
                        'underscore',
                        'moment'
                    ],
                    fileExclusionRegExp: /\.$|build|node_modules\/grunt-contrib-requirejs/
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('minify', ['requirejs:minify']);
    grunt.registerTask('optimize', ['concat', 'compass', 'cssmin', 'minify']);
    grunt.registerTask('test', ['jshint', 'jasmine:app']);
};
