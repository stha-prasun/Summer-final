import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./admin.service.js', () => ({
  getDashboardStats: vi.fn(),
  adminGetAllOrders: vi.fn(),
  adminGetOrderById: vi.fn(),
  adminUpdateOrderStatus: vi.fn(),
}));

import {
  getDashboardStats,
  adminGetAllOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
} from './admin.controller.js';
import * as adminService from './admin.service.js';
import { makeRes } from '../../test/helpers.js';

describe('admin.controller getDashboardStats', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('responds 200 with stats on success', async () => {
    adminService.getDashboardStats.mockResolvedValue({ totalProducts: 5 });
    const res = makeRes();

    await getDashboardStats({}, res);

    expect(res._status).toBe(200);
    expect(res._body).toEqual({ success: true, stats: { totalProducts: 5 } });
  });

  it('responds 500 when the service throws', async () => {
    adminService.getDashboardStats.mockRejectedValue(new Error('boom'));
    const res = makeRes();

    await getDashboardStats({}, res);

    expect(res._status).toBe(500);
    expect(res._body.success).toBe(false);
  });
});

describe('admin.controller adminGetAllOrders', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('responds 200 with paginated orders', async () => {
    adminService.adminGetAllOrders.mockResolvedValue({
      orders: [{ id: 'o1' }],
      total: 1,
      page: 1,
      totalPages: 1,
    });
    const req = { query: { page: '2', limit: '5' } };
    const res = makeRes();

    await adminGetAllOrders(req, res);

    expect(adminService.adminGetAllOrders).toHaveBeenCalledWith({
      status: undefined,
      search: undefined,
      page: 2,
      limit: 5,
    });
    expect(res._status).toBe(200);
    expect(res._body).toEqual({ success: true, orders: [{ id: 'o1' }], total: 1, page: 1, totalPages: 1 });
  });

  it('responds 500 when the service throws', async () => {
    adminService.adminGetAllOrders.mockRejectedValue(new Error('boom'));
    const res = makeRes();

    await adminGetAllOrders({ query: {} }, res);

    expect(res._status).toBe(500);
    expect(res._body.success).toBe(false);
  });
});

describe('admin.controller adminGetOrderById', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('responds 200 with the order', async () => {
    adminService.adminGetOrderById.mockResolvedValue({ id: 'o1' });
    const res = makeRes();

    await adminGetOrderById({ params: { id: 'o1' } }, res);

    expect(adminService.adminGetOrderById).toHaveBeenCalledWith('o1');
    expect(res._status).toBe(200);
    expect(res._body).toEqual({ success: true, order: { id: 'o1' } });
  });

  it('responds 404 when the order is not found', async () => {
    adminService.adminGetOrderById.mockResolvedValue(null);
    const res = makeRes();

    await adminGetOrderById({ params: { id: 'nope' } }, res);

    expect(res._status).toBe(404);
    expect(res._body.message).toBe('Order not found.');
  });
});

describe('admin.controller adminUpdateOrderStatus', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('responds 400 for an invalid status', async () => {
    const res = makeRes();

    await adminUpdateOrderStatus({ params: { id: 'o1' }, body: { status: 'weird' } }, res);

    expect(adminService.adminUpdateOrderStatus).not.toHaveBeenCalled();
    expect(res._status).toBe(400);
    expect(res._body.message).toMatch(/Invalid status/);
  });

  it('responds 200 on success', async () => {
    adminService.adminUpdateOrderStatus.mockResolvedValue({ id: 'o1', status: 'paid' });
    const res = makeRes();

    await adminUpdateOrderStatus({ params: { id: 'o1' }, body: { status: 'paid' } }, res);

    expect(adminService.adminUpdateOrderStatus).toHaveBeenCalledWith('o1', 'paid');
    expect(res._status).toBe(200);
    expect(res._body.order.status).toBe('paid');
  });

  it('responds 404 when the order is not found', async () => {
    adminService.adminUpdateOrderStatus.mockResolvedValue(null);
    const res = makeRes();

    await adminUpdateOrderStatus({ params: { id: 'nope' }, body: { status: 'paid' } }, res);

    expect(res._status).toBe(404);
  });
});
