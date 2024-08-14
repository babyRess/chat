import { Server } from 'socket.io';
import BaseGateway from './gateways/BaseGateway';
import ChatGateway from './gateways/ChatGateway';

class Manager {
  private gateways: BaseGateway[];

  async Setup() {
    this.gateways = [new ChatGateway()];

    for (const gateway of this.gateways) {
      await gateway.Setup();
    }
  }

  async OnNewClient(socketClient) {
    for (const gateway of this.gateways) {
      gateway.RegisterGateway(socketClient);
      // gateway.RegisterSocket(socketClient);
    }
  }

  async InitServer(socketServer: Server) {
    for (const gateway of this.gateways) {
      gateway.RegisterSocket(socketServer);
    }
  }
}

export default Manager;
