import http from 'http';
import dotenv from 'dotenv';
import { router } from './router.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const createServer = (port) => {
  const server = http.createServer(router);
  
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  return server;
};

createServer(PORT);