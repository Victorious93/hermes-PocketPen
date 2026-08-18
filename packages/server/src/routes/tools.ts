import express from 'express';
import kaliTools from '../tools/catalog';
import { mockRunTool } from '../tools/runner.mock';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Simple in-memory job store for the scaffold
const jobs: Record<string, any> = {};

router.get('/api/tools', (req, res) => {
  res.json(kaliTools.map(t => ({ id: t.id, name: t.name, description: t.description, args: t.args, risk: t.risk })));
});

router.post('/api/tools/:toolId/run', async (req, res) => {
  const toolId = req.params.toolId;
  const tool = kaliTools.find(t => t.id === toolId);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  // IMPORTANT: This route uses a mock runner. Real execution must be sandboxed (Docker) and gated behind admin permissions.
  const jobId = uuidv4();
  const args = req.body || {};
  jobs[jobId] = { jobId, toolId, status: 'queued', createdAt: new Date().toISOString() };

  // Run asynchronously (mock)
  (async () => {
    jobs[jobId].status = 'running';
    const result = await mockRunTool(tool, args, jobId);
    jobs[jobId] = { ...jobs[jobId], ...result };
  })();

  res.json({ jobId, status: 'queued' });
});

router.get('/api/tools/jobs/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

export default router;
