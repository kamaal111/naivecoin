export default {
  SERVER_PORT: process.env.SERVER_PORT ?? '3001',
  SOCKETS_PORT: Number(process.env.SERVER_PORT) ?? 6001,
};
