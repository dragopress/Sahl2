import assert from 'node:assert/strict';
import test from 'node:test';
import {hashPassword, verifyPassword, hashToken, createToken} from '../src/common/security/password';
import {RateLimitGuard} from '../src/common/rate-limit.guard';
import {CsrfGuard} from '../src/common/csrf.guard';

function context(req: any) {
  return {switchToHttp: () => ({getRequest: () => req})} as any;
}

test('password hashing produces independently salted scrypt hashes', async () => {
  const first = await hashPassword('correct horse battery staple');
  const second = await hashPassword('correct horse battery staple');

  assert.notEqual(first, second);
  for (const encoded of [first, second]) {
    const [scheme, salt, digest] = encoded.split('$');
    assert.equal(scheme, 'scrypt');
    assert.match(salt, /^[0-9a-f]{32}$/);
    assert.match(digest, /^[0-9a-f]{128}$/);
  }
});

test('password verification accepts the password used to create the hash', async () => {
  const encoded = await hashPassword('correct horse battery staple');

  assert.equal(await verifyPassword('correct horse battery staple', encoded), true);
});

test('password verification rejects a different password with an equal-length derived key', async () => {
  const encoded = await hashPassword('correct horse battery staple');

  assert.equal(await verifyPassword('wrong password', encoded), false);
});

test('password verification rejects a tampered digest of the expected length', async () => {
  const encoded = await hashPassword('correct horse battery staple');
  const [scheme, salt] = encoded.split('$');
  const tampered = `${scheme}$${salt}$${'00'.repeat(64)}`;

  assert.equal(await verifyPassword('correct horse battery staple', tampered), false);
});

test('password verification rejects malformed hashes without throwing', async () => {
  const malformedHashes = [
    '',
    'argon2$salt$digest',
    'scrypt$$00',
    'scrypt$salt$',
    'scrypt$salt$not-hex',
    'scrypt$salt$00',
    `scrypt$salt$${'00'.repeat(65)}`,
  ];

  for (const encoded of malformedHashes) {
    assert.equal(await verifyPassword('password', encoded), false, encoded);
  }
});

test('tokens are high entropy and hashes are deterministic', () => {
  const token = createToken();
  assert.match(token, /^[A-Za-z0-9_-]+$/);
  assert.equal(Buffer.from(token, 'base64url').length, 32);
  assert.equal(hashToken('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  assert.notEqual(hashToken(token), hashToken(createToken()));
});

test('rate limiter distinguishes authentication and API buckets', () => {
  process.env.AUTH_RATE_LIMIT_MAX = '1';
  process.env.RATE_LIMIT_MAX = '2';
  process.env.RATE_LIMIT_WINDOW_MS = '60000';
  const guard = new RateLimitGuard();
  const make = (path: string) => ({
    baseUrl: '/api/v1', path,
    ip: '198.51.100.10',
    socket: {remoteAddress: '198.51.100.10'},
    headers: {},
    res: {setHeader() {}}
  });
  assert.equal(guard.canActivate(context(make('/auth/login'))), true);
  assert.throws(() => guard.canActivate(context(make('/auth/login'))), /Too many requests/);
  assert.equal(guard.canActivate(context(make('/customers'))), true);
  assert.equal(guard.canActivate(context(make('/customers'))), true);
  assert.throws(() => guard.canActivate(context(make('/customers'))), /Too many requests/);
});

test('CSRF guard permits safe requests and same-origin mutations', () => {
  process.env.CORS_ORIGINS = 'http://localhost:3000';
  const guard = new CsrfGuard();
  const base = {method:'POST', headers:{cookie:'sahlbiz_session=abc', origin:'http://localhost:3000', 'sec-fetch-site':'same-origin'}};
  assert.equal(guard.canActivate(context(base)), true);
  assert.throws(() => guard.canActivate(context({...base, headers:{...base.headers, origin:'https://evil.example'}})), /Origin not allowed/);
  assert.throws(() => guard.canActivate(context({...base, headers:{...base.headers, 'sec-fetch-site':'cross-site'}})), /Cross-site request blocked/);
  assert.equal(guard.canActivate(context({...base, method:'GET'})), true);
});
