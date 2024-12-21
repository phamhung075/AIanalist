import Table from 'cli-table3';
import { blue, cyan, gray, green, magenta, red, white, yellow } from 'colorette';
import express from 'express';
import path from 'path';

interface RouteInfo {
    method: string;
    path: string;
    handler: string;
    module?: string;
    path_folder?: string;
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
            'PATCH': yellow,
            'OPTIONS': cyan,
            'HEAD': gray
        };

        return colors[method]?.(method) || method;
    }

    private getSourceFile(handler: any): string {
        try {
            // Get the handler function
            const fn = handler.handle || handler;
            
            // // Log the handler for debugging
            // console.log("Handler details:", {
            //     handle: fn?.handle?.toString(),
            //     source: fn?.__source,
            //     name: fn?.name,
            //     bound: fn?.bound,
            //     original: fn?.original
            // });
    
            // Check for source from our wrapper
            if (fn?.__source) {
                return fn.__source;
            }
    
            // Check if it's an async handler wrapper
            if (fn?.original?.__source) {
                return fn.original.__source;
            }
    
            // Try to get the actual function if it's bound
            if (fn?.bound && typeof fn.bound === 'function') {
                const boundFn = fn.bound;
                if (boundFn.__source) {
                    return boundFn.__source;
                }
            }
    
            // Check for router source
            if (handler.route?.__source) {
                return handler.route.__source;
            }
    
            // If we're dealing with an async handler
            if (fn?.name === 'asyncHandlerFn' && fn?.original) {
                return this.getSourceFile(fn.original);
            }
    
            // Try to get from the route layer
            if (handler.route?.stack?.[0]?.handle?.__source) {
                return handler.route.stack[0].handle.__source;
            }
    
            return 'unknown';
        } catch (error) {
            console.error('Error getting source file:', error);
            return 'unknown';
        }
    }




    private getModuleName(handler: any): string {
        const routePath = handler.route?.path || '';
        const match = routePath.match(/^\/api_v1\/([^\/]+)/);
        return match?.[1] || 'unknown';
    }

    private formatVSCodeLink(sourcePath: string | undefined): string {
        if (!sourcePath || sourcePath === 'unknown') {
            return gray('unknown');
        }
        
        const absolutePath = path.resolve(process.cwd(), sourcePath);
        const vscodePath = `vscode://file/${absolutePath.replace(/\\/g, '/')}`;
        return cyan(vscodePath);
    }

    private extractRoutes(): void {
        const stack = this.app._router?.stack || [];
        
        stack.forEach((middleware: any) => {
            if (middleware.route) {
                this.processDirectRoute(middleware);
            } else if (middleware.name === 'router') {
                this.processRouterMiddleware(middleware);
            }
        });
    }

    private processDirectRoute(middleware: any): void {
        const routePath = middleware.route.path;
        console.log ("find sourceFile from:"+ routePath)
        const sourceFile = this.getSourceFile(middleware.route.stack[0]);
        const handler = middleware.route.stack[0];

        Object.keys(middleware.route.methods)
            .filter(method => middleware.route.methods[method])
            .forEach(method => {
                this.routes.push({
                    method: method.toUpperCase(),
                    path: routePath,
                    handler: handler.name || 'anonymous',
                    path_folder: sourceFile
                });
            });
    }
    

    public displayRoutes(): void {
        this.extractRoutes();

        const table = new Table({
            head: ['Method', 'Path', 'Handler', 'Module', 'Source'].map(h => white(h)),
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
                    gray(route.module || ''),
                    this.formatVSCodeLink(route.path_folder)
                ]);
            });

        console.log('\nAPI Routes:');
        console.log(table.toString());
        console.log(`\nTotal routes: ${this.routes.length}`);
    }

    private getHandlerName(handler: any): string {
        try {
            // If it's an async handler wrapper
            if (handler.name === 'asyncHandlerFn' && handler.original) {
                return this.getHandlerName(handler.original);
            }

            // If it's a bound function
            if (handler.name.startsWith('bound ')) {
                const boundFunctionName = handler.name.replace('bound ', '');
                return boundFunctionName;
            }

            // Try to get original function name from the bound function
            const fnString = handler.toString();
            const matches = fnString.match(/return\s+(\w+)\.([A-Za-z]+)\s*\(/);
            if (matches && matches[2]) {
                return matches[2];
            }

            // If we can't find a better name, use the raw function name
            return handler.name || 'anonymous';
        } catch (error) {
            console.error('Error getting handler name:', error);
            return 'anonymous';
        }
    }

    private processRouterMiddleware(middleware: any): void {
        middleware.handle.stack.forEach((handler: any) => {
            if (handler.route) {
                const routePath = handler.route.path;
                const sourceFile = this.getSourceFile(handler.route.stack[0]);
                const routeHandler = handler.route.stack[0];

                // Get the actual function handler
                const fn = routeHandler.handle || routeHandler;
                const handlerName = this.getHandlerName(fn);

                Object.keys(handler.route.methods)
                    .filter(method => handler.route.methods[method])
                    .forEach(method => {
                        this.routes.push({
                            method: method.toUpperCase(),
                            path: routePath,
                            handler: handlerName,
                            module: this.getModuleName(handler),
                            path_folder: sourceFile
                        });
                    });
            }
        });
    }
}