const request = require('supertest');
const app = require('../index');
const db = require('../db');

describe('Native PostgreSQL Auth API Checks', () => {
  // Ensure the database connection completely drains after testing
  afterAll(async () => {
    if (db._pool) {
      await db._pool.end();
    } else {
      // In case the module exported close or end directly
      await db.end && await db.end();
    }
  });

  describe('POST /api/auth/signin', () => {
    it('should return 400 Invalid Credentials if user does not exist', async () => {
      // Using a realistically invalid credential against the real DB
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

    it('should return 200 and a token if user natively exists in seed_new.sql', async () => {
      // Test native data loaded directly from PostgreSQL seed_new.sql
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'rahul@student.com',
          password: 'pass123',
          role: 'student'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'rahul@student.com');
    });
  });
});
