import cookie from 'react-cookies';
import { NavigateFunction } from 'react-router-dom';

function isInvalidTokenBody(data: unknown): boolean {
    if (!data || typeof data !== 'object')
        return false;

    const body = data as { token?: unknown; message?: unknown; status?: unknown };
    if (body.token === 'denied')
        return true;

    return body.message === 'token' && body.status === 'invalid';
}

export function redirectIfInvalidToken(error: unknown, navigate: NavigateFunction): boolean {
    const data = (error as { response?: { data?: unknown } })?.response?.data;
    if (!isInvalidTokenBody(data))
        return false;

    cookie.remove('authToken', { path: '/' });
    navigate('/', { replace: true });
    return true;
}
