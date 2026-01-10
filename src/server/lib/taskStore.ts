import path from 'node:path';
import { FileAccess } from '../../fs/fileAccess';
import { FileAccessError } from '../../fs/types';

const TASK_JSON_PATTERN = /^ai\/tasks\/(TASK_[A-Za-z0-9_\\-]+)\/task\.json$/;
const TASK_PREFIX = 'ai/tasks';
const TEMPLATE_DIR = 'ai/tasks/templates';

export interface TaskDetail {
  task: Record<string, unknown>;
  checklist: string;
  progress: Record<string, unknown>[];
}

export async function listTasks(fileAccess: FileAccess) {
  const files = await fileAccess.list(TASK_PREFIX);
  const tasks = [];
  for (const filePath of files) {
    if (filePath.includes('templates/')) {
      continue;
    }
    const match = filePath.match(TASK_JSON_PATTERN);
    if (match) {
      const taskId = match[1];
      const data = await fileAccess.readJson<Record<string, unknown>>(filePath);
      const checklistComplete = await isChecklistComplete(fileAccess, taskId);
      tasks.push({ ...data, checklist_complete: checklistComplete });
    }
  }
  return tasks;
}

export async function getTaskDetail(fileAccess: FileAccess, taskId: string): Promise<TaskDetail> {
  const base = path.posix.join(TASK_PREFIX, taskId);
  const task = await fileAccess.readJson<Record<string, unknown>>(`${base}/task.json`);
  const checklist = await fileAccess.readText(`${base}/checklist.md`);
  const progressRaw = await fileAccess.readText(`${base}/progress.ndjson`);
  const progress = parseNdjson(progressRaw);
  return { task, checklist, progress };
}

export async function createTaskFromTemplate(
  fileAccess: FileAccess,
  taskId: string,
  overrides: Partial<Record<string, unknown>>
) {
  const files = await fileAccess.list(TEMPLATE_DIR);
  const targetDir = path.posix.join(TASK_PREFIX, taskId);
  for (const templatePath of files) {
    const relative = path.posix.relative(TEMPLATE_DIR, templatePath);
    const destination = path.posix.join(targetDir, relative);
    const contents = await fileAccess.readText(templatePath);
    const populated = contents.replace(/{{TASK_ID}}/g, taskId);
    await fileAccess.writeText(destination, populated);
  }
  const taskPath = `${targetDir}/task.json`;
  const task = await fileAccess.readJson<Record<string, unknown>>(taskPath);
  const updated = { ...task, ...overrides };
  await fileAccess.writeJson(taskPath, updated, { schema: 'schemas/task.json' });
  return updated;
}

export function parseNdjson(raw: string): Record<string, unknown>[] {
  return raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { raw: line };
      }
    });
}

export async function toggleChecklistLine(fileAccess: FileAccess, taskId: string, lineIndex: number, checked: boolean) {
  const checklistPath = `${TASK_PREFIX}/${taskId}/checklist.md`;
  const contents = await fileAccess.readText(checklistPath);
  const lines = contents.split(/\r?\n/);
  if (lineIndex < 0 || lineIndex >= lines.length) {
    throw new FileAccessError('Checklist line index out of range', 'IO_ERROR', {
      relativePath: checklistPath,
      absolutePath: fileAccess.resolve(checklistPath),
      mode: fileAccess.getMode()
    });
  }
  const line = lines[lineIndex];
  const updatedLine = line.replace(/\[(x| )\]/i, checked ? '[x]' : '[ ]');
  lines[lineIndex] = updatedLine;
  await fileAccess.writeText(checklistPath, `${lines.join('\n')}\n`);
  return updatedLine;
}

export async function appendProgressEntry(
  fileAccess: FileAccess,
  taskId: string,
  entry: Record<string, unknown>
) {
  const logPath = `${TASK_PREFIX}/${taskId}/progress.ndjson`;
  await fileAccess.appendNdjson(logPath, entry, { schema: 'schemas/progress_event.json' });
}

export async function listTemplates(fileAccess: FileAccess) {
  const files = await fileAccess.list(TEMPLATE_DIR);
  return files.filter((file) => file.endsWith('task.json')).map((file) => path.posix.basename(path.posix.dirname(file)));
}

async function isChecklistComplete(fileAccess: FileAccess, taskId: string) {
  try {
    const checklistPath = `${TASK_PREFIX}/${taskId}/checklist.md`;
    const contents = await fileAccess.readText(checklistPath);
    const actionable = contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- ['));
    if (actionable.length === 0) {
      return false;
    }
    return actionable.every((line) => /\[[xX]\]/.test(line));
  } catch {
    return false;
  }
}
