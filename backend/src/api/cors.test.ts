import request from 'supertest';
import express, { Application } from 'express';
import cors from 'cors';

describe('CORS Configuration', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    
    // Simulate the CORS configuration from index.ts
    const allowedOrigins = ['http://localhost:4200', 'http://localhost:4201'];
    
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Length', 'X-Request-Id'],
      maxAge: 86400
    }));
    
    app.get('/test', (_req, res) => {
      res.json({ message: 'test' });
    });
  });

  it('should allow requests from configured origin', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:4200');
    
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4200');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should allow requests from multiple configured origins', async () => {
    const response = await request(app)
      .get('/test')
      .set('Origin', 'http://localhost:4201');
    
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4201');
  });

  it('should allow requests with no origin', async () => {
    const response = await request(app).get('/test');
    
    expect(response.status).toBe(200);
  });

  it('should handle preflight OPTIONS requests', async () => {
    const response = await request(app)
      .options('/test')
      .set('Origin', 'http://localhost:4200')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type,Authorization');
    
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
    expect(response.headers['access-control-allow-headers']).toContain('Authorization');
  });

  it('should set max-age for preflight cache', async () => {
    const response = await request(app)
      .options('/test')
      .set('Origin', 'http://localhost:4200')
      .set('Access-Control-Request-Method', 'GET');
    
    expect(response.headers['access-control-max-age']).toBe('86400');
  });
});
