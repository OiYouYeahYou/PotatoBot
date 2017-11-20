var request = require( 'request' );

module.exports = function ( grunt ) {
	require( 'time-grunt' )( grunt );
	require( 'load-grunt-tasks' )( grunt );

	var reloadPort = 35729,
		files;

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		develop: {
			server: {
				file: 'lib/index.js'
			}
		},
		watch: {
			options: {
				nospawn: true,
				livereload: reloadPort
			},
			ts: {
				files: [
					'src/*.ts',
					'src/**/*.ts',
				],
				tasks: [ 'ts', 'develop', 'delayed-livereload' ]
			},
		},
		ts: {
			default: {
				src: 'src/*.ts',
				outDir: 'lib/',
				options: {
					inlineSourceMap: true,
					// fast: 'never',
					target: "es6",
					module: "commonjs",
					lib: [ "es2015", "es2017" ],
					moduleResolution: "node"
				}
			}
		},
	} );

	grunt.config.requires( 'watch.ts.files' );
	grunt.loadNpmTasks( 'grunt-ts' );

	files = grunt.config( 'watch.ts.files' );
	files = grunt.file.expand( files );

	grunt.registerTask(
		'delayed-livereload',
		'Live reload after the node server has restarted.',
		function () {
			var done = this.async();
			setTimeout( function () {
				request.get( 'http://localhost:' + reloadPort + '/changed?files=' + files.join( ',' ), function ( err, res ) {
					var reloaded = !err && res.statusCode === 200;

					if ( reloaded )
						grunt.log.ok( 'Delayed live reload successful.' );
					else
						grunt.log.error( 'Unable to make a delayed live reload.' );
					done( reloaded );
				} );
			}, 500 );
		}
	);

	grunt.registerTask( 'default', [ 'ts' ] );
	grunt.registerTask( 'dev', [ 'ts', 'develop', 'watch' ] );
};
