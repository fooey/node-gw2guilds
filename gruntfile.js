module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');


	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concurrent: {
			target: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'server.js',
					nodeArgs: ['--harmony'],//,'--debug'
					watchedExtensions: ['js', 'jade', 'json'],
					delayTime: 1,
					env: {
						PORT: '3001',
						NODE_ENV: 'development'
					}
				}
			}
		},

		watch: {
			css: {
				files: 'public/css/style.css',
				options: {
					livereload: true, 
					interval: 500,
					debounceDelay: 500,
				},
			},
			appJs: {
				files: [
					'public/js/script.js'
				],
				options: {
					livereload: true,
					interval: 500,
					debounceDelay: 500,
				},
			},
		},
	});



	grunt.registerTask('dev', ['concurrent']);
};