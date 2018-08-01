const { cache } = require('../config/defaultConfig');

function refreshRes(stats, res) {
	const { maxAge, expires, cacheControl, lastModified, etag } = cache;
	
	if (expires) {
		res.setHeader(
			'Expires',
			new Date(Date.now() + maxAge * 1000).toUTCString()
		);
	}

	if (cacheControl) {
		res.setHeader('Cache-Control', `public,max-age=${maxAge}`);
	}

	if (lastModified) {
		// mtime 修改时间
		res.setHeader('Last-Modified', stats.mtime.toUTCString());
	}
	console.log('mtime', stats.mtime, stats.mtime.toUTCString(), new Date(stats.mtime).toLocaleString());
	if (etag) {
		res.setHeader('ETag', `${stats.size}-${new Date(stats.mtime).toLocaleString()}`);
	}
}

module.exports = function isFresh(stats, req, res) {
	refreshRes(stats, res);
	const lastModified = req.headers['if-modified-since'];
	const etag = req.headers['if-none-match']; // 或者 if-match
	console.log('lastModified', lastModified);
	console.log('etag', etag, res.getHeader('ETag'));
	// 第一次请求
	if (!lastModified && !etag) {
		console.log('1');
		return false;
	}
	if (lastModified && lastModified !== res.getHeader('Last-Modified')) {
		console.log('2');
		return false;
	}
	if (etag && etag !== res.getHeader('ETag')) {
		console.log('3');
		return false;
	}
	console.log('4');
	return true;
};
