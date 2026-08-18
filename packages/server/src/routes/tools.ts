import express from 'express';
import kaliTools from '../tools/catalog';
import { mockRunTool } from '../tools/runner.mock';
import { dockerRunTool } from '../tools/runner.docker';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Simple in-memory job store for the scaffold
const jobs: Record<string, any> = {};

const ENABLE_REAL_RUNS = process.env.ENABLE_TOOL_EXECUTION === 'true';
const ALLOW_HIGH_RISK = process.env.ALLOW_HIGH_RISK === 'true';

router.get('/api/tools', (req, res) => {
  res.json(kaliTools.map(t => ({ id: t.id, name: t.name, description: t.description, args: t.args, risk: t.risk })));
});

router.post('/api/tools/:toolId/run', async (req, res) => {
  const toolId = req.params.toolId;
  const tool = kaliTools.find(t => t.id === toolId);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });

  const jobId = uuidv4();
  const args = req.body || {};
  jobs[jobId] = { jobId, toolId, status: 'queued', createdAt: new Date().toISOString() };

  // Decide runner
  if (ENABLE_REAL_RUNS) {
    // Gate high-risk tools unless explicitly allowed
    if (tool.risk === 'high' && !ALLOW_HIGH_RISK) {
      jobs[jobId].status = 'failed';
      jobs[jobId].output = 'High-risk tool execution not allowed by server configuration.';
    } else {
      (async () => {
        jobs[jobId].status = 'running';
        try {
          const result = await dockerRunTool(tool, args, jobId);
          jobs[jobId] = { ...jobs[jobId], ...result };
        } catch (err: any) {
          jobs[jobId] = { ...jobs[jobId], status: 'failed', finishedAt: new Date().toISOString(), output: String(err?.message || err) };
        }
      })();
    }
  } else {
    // Fallback to mocked runner
    (async () => {
      jobs[jobId].status = 'running';
      const result = await mockRunTool(tool, args, jobId);
      jobs[jobId] = { ...jobs[jobId], ...result };
    })();
  }

  res.json({ jobId, status: jobs[jobId].status });
});

router.get('/api/tools/jobs/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

export default router;
