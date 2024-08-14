// server.js
import { Server } from 'socket.io';
import Manager from './src/Manager';

const openSocket = async (server: Server, port) => {
  const manager = new Manager();
  await manager.Setup();

  console.log(`listening on ${port}`);

  const io = server.listen(port);
  await manager.InitServer(io);
  io.on('connection', async (client) => {
    console.log(`connecting to ${client.id}...`);

    await manager.OnNewClient(client);

    console.log(`connected to ${client.id}...`);
  });
};

const startServer = () => {
  console.log('starting server...');

  const server = new Server({
    cors: {
      origin: '*',
    },
  });

  openSocket(server, process.env.PORT);
};

startServer();
