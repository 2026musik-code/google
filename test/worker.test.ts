import { describe, it, expect, vi, beforeEach } from 'vitest'
import app from '../src/index'

// Mock fetch globally
const fetchSpy = vi.fn()
global.fetch = fetchSpy

describe('Jules Worker Builder API', () => {
  beforeEach(() => {
    fetchSpy.mockReset()
  })

  it('GET / should return HTML', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toContain('<!DOCTYPE html>')
  })

  it('POST /api/deploy should fail if fields are missing', async () => {
    const res = await app.request('/api/deploy', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' }
    })
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Semua field harus diisi.')
  })

  it('POST /api/deploy should process correctly', async () => {
    // Mock Google AI Response
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        candidates: [{
          content: {
            parts: [{ text: 'export default { fetch: (req) => new Response("Hello") }' }]
          }
        }]
      })
    })

    // Mock Cloudflare Response
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      text: async () => '{"success": true}'
    })

    const payload = {
      cfAccountId: 'fake-account',
      cfApiToken: 'fake-token',
      googleApiKey: 'fake-key',
      workerName: 'test-worker',
      prompt: 'Make a hello world'
    }

    const res = await app.request('/api/deploy', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    })

    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.code).toContain('export default')

    // Verify mocks called
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('POST /api/deploy should handle AI failure', async () => {
    // Mock Google AI Failure
    fetchSpy.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: 'Invalid API Key' } })
    })

    const payload = {
      cfAccountId: 'fake-account',
      cfApiToken: 'fake-token',
      googleApiKey: 'bad-key',
      workerName: 'test-worker',
      prompt: 'Make a hello world'
    }

    const res = await app.request('/api/deploy', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    })

    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toContain('Invalid API Key')
  })
})
