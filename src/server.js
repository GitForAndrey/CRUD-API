import http from 'http';
import dotenv from 'dotenv';
import { router } from './router.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const createServer = (port) => {
  const server = http.createServer(router);
  
  server.listen(port, () => {
    console.log(`Server is running ${port}`);
  });
  
 
  if (NODE_ENV === 'production') {
    server.on('error', (error) => {
      console.error('Server error:', error);
      process.exit(1);
    });
    
  }
   process.on('SIGINT', () => {
    console.log('\n Server stopped');
    process.exit(0);
  });
  
  return server;
};

createServer(PORT);