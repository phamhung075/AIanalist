import Table from 'cli-table3';
import { blue, cyan, gray, green, magenta, red, white } from 'colorette';
import express from 'express';
import * as path from 'path';

interface RouteInfo {
    method: string;
    path: string;
    handler: string;
    sourcePath: string;
}

export class RouteDisplay {
    private app: express.Express;
    private routes: RouteInfo[] = [];

    constructor(app: express.Express) {
        this.app = app;
    }

    private formatMethod(method: string): string {
        const colors: Record<string, (text: string) => string> = {
            'GET': green,
            'POST': blue,
            'PUT': magenta,
            'DELETE': red,
            'PATCH': cyan
        };
        return colors[method]?.(method.toUpperCase()) || method;
    }

    private getBasePathFromRegex(regexp: RegExp): string {
        try {
            const regexStr = regexp.toString();
            const match = regexStr.match(/^\^\\\/([^\\\/\?]+)/);
            return match ? match[1] : '';
        } catch {
            return '';
        }
    }

    private getRoutePath(route: any, middleware: any): string {
        try {
            const basePath = this.getBasePathFromRegex(middleware.regexp);
            const routePath = route.path || '';
            return path.join(basePath, routePath).replace(/\\/g, '/');
        } catch (error) {
            console.error('Error getting route path:', error);
            return 'unknown';
        }
    }

    private getHandlerFromStack(stack: any[]): string {
        try {
            const lastHandler = stack[stack.length - 1];
            if (!lastHandler || !lastHandler.handle) return '<anonymous>';

            const fnStr = lastHandler.handle.toString();

            const patterns = [
                /\.(\w+)\(req,\s*res\)/, // matches methodName(req, res)
                /Controller\.(\w+)/, // matches anyController.methodName
                /function\s+(\w+)/, // matches named functions
                /\.(get|post|put|delete|patch)\(/ // matches HTTP method handlers
            ];

            for (const pattern of patterns) {
                const match = fnStr.match(pattern);
                if (match && match[1]) {
                    return match[1];
                }
            }

            if (lastHandler.handle.name && lastHandler.handle.name !== 'handle') {
                return lastHandler.handle.name;
            }

            return '<anonymous>';
        } catch (error) {
            console.error('Error getting handler name:', error);
            return '<anonymous>';
        }
    }

    private extractRoutes(): void {
        const stack = this.app._router?.stack || [];
        
        stack.forEach((middleware: any) => {
            if (middleware.name === 'router') {
                const routerStack = middleware.handle.stack || [];

                routerStack.forEach((layer: any) => {
                    if (layer.route) {
                        const route = layer.route;
                        const method = Object.keys(route.methods)[0].toUpperCase();
                        const sourceFromRoute = middleware.handle.__source;

                        this.routes.push({
                            method,
                            path: this.getRoutePath(route, middleware),
                            handler: this.getHandlerFromStack(route.stack),
                            sourcePath: sourceFromRoute || 'unknown'
                        });
                    }
                });
            }
        });
    }

    public displayRoutes(): void {
        this.extractRoutes();

        const table = new Table({
            head: ['Method', 'Path', 'Handler', 'Source'].map(h => white(h)),
            style: {
                head: [],
                border: []
            }
        });

        this.routes
            .sort((a, b) => a.path.localeCompare(b.path))
            .forEach(route => {
                table.push([
                    this.formatMethod(route.method),
                    route.path,
                    cyan(route.handler),
                    gray(route.sourcePath)
                ]);
            });

        console.log('\nAPI Routes:');
        console.log(table.toString());
        console.log(`\nTotal routes: ${this.routes.length}`);
    }
}