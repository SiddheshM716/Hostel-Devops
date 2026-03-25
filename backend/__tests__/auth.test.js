const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Backend Auth API Route Tests', () => {
  it('should return an error for invalid login credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'wrongpassword', role: 'student' });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
