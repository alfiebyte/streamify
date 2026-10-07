import { describe, it, expect } from 'vitest';
import request from "supertest";

import app from "@/api"

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
  });
});