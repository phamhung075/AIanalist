import Table from 'cli-table3';
import { blue, cyan, gray, green, magenta, red, white } from 'colorette';
import express from 'express';

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

    private getHandlerName(route: any): string {
        try {
            const lastHandler = route.stack[route.stack.length - 1];
            if (!lastHandler) return '<anonymous>';

            // Check for async handler
            if (lastHandler.handle?.original) {
                const fnStr = lastHandler.handle.original.toString();
                const match = fnStr.match(/await\s+(\w+)\.(\w+)\(/);
                if (match) return `${match[1]}.${match[2]}`;
            }

            // Get name from the handler
            const handler = lastHandler.handle || lastHandler;
            if (handler.name && handler.name !== 'handle') {
                return handler.name;
            }

            // Try to extract controller method name
            const fnStr = handler.toString();
            const controllerMatch = fnStr.match(/await\s+(\w+)\.(\w+)\(/);
            if (controllerMatch) {
                return `${controllerMatch[1]}.${controllerMatch[2]}`;
            }

            return '<anonymous>';
        } catch (error) {
            return '<anonymous>';
        }
    }

    private getSourcePath(route: any): string {
        return route.__source || 
               route.stack?.[0]?.handle?.__source || 
               route.stack?.[0]?.handle?.original?.__source || 
               'unknown';
    }

    private parseRoutes(layer: any, basePath: string = ''): void {
        if (layer.route) {
            // This is a route definition
            const route = layer.route;
            const methods = Object.keys(route.methods);
            
            methods.forEach(method => {
                this.routes.push({
                    method: method.toUpperCase(),
                    path: (basePath + route.path) || '/',
                    handler: this.getHandlerName(route),
                    sourcePath: this.getSourcePath(route)
                });
            });
        } else if (layer.name === 'router') {
            // This is a nested router
            const prefix = layer.regexp?.source
                ?.replace('\\/?(?=\\/|$)', '')
                ?.replace(/\\\//g, '/')
                ?.replace(/^\^/, '')
                ?.replace(/\$/, '') || '';
                
            // Parse nested routes
            layer.handle.stack.forEach((nestedLayer: any) => {
                this.parseRoutes(nestedLayer, prefix);
            });
        }
    }

    public displayRoutes(): void {
        // Parse all routes
        this.app._router.stack.forEach((layer:any) => this.parseRoutes(layer));

        if (this.routes.length === 0) {
            console.log('\nNo routes found. Make sure routes are properly mounted on the Express app.');
            return;
        }

        // Sort routes by path and method
        this.routes.sort((a, b) => {
            const pathCompare = a.path.localeCompare(b.path);
            if (pathCompare !== 0) return pathCompare;
            return a.method.localeCompare(b.method);
        });

        const table = new Table({
            head: ['Method', 'Path', 'Handler', 'Source'].map(h => white(h)),
            style: {
                head: [],
                border: []
            }
        });

        this.routes.forEach(route => {
            table.push([
                this.formatMethod(route.method),
                route.path,
                cyan(route.handler),
                gray(route.sourcePath)
            ]);
        });

        console.log('\nAPI Routes:');
        console.log(table.toString());
        console.log(`\nTotal routes: ${this.routes.length}\n`);
    }
}