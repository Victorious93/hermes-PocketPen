import { Tool } from './catalog';

export interface RunResult {
  jobId: string;
  toolId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  finishedAt?: string;
  output?: string; // small textual output or path to artifact
}

// Mock runner: simulates execution and returns a fake result.
export async function mockRunTool(tool: Tool, args: Record<string, any>, jobId: string): Promise<RunResult> {
  const start = new Date();
  // Simulate different durations by risk
  const baseMs = 800;
  const riskMultiplier = tool.risk === 'high' ? 4 : tool.risk === 'medium' ? 2 : 1;
  const duration = baseMs * riskMultiplier;

  const running: RunResult = {
    jobId,
    toolId: tool.id,
    status: 'running',
    startedAt: start.toISOString()
  };

  // In a real implementation we'd stream logs via websockets. Here we wait and return a mocked output.
  await new Promise((res) => setTimeout(res, duration));

  const end = new Date();
  const result: RunResult = {
    jobId,
    toolId: tool.id,
    status: 'completed',
    startedAt: start.toISOString(),
    finishedAt: end.toISOString(),
    output: `MOCKED: Executed ${tool.name} with args ${JSON.stringify(args)}. This is a simulated output. Do not run real tools in CI or without explicit authorization.`
  };

  return result;
}
