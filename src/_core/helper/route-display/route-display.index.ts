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
    status?: string;
    statusCode?: number;
    responseType?: string;
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
            head: ['Method', 'Status', 'Path', 'Handler', 'Response Type', 'Module', 'Source'].map(h => white(h)),
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
                    this.formatStatus(route.status || 'unknown'),
                    route.path,
                    cyan(route.handler),
                    yellow(route.responseType || ''),
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

    private getHandlerResponseInfo(fn: any): { status: string; responseType: string } {
        try {
            // Convert function to string to analyze its content
            const fnString = fn.toString();
            
            // Look for new _SUCCESS patterns
            const successMatch = fnString.match(/new\s+_SUCCESS\.(\w+)/);
            if (successMatch) {
                const responseType = successMatch[1];
                const status = this.getStatusFromResponseType(responseType);
                return { status, responseType };
            }

            // Look for status codes in res.status() calls
            const statusMatch = fnString.match(/res\.status\((\d+)\)/);
            if (statusMatch) {
                const status = statusMatch[1];
                return { 
                    status: `${status} ${this.getStatusText(parseInt(status))}`,
                    responseType: 'Custom'
                };
            }

            return { status: 'unknown', responseType: 'unknown' };
        } catch (error) {
            return { status: 'unknown', responseType: 'unknown' };
        }
    }

    private getStatusFromResponseType(responseType: string): string {
        const statusMap: Record<string, string> = {
            'OKResponse': '200 OK',
            'CreatedResponse': '201 Created',
            'AcceptedResponse': '202 Accepted',
            'NonAuthoritativeInformationResponse': '203 Non-Authoritative',
            'NoContentResponse': '204 No Content',
            'ResetContentResponse': '205 Reset Content',
            'PartialContentResponse': '206 Partial Content',
            'MultiStatusResponse': '207 Multi-Status',
            'AlreadyReportedResponse': '208 Already Reported',
            'IMUsedResponse': '226 IM Used'
        };

        return statusMap[responseType] || `${responseType.match(/\d+/)?.[0] || 'unknown'}`;
    }

    private getStatusText(code: number): string {
        const texts: Record<number, string> = {
            200: 'OK',
            201: 'Created',
            202: 'Accepted',
            203: 'Non-Authoritative Information',
            204: 'No Content',
            205: 'Reset Content',
            206: 'Partial Content',
            207: 'Multi-Status',
            208: 'Already Reported',
            226: 'IM Used'
        };
        return texts[code] || 'Unknown';
    }

    private formatStatus(status: string): string {
        if (status.startsWith('2')) return green(status);
        if (status.startsWith('4')) return yellow(status);
        if (status.startsWith('5')) return red(status);
        return gray(status);
    }

    private processRouterMiddleware(middleware: any): void {
        middleware.handle.stack.forEach((handler: any) => {
            if (handler.route) {
                const routePath = handler.route.path;
                const routeHandler = handler.route.stack[0];
                const fn = routeHandler.handle || routeHandler;
                
                // Get additional info about the handler
                const { status, responseType } = this.getHandlerResponseInfo(fn);

                Object.keys(handler.route.methods)
                    .filter(method => handler.route.methods[method])
                    .forEach(method => {
                        this.routes.push({
                            method: method.toUpperCase(),
                            path: routePath,
                            handler: this.getHandlerName(fn),
                            module: this.getModuleName(handler),
                            path_folder: this.getSourceFile(routeHandler),
                            status,
                            responseType
                        });
                    });
            }
        });
    }
}