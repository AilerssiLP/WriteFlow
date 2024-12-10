import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();  // Parse the incoming request body
    console.log('Request body:', body); // Debugging: Log the incoming data
  
    const { userId, isActive } = body;
  
    if (!userId || isActive === undefined) {
      return NextResponse.json({ error: 'Missing userId or isActive field' }, { status: 400 });
    }
  
    // Proceed to update the user's active status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  
    return NextResponse.json({ message: 'Activation status updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
