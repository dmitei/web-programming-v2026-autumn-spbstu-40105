/* eslint-disable new-cap */
import createClient from 'openapi-fetch';
import {API_BASE_URL} from './config';
import type {components, paths} from './schema';

type ErrorBody = components['schemas']['Error'];

interface ApiResult<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const client = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  cache: 'no-store',
});

function extractMessage(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null) {
    const body = error as ErrorBody;
    return typeof body.message === 'string' && body.message
      ? body.message
      : undefined;
  }
  return undefined;
}

async function unwrap<T>(res: ApiResult<T>, schemaPath: string): Promise<T> {
  if (!res.response.ok) {
    if (res.response.status === 401 && schemaPath !== '/login') {
      window.dispatchEvent(new Event('session-expired'));
      throw new ApiError(401, 'Сессия истекла. Войдите в аккаунт снова.');
    }
    throw new ApiError(
      res.response.status,
      extractMessage(res.error) ?? res.response.statusText,
    );
  }
  if (res.data === undefined) {
    throw new ApiError(res.response.status, 'empty response body');
  }
  return res.data;
}

export async function getGoods() {
  return unwrap(await client.GET('/goods'), '/goods');
}

export async function login(username: string, password: string) {
  return unwrap(
    await client.POST('/login', {body: {username, password}}),
    '/login',
  );
}

export async function logout() {
  await client.POST('/logout', {});
}

export async function getOrders() {
  return unwrap(await client.GET('/orders'), '/orders');
}

export async function createOrder(
  body: components['schemas']['CreateOrderRequest'],
) {
  return unwrap(await client.POST('/orders', {body}), '/orders');
}
