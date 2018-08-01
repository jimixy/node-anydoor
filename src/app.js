const http = require('http');
const chalk = require('chalk');
const path = require('path');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');


// const handlebars = require('handlebars');
// app.engine('html', handlebars.engine);
// app.set('view engine', 'html');

class Server {
	constructor(config) {
		this.conf = Object.assign({}, conf, config);
	}
	start() {
		const server = http.createServer((req, res) => {
			const filePath = path.join(this.conf.root, req.url);
			// console.log('req', req.url, this.conf, process.cwd(), filePath);
			route(req, res, filePath, this.conf);
		});
		server.listen(this.conf.port, this.conf.hostname, () => {
			const addr = `http://${this.conf.hostname}:${this.conf.port}`;
			console.info(`Server started at ${chalk.green(addr)}`);
			openUrl(addr);
		});
	}
}

module.exports = Server;