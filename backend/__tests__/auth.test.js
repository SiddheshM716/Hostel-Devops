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

    it('should return 200 and a token when a dynamically created user natively logs in', async () => {
      // 1. Create a native user via the API so bcrypt hashes correctly in-flight
      const signupRes = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'jest_test@student.com',
          name: 'Jest Native User',
          password: 'securepassword123',
          role: 'student',
          contact_number: '9999999999',
          gender: 'Other',
          date_of_birth: '2000-01-01'
        });

      expect(signupRes.statusCode).toEqual(200);

      // 2. Validate Signin directly against the PostgreSQL engine
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'jest_test@student.com',
          password: 'securepassword123',
          role: 'student'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'jest_test@student.com');
    });
  });
});
