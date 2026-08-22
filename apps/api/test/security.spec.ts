import assert from 'node:assert/strict';
import test from 'node:test';
import {hashPassword, verifyPassword, hashToken, createToken} from '../src/common/security/password';
import {RateLimitGuard} from '../src/common/rate-limit.guard';
import {CsrfGuard} from '../src/common/csrf.guard';

function context(req: any) {
  return {switchToHttp: () => ({getRequest: () => req})} as any;
}

test('password hashing uses a unique salt and verifies safely', async () => {
  const a = await hashPassword('correct horse battery staple');
  const b = await hashPassword('correct horse battery staple');
  assert.notEqual(a, b);
  assert.equal(await verifyPassword('correct horse battery staple', a), true);
  assert.equal(await verifyPassword('wrong password', a), false);
  assert.equal(await verifyPassword('x', 'invalid'), false);
});

test('tokens are high entropy and hashes are deterministic', () => {
  const token = createToken();
  assert.ok(token.length >= 40);
  assert.equal(hashToken(token), hashToken(token));
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
