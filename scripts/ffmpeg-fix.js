const cwd = require('path').join(__dirname, '../node_modules/prism-media/')

console.log(`Manually installing ffmpeg-binaries in: ${cwd}`)

require('child_process').spawnSync(
	'npm',
	['i', '--ignore-scripts', 'ffmpeg-binaries@4'],
	{ cwd, stdio: 'inherit' }
)

console.log('\n')
