import assert from 'node:assert/strict';
import test from 'node:test';
import {UnauthorizedException} from '@nestjs/common';
import {AuthService} from '../src/auth/auth.service';
import {hashPassword} from '../src/common/security/password';

function prismaWithUser(passwordHash: string) {
  const calls = {sessionCreate: 0};
  const prisma = {
    user: {
      findUnique: async () => ({
        id: 'user-1',
        email: 'person@example.com',
        name: 'Test User',
        passwordHash,
        memberships: [{
          organizationId: 'organization-1',
          role: 'OWNER',
          organization: {name: 'Test Organization'},
        }],
      }),
    },
    session: {
      create: async () => {
        calls.sessionCreate += 1;
        return {id: 'session-1'};
      },
    },
  };

  return {calls, prisma};
}

test('login rejects an incorrect password without creating a session', async () => {
  const passwordHash = await hashPassword('correct password');
  const {calls, prisma} = prismaWithUser(passwordHash);
  const auth = new AuthService(prisma as any);

  await assert.rejects(
    auth.login({email: 'person@example.com', password: 'incorrect password'}),
    (error: unknown) => error instanceof UnauthorizedException
      && error.message === 'Invalid email or password',
  );
  assert.equal(calls.sessionCreate, 0);
});

test('login rejects a malformed stored password hash without creating a session', async () => {
  const {calls, prisma} = prismaWithUser('not-a-password-hash');
  const auth = new AuthService(prisma as any);

  await assert.rejects(
    auth.login({email: 'person@example.com', password: 'any password'}),
    UnauthorizedException,
  );
  assert.equal(calls.sessionCreate, 0);
});

test('login creates a session when the password is correct', async () => {
  const passwordHash = await hashPassword('correct password');
  const {calls, prisma} = prismaWithUser(passwordHash);
  const auth = new AuthService(prisma as any);

  const result = await auth.login({email: 'person@example.com', password: 'correct password'});

  assert.equal(calls.sessionCreate, 1);
  assert.equal(result.user.email, 'person@example.com');
  assert.deepEqual(result.organizations, [{
    id: 'organization-1',
    name: 'Test Organization',
    role: 'OWNER',
  }]);
  assert.ok(result.sessionToken.length >= 40);
});
