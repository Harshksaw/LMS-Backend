const request = require('supertest');
const app = require('../index');

describe('Health Route', () => {
  it('should return status 200 and { status: "OK" }', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });
});