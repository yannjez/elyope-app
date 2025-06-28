import { prisma } from '@elyope/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test the database connection
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      userCount,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
