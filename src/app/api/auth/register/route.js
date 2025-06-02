import { connectToDatabase } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password, role = 'dealer', adminSecret } = await request.json();

    // Verify admin secret
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Invalid admin secret.'
      }, { status: 403 });
    }

    // Check if email is in authorized list
    const authorizedEmails = process.env.AUTHORIZED_EMAILS?.split(',').map(e => e.trim()) || [];
    if (!authorizedEmails.includes(email)) {
      return NextResponse.json({
        success: false,
        error: 'Email not in authorized list. Please add to AUTHORIZED_EMAILS first.'
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User already exists'
      }, { status: 400 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
