module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-nodemon');


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					nodeArgs: ['--harmony'],
					watchedExtensions: ['js', 'jade', 'json'],
					delayTime: 1,
					env: {
						PORT: '3000',
						NODE_ENV: 'development'
					}
				}
			}
		},
	});



	grunt.registerTask('dev', ['nodemon']);
};