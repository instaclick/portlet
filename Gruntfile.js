module.exports = function (grunt) {
    "use strict";

    var config = {
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'vendor/bisna/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./",
                    name: "portlet",
                    out: "dist/portlet.min.js",
                    paths: {
                        jquery: 'node_modules/jquery/dist/jquery',
                        'jquery.cloneEvent': 'node_modules/jquery.cloneevent/jquery.cloneEvent',
                        Portlet: 'src',
                        Bisna: 'vendor/bisna'
                    },
                    exclude: ['jquery'],
                    optimize: 'uglify'
                }
            }
        },
        release: {
            options: {
                push: false, //default: true
                pushTags: false, //default: true
                npm: false, //default: true
                npmtag: true, //default: no tag
                tagName: '<%= version %>',
                commitMessage: 'bump version <%= version %>', //default: 'release <%= version %>'
                tagMessage: 'tag version <%= version %>'
            }
        }
    };

    grunt.initConfig(config);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-release');

    grunt.registerTask('default', ['jshint', 'requirejs']);

};
