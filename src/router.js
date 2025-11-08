import * as userController from './controllers/userController.js';
import { sendJSON, extractUserId } from './utils/helpers.js';

const routes = [
  {
    method: 'GET',
    pattern: '/api/users',
    handler: userController.getAllUsers
  },
  {
    method: 'POST',
    pattern: '/api/users',
    handler: userController.createUser
  },
  {
    method: 'GET',
    pattern: /^\/api\/users\/[a-f0-9-]+$/,
    handler: async (req, res) => {
      const userId = extractUserId(req.url || '');
      if (userId) {
        await userController.getUserById(req, res, userId);
      }
    }
  },
  {
    method: 'PUT',
    pattern: /^\/api\/users\/[a-f0-9-]+$/,
    handler: async (req, res) => {
      const userId = extractUserId(req.url || '');
      if (userId) {
        await userController.updateUser(req, res, userId);
      }
    }
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/users\/[a-f0-9-]+$/,
    handler: async (req, res) => {
      const userId = extractUserId(req.url || '');
      if (userId) {
        await userController.deleteUser(req, res, userId);
      }
    }
  }
];

const matchRoute = (method, url) => {
  return routes.find(route => {
    const methodMatches = route.method === method;
    const patternMatches = typeof route.pattern === 'string'
      ? route.pattern === url
      : route.pattern.test(url);
    
    return methodMatches && patternMatches;
  });
};


export const router = async (req, res) => {
  const { method = '', url = '' } = req;
  const parsedUrl = url.split('?')[0];
  
  const route = matchRoute(method, parsedUrl);
  
  if (route) {
    await route.handler(req, res);
  } else {
    sendJSON(res, 404, { message: 'Route not found' });
  }
};