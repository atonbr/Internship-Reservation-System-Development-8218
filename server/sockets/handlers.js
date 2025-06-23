export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Cliente ${socket.id} entrou na sala ${room}`);
    });

    socket.on('leave_room', (room) => {
      socket.leave(room);
      console.log(`Cliente ${socket.id} saiu da sala ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
};