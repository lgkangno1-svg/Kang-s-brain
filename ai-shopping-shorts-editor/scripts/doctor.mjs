const major = Number(process.versions.node.split('.')[0]);
console.log(`${major >= 20 ? 'PASS' : 'FAIL'}  Node.js: ${process.version}`);
console.log('INFO  FFmpeg/FFprobe are verified by `npm run demo` and at application startup.');
if (major < 20) process.exitCode = 1;
