import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { bgMagenta, bgWhite, blue, blueBright, greenBright, yellow } from 'colorette';

export function showRequestUrl(req: Request, _: Response, next: NextFunction): void {
    const timestamp = new Date().toLocaleString();
    console.log(bgWhite("\n" + "showRequestUrl: " + timestamp));
    if (!isEmpty(req.originalUrl)) console.log('Request URL:', `${blueBright(req.headers.host ?? 'host_not_found')}${blue(req.originalUrl)}`);
    if (!isEmpty(req.method)) console.log('Method:', yellow(req.method));
    if (!isEmpty(req.body)) console.log('Body:', greenBright(JSON.stringify(req.body, null, 2)));
    if (!isEmpty(req.params)) console.log('Params:', JSON.stringify(req.params, null, 2));
    if (!isEmpty(req.query)) console.log('Query:', JSON.stringify(req.query, null, 2));
    console.log(bgMagenta("\n"));
    next();
}