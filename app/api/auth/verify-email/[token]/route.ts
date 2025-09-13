import { verifyEmail } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;

    if (!token) {
      return new NextResponse('Missing token', { status: 400 });
    }

    const user = await verifyEmail(token);

    if (!user) {
      return new NextResponse('Invalid token', { status: 400 });
    }

    // Redirect to a page that says email has been verified
    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
