const request = require('supertest');
const app = require('../index');
const db = require('../db');

jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Auth API Checks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signin', () => {
    it('should return 400 Invalid Credentials if user does not exist', async () => {
      // Mock DB to return 0 rows
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword',
          role: 'student'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error', 'Invalid Credentials');
    });

    it('should return 500 if DB fails catastrophically', async () => {
      db.query.mockRejectedValueOnce(new Error('Connection failed'));

      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com',
          password: 'pass',
          role: 'warden'
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Connection failed');
    });
  });
});
