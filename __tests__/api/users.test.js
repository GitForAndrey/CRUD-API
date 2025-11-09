import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { createServer } from '../../src/server.js';
import { makeRequest } from '../helpers/http-client.js';
import * as db from '../../src/db/db.js';

describe('Users API Tests', () => {
  let server;
  const PORT = 4000;
  const BASE_URL = '/api/users';

  beforeAll((done) => {
    server = createServer();
    server.listen(PORT, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(async () => {
    await db.clearAll();
  });

  describe('Get Post Delete', () => {
    test('GET /api/users should return empty array', async () => {
      const response = await makeRequest('GET', BASE_URL, null, PORT);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('POST /api/users should create new user', async () => {
      const newUser = {
        username: 'Alex Alex',
        age: 20,
        hobbies: ['reading', 'gaming'],
      };

      const response = await makeRequest('POST', BASE_URL, newUser, PORT);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.username).toBe(newUser.username);
      expect(response.body.age).toBe(newUser.age);
      expect(response.body.hobbies).toEqual(newUser.hobbies);
    });

    test('DELETE /api/users/{userId} should delete user', async () => {
      const newUser = {
        username: 'John Doe',
        age: 30,
        hobbies: ['reading'],
      };
      const createResponse = await makeRequest('POST', BASE_URL, newUser, PORT);
      const userId = createResponse.body.id;

      const response = await makeRequest('DELETE', `${BASE_URL}/${userId}`, null, PORT);

      expect(response.statusCode).toBe(204);
    });

  });

  describe('Validation tests', () => {
    test('POST /api/users with missing fields should return 400', async () => {
      const invalidUser = {
        username: 'John Doe',
        // --------------
        hobbies: ['reading'],
      };

      const response = await makeRequest('POST', BASE_URL, invalidUser, PORT);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    test('GET /api/users/{invalidId}', async () => {
      const response = await makeRequest('GET', `${BASE_URL}/invalid-id`, null, PORT);
      expect(response.statusCode).toBe(404);
    });

    test('PUT /api/users/{nonExistentId}', async () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const updateData = {
        username: 'Test',
        age: 25,
        hobbies: ['test'],
      };

      const response = await makeRequest('PUT', `${BASE_URL}/${validUuid}`, updateData, PORT);

      expect(response.statusCode).toBe(404);
    });
  });

  describe('Multiple users', () => {
    test('Should create and retrieve multiple users', async () => {
      const users = [
        { username: 'Alice', age: 28, hobbies: ['yoga'] },
        { username: 'Bob', age: 32, hobbies: ['cycling'] },
        { username: 'Charlie', age: 25, hobbies: ['photography'] },
      ];

      for (const user of users) {
        await makeRequest('POST', BASE_URL, user, PORT);
      }

      const response = await makeRequest('GET', BASE_URL, null, PORT);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(3);
    });
  });
});