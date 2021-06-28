import { Router } from 'express';
import path from 'path';
// eslint-disable-next-line no-unused-vars
import { Server } from 'socket.io';

const __dirname = path.resolve();

class AlcoholSniffer {

	/**
	 * @param {Server} socketIO
	 */
	constructor(socketIO) {
		this.apiRoutes = Router();
		this.socketIO = socketIO;

		this.apiRoutes.post('/alcohol', (request, respond) => {
			this.socketIO.emit('alcohol_density', request.body.alcohol);
			respond.end();
		});

		this.apiRoutes.get('/alcohol', (request, respond) => {
			respond.sendFile(path.join(__dirname, '.', 'build', 'index.html'));
		});
	}

	/**
	 * @param {Function} onSmelling 
	 */
	onAlcoholSmelled(onSmelling) {
		this.socketIO.on('connection', (socket) => {
			socket.on('smelled_alcohol', onSmelling);
		});
	}

	/**
	 * @returns {Router} alcohol sniffer router
	 */
	getRouter() {
		return this.apiRoutes;
	}
}

export default AlcoholSniffer;