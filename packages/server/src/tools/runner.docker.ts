import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { Tool } from './catalog';
import type { RunResult } from './runner.mock';

const DEFAULT_IMAGE = process.env.KALI_RUNNER_IMAGE || 'kalilinux/kali-rolling:latest';
const ARTIFACT_ROOT = process.env.KALI_ARTIFACT_ROOT || '/tmp/kali-tool-artifacts';
const TIMEOUT_MS = parseInt(process.env.KALI_RUN_TIMEOUT_MS || '120000', 10); // default 2 minutes

function sanitizeArg(value: string): string {
  // Very conservative sanitizer: disallow characters that can be used for shell injection
  // Accept only alphanumerics, common punctuation for URLs/paths, and limited symbols.
  if (typeof value !== 'string') return value;
  const unsafe = /[;&|<>`\\$\n\r]/;
  if (unsafe.test(value)) throw new Error('Argument contains unsafe characters');
  return value;
}

function buildCommand(template: string, args: Record<string, any>) {
  let cmd = template;
  for (const [k, v] of Object.entries(args)) {
    const safe = typeof v === 'string' ? sanitizeArg(v) : String(v);
    cmd = cmd.split(`{${k}}`).join(safe);
  }
  // Remove any unreplaced placeholders
  cmd = cmd.replace(/\{[^}]+\}/g, '');
  return cmd;
}

export async function dockerRunTool(tool: Tool, args: Record<string, any>, jobId: string): Promise<RunResult> {
  const start = new Date();
  const artifactDir = path.join(ARTIFACT_ROOT, jobId);
  await fs.mkdir(artifactDir, { recursive: true });

  const cmd = buildCommand(tool.cliTemplate, args);

  const dockerArgs = [
    'run', '--rm',
    '--network', 'none',
    '-v', `${artifactDir}:/artifacts`,
    '--cpus', '1',
    '--memory', '512m',
    '--pids-limit', '64',
    DEFAULT_IMAGE,
    'sh', '-c', cmd
  ];

  const child = spawn('docker', dockerArgs, { stdio: ['ignore', 'pipe', 'pipe'] });

  let stdout = '';
  let stderr = '';
  let timedOut = false;

  const timeout = setTimeout(() => {
    timedOut = true;
    try { child.kill('SIGKILL'); } catch (e) { /* ignore */ }
  }, TIMEOUT_MS);

  child.stdout.on('data', (d) => { stdout += d.toString(); });
  child.stderr.on('data', (d) => { stderr += d.toString(); });

  const exitCode: number = await new Promise((resolve) => {
    child.on('close', (code) => {
      clearTimeout(timeout);
      resolve(code === null ? 1 : code);
    });
    child.on('error', (err) => {
      clearTimeout(timeout);
      stderr += '\n' + err.message;
      resolve(1);
    });
  });

  const finishedAt = new Date();

  const outFile = path.join(artifactDir, 'output.txt');
  const outputContent = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
  await fs.writeFile(outFile, outputContent, 'utf8');

  const result: RunResult = {
    jobId,
    toolId: tool.id,
    status: timedOut || exitCode !== 0 ? 'failed' : 'completed',
    startedAt: start.toISOString(),
    finishedAt: finishedAt.toISOString(),
    output: outFile
  };

  return result;
}
