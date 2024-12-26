

export const API_CONFIG = {
    VERSION: '1.0.0',
    PREFIX: '/api/v1',
    TIMEOUT: 30000, // 30 seconds
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100 // limit each IP to 100 requests per windowMs
    },
    CORS: {
        ORIGINS: ['http://localhost:3000'],
        METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization'],
        MAX_AGE: 86400 // 24 hours
    },
    COMPRESSION: {
        LEVEL: 6,
        THRESHOLD: 1024 // bytes
    },
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_LIMIT: 10,
        MAX_LIMIT: 100
    },
    CACHE: {
        TTL: 60 * 60, // 1 hour in seconds
        MAX: 1000 // maximum number of items in cache
    },
    SECURITY: {
        JWT: {
            ACCESS_TOKEN_EXPIRE: '1h',
            REFRESH_TOKEN_EXPIRE: '7d',
            ALGORITHM: 'HS256'
        },
        PASSWORD: {
            SALT_ROUNDS: 10,
            MIN_LENGTH: 8
        }
    },
    LOGS: {
        DIR: 'logs',
        MAX_SIZE: '10m',
        MAX_FILES: '7d'
    }
};



/*
OPTIONS and HEAD methods are actually part of the HTTP specification but not typically used in RESTful API route definitions. They are handled automatically by most web servers and frameworks for:

OPTIONS: Used for CORS preflight requests
HEAD: Automatically handled version of GET that returns only headers

So in your RESTful API route definitions, you should only use:

GET: For retrieving resources
POST: For creating new resources
PUT: For complete update/replacement of a resource
PATCH: For partial update of a resource
DELETE: For removing resources
*/
export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'	
} as const;

export const CONTENT_TYPE = {
    JSON: 'application/json',
    FORM: 'application/x-www-form-urlencoded',
    MULTIPART: 'multipart/form-data',
    TEXT: 'text/plain',
    HTML: 'text/html',
    XML: 'application/xml',
    PDF: 'application/pdf'
} as const;

export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const;
