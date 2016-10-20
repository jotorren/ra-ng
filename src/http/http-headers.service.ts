import { Headers, Request } from '@angular/http';

const AUTHORIZATION_BASIC_PREFIX = 'Basic';

/**
 * Returns the value of a specified header field from a request
 *
 * @param req
 * @param field The name of the field to return
 * @returns {string} The value of the header field
 */
export function getHeaderValue(req: Request, field: string): string {
  if (req && field && req.headers.hasOwnProperty(field)) {
    return req.headers[field];
  } else {
    return '';
  }
}

/**
 * Returns a basic authentication header value with the given credentials
 *
 * @param client_id
 * @param client_secret
 * @returns {string}
 */
export function getBasicAuthHeaderValue(clientId: string, clientSecret: string): string {
  return AUTHORIZATION_BASIC_PREFIX + ' ' + btoa(clientId + ':' + clientSecret);
}

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
