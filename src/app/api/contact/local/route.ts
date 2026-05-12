import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'contact_messages.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '[]', 'utf8');
}

export async function GET() {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const data = JSON.parse(raw || '[]');
    return NextResponse.json(data);
  } catch (_err) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureDataFile();
    const payload = await request.json();
    const id = crypto.randomUUID();
    const record = { id, ...payload };
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const list = JSON.parse(raw || '[]');
    list.unshift(record);
    fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), 'utf8');
    return NextResponse.json(record, { status: 201 });
  } catch (_err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    ensureDataFile();
    const { id, status } = await request.json();
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const list = JSON.parse(raw || '[]') as Array<Record<string, unknown>>;
    const idx = list.findIndex((r) => (r['id'] as string) === id);
    if (idx === -1) return NextResponse.json({ error: 'not found' }, { status: 404 });
    list[idx].status = status;
    fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), 'utf8');
    return NextResponse.json(list[idx]);
  } catch (_err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    ensureDataFile();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const list = JSON.parse(raw || '[]') as Array<Record<string, unknown>>;
    const next = list.filter((r) => (r['id'] as string) !== id);
    fs.writeFileSync(FILE_PATH, JSON.stringify(next, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (_err) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
