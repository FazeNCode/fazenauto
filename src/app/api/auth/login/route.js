import { connectToDatabase } from '@/lib/dbConnect';
// import User from '@/models/User';
// import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Simulated auth response (replace with JWT/session later)
    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
