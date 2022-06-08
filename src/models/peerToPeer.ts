import * as WebSocket from 'ws';

import type BlockChain from './blockchain';
import type Block from './block';

import {jsonToObject} from '../utils/json';
import {SocketMessageType} from '../enums';
import type {SocketMessage} from '../types';

type WebSocketPrivateAPIs = {
  _socket: {remoteAddress: string; remotePort: string};
};

class PeerToPeer {
  private _sockets: WebSocket[] = [];
  public blockChain?: BlockChain;

  constructor() {}

  public get sockets() {
    return this._sockets;
  }

  public get socketAddresses() {
    return (this.sockets as unknown as WebSocketPrivateAPIs[]).map(
      socket => `${socket._socket.remoteAddress}:${socket._socket.remotePort}`
    );
  }

  public connectToPeer(newPeer: string) {
    const socket = new WebSocket(newPeer);

    socket.on('open', () => {
      this.initializeConnection(socket);
    });

    socket.on('error', () => {
      console.log('connection failed');
    });
  }

  public broadcastLatestBlock() {
    if (this.blockChain == null) return;

    this.broadcast({
      message: {
        type: SocketMessageType.RESPONSE_BLOCKCHAIN,
        data: JSON.stringify([this.blockChain.latestBlock]),
      },
    });
  }

  public listen(port: number) {
    const server = new WebSocket.Server({port});

    server.on('connection', socket => {
      this.initializeConnection(socket);
    });

    console.log(`listening on port ${port}`);
  }

  private initializeConnection(socket: WebSocket) {
    this.addToSockets(socket);

    this.initializeMessageHandler(socket);
    this.initializeErrorHandler(socket);

    this.send({
      socket,
      message: {type: SocketMessageType.QUERY_LATEST, data: null},
    });
  }

  private initializeMessageHandler(socket: WebSocket) {
    socket.on('message', data => {
      if (typeof data !== 'string') {
        this.sendError({socket, message: 'Invalid message sent'});
        return;
      }

      const objectResult = jsonToObject<SocketMessage>(data);
      if ('error' in objectResult) {
        this.sendError({socket, message: 'Invalid message sent'});
        return;
      }

      const blockChain = this.blockChain;
      if (blockChain == null) {
        this.sendError({socket, message: 'Okey we messed up, please help!'});
        return;
      }

      const message = objectResult.value;
      if (
        typeof message.data !== 'string' ||
        typeof message.type !== 'number'
      ) {
        this.sendError({socket, message: 'Invalid message sent'});
        return;
      }

      switch (message.type) {
        case SocketMessageType.QUERY_ALL:
          this.send({
            socket,
            message: {
              type: SocketMessageType.RESPONSE_BLOCKCHAIN,
              data: JSON.stringify(blockChain.blocks),
            },
          });
          break;
        case SocketMessageType.QUERY_LATEST:
          this.broadcastLatestBlock();
          break;
        case SocketMessageType.RESPONSE_BLOCKCHAIN:
          this.handleBlockChainResponse({
            socket,
            messageData: message.data,
            blockChain,
          });
          break;
        case SocketMessageType.ERROR:
          return;
        default:
          break;
      }
    });
  }

  private initializeErrorHandler(socket: WebSocket) {
    socket.on('close', () => this.removeFromSockets(socket));
    socket.on('error', () => this.removeFromSockets(socket));
  }

  private handleBlockChainResponse({
    socket,
    messageData,
    blockChain,
  }: {
    socket: WebSocket;
    messageData: string;
    blockChain: BlockChain;
  }) {
    const receivedBlocksResult = jsonToObject<Block[]>(messageData);
    if ('error' in receivedBlocksResult) {
      this.sendError({
        socket,
        message: 'Okey we messed up, please help!',
      });
      return;
    }

    const receivedBlocks = receivedBlocksResult.value;
    if (!Array.isArray(receivedBlocks) || receivedBlocks.length === 0) {
      this.sendError({socket, message: 'Invalid message sent'});
      return;
    }

    const latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    if (
      !Object.keys(latestBlockReceived).includes('isValidBlockStructure') ||
      !latestBlockReceived.isValidBlockStructure
    ) {
      this.sendError({socket, message: 'Invalid message sent'});
      return;
    }

    const latestBlockHeld = blockChain.latestBlock;
    if (latestBlockReceived.index <= latestBlockHeld.index) return; // do nothing everything is well

    if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
      const addToChainResult = blockChain.addToChain(latestBlockReceived);
      if ('error' in addToChainResult) {
        this.sendError({socket, message: addToChainResult.error.message});
        return;
      }

      this.broadcastLatestBlock();
      return;
    }

    if (receivedBlocks.length === 1) {
      this.broadcast({
        message: {type: SocketMessageType.QUERY_ALL, data: null},
      });

      return;
    }

    const replaceChainResult = blockChain.replaceChain(receivedBlocks);
    if ('error' in replaceChainResult) {
      this.sendError({socket, message: replaceChainResult.error.message});
      return;
    }

    this.broadcastLatestBlock();
  }

  private broadcast({message}: {message: SocketMessage}) {
    this.sockets.forEach(async socket => this.send({socket, message}));
  }

  private send({socket, message}: {socket: WebSocket; message: SocketMessage}) {
    socket.send(JSON.stringify(message));
  }

  private sendError({socket, message}: {socket: WebSocket; message: string}) {
    this.send({
      socket,
      message: {
        type: SocketMessageType.ERROR,
        data: JSON.stringify({details: message}),
      },
    });
  }

  private addToSockets(socket: WebSocket) {
    this._sockets.push(socket);
  }

  private removeFromSockets(socket: WebSocket) {
    const index = this._sockets.findIndex(value => value === socket);
    if (index === -1) return;

    this._sockets.splice(index, 1);
  }
}

export default PeerToPeer;
