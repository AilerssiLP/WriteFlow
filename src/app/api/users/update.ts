import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { userIds, role, isActive, isOnline } = await req.json();
    if (userIds && role) {

      await prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: { role },
      });
      return NextResponse.json({ message: 'Roles updated successfully.' }, { status: 200 });
    } else if (userIds && isActive !== undefined) {

      await prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: { isActive },
      });
      return NextResponse.json({ message: 'Activation status updated successfully.' }, { status: 200 });
    } else if (userIds && isOnline !== undefined) {

      await prisma.user.updateMany({
        where: {
          id: { in: userIds },
        },
        data: { isOnline },
      });
      return NextResponse.json({ message: 'Online status updated successfully.' }, { status: 200 });
    } else {
      const { id, role, isActive, isOnline } = await req.json();
      const user = await prisma.user.update({
        where: { id },
        data: { role, isActive, isOnline },
      });
      return NextResponse.json(user, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
