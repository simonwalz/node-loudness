const spawn = require('child_process').spawn;
const execa = require('execa')
const fs = require('fs/promises');
const crypto = require('crypto');
const os = require('os');
const path = require('path');

var tempdir = path.join(os.tmpdir(), 'node-osa-helper');

const fileExists = async function(path) {
	return !!(await fs.stat(path).catch(e => false));
}

const osacompile = async function (cmd) {
	var hash = crypto.createHash('sha1');
	hash.update(cmd);
	var h = hash.digest("hex");

	var filename = tempdir + "/cache_osa_"+h+".scpt";
	if (!await fileExists(filename)) {
		/*
		console.log('osacompile', [
				'-e', "on run argv",
				'-e', cmd,
				'-e', "end run",
				'-o', filename]
			   );
		*/
		await fs.mkdir(tempdir, { recursive: true });
		await execa('osacompile', [
                                        '-e', "on run argv",
                                        '-e', cmd,
                                        '-e', "end run",
                                        '-o', filename]);
	}
	return filename;
};

exports.osascript = async function (cmd, args) {
	if (!Array.isArray(args)) {
		args = [];
	}
	var filename = await osacompile(cmd);
	const script_args = [filename, ...args];
	return (await execa('osascript', script_args)).stdout.trim()
};

