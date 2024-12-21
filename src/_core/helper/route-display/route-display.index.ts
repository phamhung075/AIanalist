import express from 'express';
import Table from 'cli-table3';
import { green, blue, magenta, red, yellow, cyan, gray, white } from 'colorette';

export class RouteDisplay {
    private app: express.Express;
    private routes: Array<{
        method: string;
        path: string;
        handler: string;
        module?: string;
    }> = [];

    constructor(app: express.Express) {
        this.app = app;
    }

    private formatMethod(method: string): string {
        const colors: { [key: string]: (text: string) => string } = {
            'GET': green,
            'POST': blue,
            'PUT': magenta,
            'DELETE': red,
            'PATCH': yellow,
            'OPTIONS': cyan,
            'HEAD': gray
        };

        return colors[method] ? colors[method](method) : method;
    }

    private extractRoutes() {
        const stack = this.app._router?.stack || [];
        
        stack.forEach((middleware: any) => {
            if (middleware.route) { // routes registered directly on the app
                const path = middleware.route.path;
                const methods = Object.keys(middleware.route.methods)
                    .filter(method => middleware.route.methods[method]);
                
                methods.forEach(method => {
                    this.routes.push({
                        method: method.toUpperCase(),
                        path,
                        handler: middleware.route.stack[0].name || 'anonymous',
                    });
                });
            } else if (middleware.name === 'router') { // router middleware
                middleware.handle.stack.forEach((handler: any) => {
                    if (handler.route) {
                        const path = handler.route.path;
                        const methods = Object.keys(handler.route.methods)
                            .filter(method => handler.route.methods[method]);
                        
                        methods.forEach(method => {
                            this.routes.push({
                                method: method.toUpperCase(),
                                path: path,
                                handler: handler.route.stack[0].name || 'anonymous',
                                module: this.getModuleName(handler)
                            });
                        });
                    }
                });
            }
        });
    }

    private getModuleName(handler: any): string {
        // Try to extract module name from the route path or handler
        const routePath = handler.route?.path || '';
        const match = routePath.match(/^\/api_v1\/([^\/]+)/);
        return match ? match[1] : 'unknown';
    }

    public displayRoutes(): void {
        this.extractRoutes();

        const table = new Table({
            head: ['Method', 'Path', 'Handler', 'Module'].map(h => white(h)),
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
                    gray(route.module || '')
                ]);
            });

        console.log('\nAPI Routes:');
        console.log(table.toString());
        console.log(`\nTotal routes: ${this.routes.length}`);
    }
}