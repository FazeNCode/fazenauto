import { connectToDatabase } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    // Check if email is authorized
    const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(',').map(e => e.trim()) || [];
    if (!authorizedEmails.includes(email)) {
      return NextResponse.json({
        success: false,
        error: 'Access denied. Email not authorized.'
      }, { status: 403 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Account not found. Please contact administrator.'
      }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed. Please try again.'
    }, { status: 500 });
  }
}
