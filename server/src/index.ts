// Colyseus + Express
import { Server } from 'colyseus';
import { createServer } from 'http';
import express from 'express';
import GameRoom from './rooms/GameRoom';
import serveIndex from 'serve-index';
import path from 'path';

const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0)

const app = express();
app.use(express.json());

const gameServer = new Server({
  server: createServer(app),
  express: app,
  pingInterval: 0
});


const STATIC_PATH = path.join(__dirname, "..", "..", "client", "build");

console.log(`public path: ${STATIC_PATH}`)
app.use('/', express.static(STATIC_PATH));

app.get('/', function(req, res){
  res.sendFile(path.join(STATIC_PATH, 'index.html'));
});

gameServer.define("game_room", GameRoom);
gameServer.listen(port);

console.log(`Listening on http://localhost:${ port }`);