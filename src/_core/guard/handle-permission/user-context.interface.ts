import { Request } from "express";

// Interface pour représenter les détails de l'utilisateur
export interface UserContext {
    contactDetails?: any; // Représente les détails du contact récupérés depuis Supabase
    user?: any;
}

// Étendre la requête Express pour inclure le contexte utilisateur
export interface ExtendedUserContextRequest extends Request {
    userContext?: UserContext;
}

// Étendre la requête pour inclure les paramètres supplémentaires
export interface ExtendedFunctionRequest extends ExtendedUserContextRequest {
    startTime?: number;
    timestamp?: string;
    path: string;
    body: {
        [key: string]: any; // Permet de stocker divers paramètres, tels que parseObj, objectId, etc.
    };
}
