module.exports = function(grunt) {

  var config = {
    jshint: {
      all: ['src/**/*.js', 'vendor/bisna/**/*.js'],
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
            'jquery.cloneEvent': 'node_modules/jquery.cloneEvent/jquery.cloneEvent',
            Portlet: 'src',
            Bisna: 'vendor/bisna'
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
