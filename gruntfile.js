module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');


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


			jsCompiled: {
				files: [
					'public/js/dist/app.js'
				],
				options: {
					livereload: true,
					interval: 500,
					debounceDelay: 500,
				},
			},


			jsDev: {
				files: [
					'./public/js/src/**/*.js',
					'./lib/**/*.js',
				],
				tasks: ['compile-js'],
				options: {
					livereload: false,
				},
			},

		},



		browserify: {
			app: {
				src: 'public/js/src/app.js',
				dest: 'public/js/dist/app.js',
			}
		},



		uglify: {
			options: {
				report: 'min',
				stripBanners: false,
				mangle: true,
				preserveComments: 'some',
			},
			app: {
				options: {
					sourceMap: true,
				},
				files: {
					'public/js/dist/app.min.js': [
						'public/js/dist/app.js',
					]
				}
			},
		},
	});



	grunt.registerTask('compile-js', ['browserify', 'uglify']);
	grunt.registerTask('default', ['dev']);

	grunt.registerTask('dev', ['compile-js', 'concurrent']);
};
