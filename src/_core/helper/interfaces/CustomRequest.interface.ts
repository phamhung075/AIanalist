import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

// Interface pour représenter les détails de l'utilisateur if not use firebase
// export interface UserContext {
//     contactDetails?: any; // Représente les détails du contact récupérés depuis Supabase
//     user?: any;
// }

// Étendre la requête Express pour inclure le contexte utilisateur
export interface ExtendedUserContextRequest extends Request {
    user?: DecodedIdToken;
}

// Étendre la requête pour inclure les paramètres supplémentaires
// Default case if no type is specified
type FallbackBody = { [key: string]: any };

// Generic CustomRequest Interface
export interface CustomRequest<T = FallbackBody> extends ExtendedUserContextRequest {
    startTime?: number;
    timestamp?: string;
    path: string;
    body: T;
}

