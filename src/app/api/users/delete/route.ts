import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {

    const { userIds } = await req.json();


    if (userIds && Array.isArray(userIds)) {

      await prisma.user.deleteMany({
        where: {
          id: { in: userIds },
        },
      });
      return NextResponse.json({ message: 'Users deleted successfully.' }, { status: 200 });
    } 

    else if (userIds && typeof userIds === 'string') {
      await prisma.user.delete({
        where: {
          id: userIds,
        },
      });
      return NextResponse.json({ message: 'User deleted successfully.' }, { status: 200 });
    } 

    else {
      return NextResponse.json({ error: 'Invalid request format. Expected a user ID or an array of user IDs.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting users:', error);
    return NextResponse.json({ error: 'Failed to delete users' }, { status: 500 });
  }
}
