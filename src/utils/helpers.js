export const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
};

export const extractUserId = (url) => {
  const userIdPattern = /^\/api\/users\/([a-f0-9-]+)$/;
  const match = url.match(userIdPattern);
  return match ? match[1] : null;
};
