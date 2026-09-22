import assert from 'node:assert/strict';
import test from 'node:test';
import {hasPermission} from '../src/common/rbac';

test('RBAC role matrix grants only documented permissions', () => {
  const expected: Record<string, string[]> = {
    OWNER: ['customers:write', 'organization:manage', 'finance.write', 'expenses.pay', 'ai:write'],
    ADMIN: ['customers:delete', 'organization:manage', 'finance.write', 'documents:write'],
    MANAGER: ['customers:write', 'finance.write', 'expenses.approve', 'automation:write'],
    SALES: ['customers:write', 'quotes:send', 'invoices:send', 'products:read'],
    ACCOUNTANT: ['finance.write', 'expenses.pay', 'invoices:cancel', 'documents:write'],
    EMPLOYEE: ['customers:read', 'tasks:write', 'projects:read', 'notifications:read'],
    VIEWER: ['customers:read', 'finance.read', 'analytics:read', 'documents:read'],
  };

  for (const [role, permissions] of Object.entries(expected)) {
    for (const permission of permissions) {
      assert.equal(hasPermission(role, permission as Parameters<typeof hasPermission>[1]), true, `${role} should grant ${permission}`);
    }
  }
});

test('RBAC blocks documented privilege boundaries', () => {
  const denied: Array<[string, string]> = [
    ['MANAGER', 'organization:manage'],
    ['MANAGER', 'customers:delete'],
    ['SALES', 'finance.write'],
    ['SALES', 'invoices:cancel'],
    ['ACCOUNTANT', 'customers:delete'],
    ['EMPLOYEE', 'customers:write'],
    ['EMPLOYEE', 'finance.write'],
    ['VIEWER', 'customers:write'],
    ['VIEWER', 'documents:write'],
    ['VIEWER', 'ai:write'],
  ];

  for (const [role, permission] of denied) {
    assert.equal(hasPermission(role, permission as Parameters<typeof hasPermission>[1]), false, `${role} must not grant ${permission}`);
  }
});

test('unknown roles and permissions fail closed', () => {
  assert.equal(hasPermission('UNKNOWN', 'customers:read'), false);
  assert.equal(hasPermission('VIEWER', 'organization:manage'), false);
  assert.equal(hasPermission('VIEWER', 'not-a-permission' as never), false);
});
