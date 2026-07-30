import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "content", "posts");
const notesDir = path.join(root, "content", "notes");
const outputDir = path.join(root, "generated");
const outputFile = path.join(outputDir, "posts.js");
const notesOutputFile = path.join(outputDir, "notes.js");

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try { return JSON.parse(trimmed); }
    catch { throw new Error(`数组格式错误：${trimmed}`); }
  }
  return trimmed.replace(/^(["'])(.*)\1$/, "$2");
}

function parsePost(source, filename) {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename} 缺少正确的 --- 元数据区域`);

  const meta = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`${filename} 元数据格式错误：${line}`);
    meta[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }

  const fallbackId = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/i, "");
  const post = {
    id: meta.id || fallbackId,
    title: meta.title,
    date: meta.date,
    category: meta.category || "随笔",
    readTime: meta.readTime || `${Math.max(1, Math.ceil(match[2].replace(/\s/g, "").length / 500))} 分钟`,
    accent: meta.accent || "violet",
    emoji: meta.emoji || "✦",
    featured: meta.featured === true,
    excerpt: meta.excerpt || "",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    content: match[2].trim(),
    draft: meta.draft === true,
    source: `content/posts/${filename}`
  };

  for (const field of ["id", "title", "date", "category", "excerpt"]) {
    if (!post[field]) throw new Error(`${filename} 缺少必填字段：${field}`);
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(post.id)) {
    throw new Error(`${filename} 的 id 只能使用小写英文、数字和短横线`);
  }
  if (Number.isNaN(Date.parse(post.date))) throw new Error(`${filename} 的日期无效：${post.date}`);
  return post;
}

function parseNote(source, filename) {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename} 缺少正确的 --- 元数据区域`);

  const meta = {};
  for (const line of match[1].split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`${filename} 元数据格式错误：${line}`);
    meta[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }

  const fallbackId = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/i, "");
  const note = {
    id: meta.id || fallbackId,
    title: meta.title,
    date: meta.date,
    topic: meta.topic || "今日学习",
    summary: meta.summary || "",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    content: match[2].trim(),
    draft: meta.draft === true,
    source: `content/notes/${filename}`
  };

  for (const field of ["id", "title", "date", "summary"]) {
    if (!note[field]) throw new Error(`${filename} 缺少必填字段：${field}`);
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(note.id)) {
    throw new Error(`${filename} 的 id 只能使用小写英文、数字和短横线`);
  }
  if (Number.isNaN(Date.parse(note.date))) throw new Error(`${filename} 的日期无效：${note.date}`);
  return note;
}

const files = (await readdir(postsDir)).filter(name => name.endsWith(".md") && !name.startsWith("_"));
const posts = [];
for (const filename of files) {
  const source = await readFile(path.join(postsDir, filename), "utf8");
  const post = parsePost(source, filename);
  if (!post.draft) posts.push(post);
}

const ids = new Set();
for (const post of posts) {
  if (ids.has(post.id)) throw new Error(`文章 id 重复：${post.id}`);
  ids.add(post.id);
  delete post.draft;
}
posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

const noteFiles = (await readdir(notesDir)).filter(name => name.endsWith(".md") && !name.startsWith("_"));
const notes = [];
for (const filename of noteFiles) {
  const source = await readFile(path.join(notesDir, filename), "utf8");
  const note = parseNote(source, filename);
  if (!note.draft) notes.push(note);
}

const noteIds = new Set();
for (const note of notes) {
  if (noteIds.has(note.id)) throw new Error(`学习笔记 id 重复：${note.id}`);
  noteIds.add(note.id);
  delete note.draft;
}
notes.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

await mkdir(outputDir, { recursive: true });
await writeFile(outputFile, `/* 此文件由 scripts/build-posts.mjs 自动生成，请勿手动修改。 */\nwindow.BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
await writeFile(notesOutputFile, `/* 此文件由 scripts/build-posts.mjs 自动生成，请勿手动修改。 */\nwindow.BLOG_NOTES = ${JSON.stringify(notes, null, 2)};\n`, "utf8");
console.log(`Generated ${posts.length} posts -> ${path.relative(root, outputFile)}`);
console.log(`Generated ${notes.length} learning notes -> ${path.relative(root, notesOutputFile)}`);
