module.exports = function(grunt) {

  var config = {
    jshint: {
      all: ['src/**/*.js'],
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
            jquery: 'vendor/bower_components/jquery/dist/jquery',
            'jquery.cloneEvent': 'vendor/bower_components/jquery.cloneEvent/jquery.cloneEvent',
            Portlet: 'src/',
            HttpRequest: 'vendor/bisna/HttpRequest',
            EventTarget: 'vendor/bisna/EventTarget'
          },
          exclude: ['jquery'],
          optimize: 'uglify'
        }
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['jshint', 'requirejs']);

};
