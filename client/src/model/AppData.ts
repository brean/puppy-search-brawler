import { createHashHistory, History } from "history";

import { Room, Client } from 'colyseus.js';


class AppData {
  history: History<unknown>;
  client: Client;
  // currently joined room
  currentRoom?: Room;

  constructor() {
    this.history = createHashHistory();
    const host = window.document.location.host.replace(/:.*/, '');
    const endpoint = window.location.protocol.replace("http", "ws") + "//" + host + (window.location.port ? ':'+ window.location.port : '')
    this.client = new Client(endpoint);
  }
}

export default AppData;