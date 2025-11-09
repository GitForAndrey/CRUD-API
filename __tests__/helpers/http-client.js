import http from 'http';

export const makeRequest = (method, path, body = null, port = 3000) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let parsedBody;
        try {
          parsedBody = data ? JSON.parse(data) : null;
        } catch (e) {
          parsedBody = data;
        }

        resolve({
          statusCode: res.statusCode,
          body: parsedBody,
          headers: res.headers,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
};