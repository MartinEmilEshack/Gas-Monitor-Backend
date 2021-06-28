import express from 'express';
import AlcoholSniffer from './routes/alcohol_sniffer.js';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import path from 'path';

const __dirname = path.resolve();

const gasMonitorApp = express();
const appServer = gasMonitorApp.listen(4000, () => {
	console.log('Sniffing Gas');
});

const socketIO = new Server(appServer);
const alcoholSniffer = new AlcoholSniffer(socketIO);

gasMonitorApp.use(bodyParser.json());
gasMonitorApp.use(express.static(path.join(__dirname, ".", "build")));
gasMonitorApp.use('/api', alcoholSniffer.getRouter());

alcoholSniffer.onAlcoholSmelled((msg) => {
	socketIO.emit('alcohol_density', msg);
});

socketIO.on('disconnect', (socket) => {
	console.log('client disconnected');
});