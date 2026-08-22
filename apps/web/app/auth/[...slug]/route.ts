import { NextResponse } from 'next/server';
import { store } from '../../api/data-store';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const action = slug[0];

  if (action === 'me') {
    return NextResponse.json({
      user: store.user,
      organizations: store.orgs,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const action = slug[0];

  if (action === 'login' || action === 'register') {
    let body: any = {};
    try {
      body = await req.json();
    } catch {}

    if (action === 'register' && body.name) {
      store.user.name = body.name;
      if (body.email) store.user.email = body.email;
      if (body.organizationName) {
        store.orgs[0].organization.name = body.organizationName;
      }
    }

    return NextResponse.json({
      user: store.user,
      organizations: store.orgs,
    });
  }

  return NextResponse.json({ ok: true });
}
