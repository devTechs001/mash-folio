import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { HttpError } from './errors.js';

/**
 * JSON file persistence with serialized, atomic writes (write temp → rename).
 * Swap this module for a database when you outgrow a single instance.
 */
class JsonFile {
  constructor(filePath, fallback = null) {
    this.filePath = filePath;
    this.fallback = fallback;
    this.queue = Promise.resolve();
  }

  async read() {
    try {
      const raw = await readFile(this.filePath, 'utf8');
      return raw ? JSON.parse(raw) : this.fallback;
    } catch (error) {
      if (error.code === 'ENOENT') return this.fallback;
      if (error instanceof SyntaxError) return this.fallback;
      throw error;
    }
  }

  async write(value) {
    const filePath = this.filePath;
    const run = async () => {
      await mkdir(path.dirname(filePath), { recursive: true });
      const temp = `${filePath}.${process.pid}.tmp`;
      await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
      await rename(temp, filePath);
    };

    this.queue = this.queue.then(run, run);
    return this.queue;
  }
}

export class ContentStore {
  constructor(filePath) {
    this.file = new JsonFile(filePath);
  }

  async read() {
    const record = await this.file.read();
    if (!record || typeof record !== 'object' || !record.content) {
      return { content: null, updatedAt: null };
    }
    return { content: record.content, updatedAt: record.updatedAt ?? null };
  }

  async save(content) {
    const record = { content, updatedAt: new Date().toISOString() };
    await this.file.write(record);
    return record;
  }
}

export class MessageStore {
  constructor(filePath) {
    this.file = new JsonFile(filePath, { messages: [] });
    this.queue = Promise.resolve();
  }

  async list() {
    const record = await this.file.read();
    const messages = record?.messages;
    if (!Array.isArray(messages)) return [];
    return [...messages].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  mutate(mutator) {
    const run = async () => {
      const messages = await this.list();
      const next = await mutator(messages);
      await this.file.write({ messages: next });
      return next;
    };

    this.queue = this.queue.then(run, run);
    return this.queue;
  }

  async add(input) {
    const entry = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    await this.mutate((messages) => [entry, ...messages]);
    return entry;
  }

  async setRead(id, read) {
    let updated = null;

    await this.mutate((messages) =>
      messages.map((message) => {
        if (message.id !== id) return message;
        updated = { ...message, read };
        return updated;
      })
    );

    if (!updated) throw new HttpError(404, 'That message no longer exists.', 'not_found');
    return updated;
  }

  async remove(id) {
    let removed = false;

    await this.mutate((messages) =>
      messages.filter((message) => {
        if (message.id !== id) return true;
        removed = true;
        return false;
      })
    );

    if (!removed) throw new HttpError(404, 'That message no longer exists.', 'not_found');
  }

  async clear() {
    await this.mutate(() => []);
  }
}
