export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@bigbazar/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validate inputs
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'An account with this email already exists.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'USER',
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
