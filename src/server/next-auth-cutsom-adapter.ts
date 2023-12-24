import type { Account, Prisma, User } from '@prisma/client';
import type { PrismaClientAccelerated } from './db';
import type { AdapterAccount } from '@auth/core/adapters';

export function customAdapter(p: PrismaClientAccelerated) {
  return {
    createUser: (data: Prisma.UserCreateInput) => p.user.create({ data }),
    getUser: (id: string) => p.user.findUnique({ where: { id } }),
    getUserByEmail: (email: string) => p.user.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId: {
      providerAccountId: Account['providerAccountId'];
      provider: Account['provider'];
    }) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      });
      return account?.user ?? null;
    },
    updateUser: ({ id, ...data }: Prisma.UserUncheckedCreateInput) =>
      p.user.update({
        where: { id },
        data: {
          ...data,
          name: data.name!,
          email: data.email!,
          image: data.image!,
        },
      }),
    deleteUser: (id: User['id']) => p.user.delete({ where: { id } }),
    linkAccount: (data: Prisma.AccountCreateInput) =>
      p.account.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (
      provider_providerAccountId: Prisma.AccountProviderProviderAccountIdCompoundUniqueInput
    ) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken: string) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },
    createSession: (data: Prisma.SessionCreateInput) =>
      p.session.create({ data }),
    updateSession: (data: Prisma.SessionUpdateInput) =>
      p.session.update({
        where: {
          sessionToken:
            typeof data.sessionToken === 'string'
              ? data.sessionToken
              : undefined,
        },
        data,
      }),
    deleteSession: (sessionToken: string) =>
      p.session.delete({ where: { sessionToken } }),
  };
}
