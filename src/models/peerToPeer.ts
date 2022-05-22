import * as WebSocket from 'ws';

type WebSocketPrivateAPIs = {
  _socket: {remoteAddress: string; remotePort: string};
};

class PeerToPeer {
  private _sockets: WebSocket[] = [];

  constructor() {}

  public get sockets() {
    return this._sockets;
  }

  public get socketAddresses() {
    return (this.sockets as unknown as WebSocketPrivateAPIs[]).map(
      socket => `${socket._socket.remoteAddress}:${socket._socket.remotePort}`
    );
  }
}

export default PeerToPeer;
