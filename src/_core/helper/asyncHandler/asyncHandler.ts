import { NextFunction, Request, Response } from 'express';
import { ExtendedFunctionRequest, UserContext } from '../../guard/handle-permission/user-context.interface';
import { AsyncLocalStorage } from 'async_hooks';
import { EnumErrors } from '../../../enums/Error';



// Création d'un AsyncLocalStorage pour stocker le contexte de la requête
const asyncLocalStorage = new AsyncLocalStorage<{ token: string | undefined, userContext: UserContext | undefined }>();

export const asyncHandlerFn = (fn: (req: ExtendedFunctionRequest, res: Response, next: NextFunction) => Promise<any>) => {
	// const fireBaseUtilsService = new FireBaseUtilsService();
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        return asyncLocalStorage.run({ token: undefined, userContext: undefined }, async () => {
            try {
                // Transformation de la requête
                const extendedReq = req as ExtendedFunctionRequest;
				extendedReq.body = req.body;
                extendedReq.userContext = {} as UserContext;

                // const token = req.headers.authorization?.split(' ')[1];
                
                // if (token) {
                //     try {
                //         // Récupérer l'utilisateur à partir du token
                //         const { data: { user }, error } = await fireBaseUtilsService.getClient(true).auth.getUser(token);
                //         if (error) {
                //             console.log('Error getting user with token:', error)
                //             throw new Error(EnumErrors.INVALID_TOKEN);
                //         }
                //         if (user) {
                //             extendedReq.userContext.user = user;

                //             // Récupérer le profil de l'utilisateur
                //             const { data: profile, error: profileError } = await fireBaseUtilsService.getClient(true)
                //                 .from('Profiles')
                //                 .select('*')
                //                 .eq('objectId', user.id)
                //                 .single();

                //             if (profileError) {
                //                 console.log('Error getting profile:', profileError)
                //                 throw new Error(EnumErrors.ERROR_UNKNOWN);
                //             }
                //             if (profile) {
                //                 // Récupérer les détails du contact
                //                 const { data: contact, error: contactError } = await fireBaseUtilsService.getClient(true)
                //                     .from('Contact')
                //                     .select('*')
                //                     .eq('objectId', profile.contactId)
                //                     .single();

                //                 if (contactError) {
                //                     console.log('Error getting contact details:', contactError)
                //                     throw new Error(EnumErrors.ERROR_UNKNOWN);
                //                 }
                //                 if (contact) {
                //                     extendedReq.userContext.contactDetails = contact;
                //                 }
                //             }

                //             // Stocker le token et le contexte utilisateur
                //             asyncLocalStorage.getStore()!.token = token;
                //             asyncLocalStorage.getStore()!.userContext = extendedReq.userContext;
                //         }

                //     } catch (error) {
                //         console.error('Error verifying token or fetching user data:', error);
                //         throw new Error(EnumErrors.INVALID_TOKEN);
                //     }
                // }

                // Exécution de la fonction de route
                const result = await fn(extendedReq, res, next);

                // Envoi de la réponse si elle n'a pas déjà été envoyée
                if (!res.headersSent) {
                    res.json({ result });
                }
            } catch (error: any) {
                console.error('Caught error:', error);
                if (!res.headersSent) {
                    switch (error.message) {
                        case EnumErrors.NO_USER_LOGGED:
                            res.status(401).json({ error: EnumErrors.NO_USER_LOGGED });
                            break;
                        case EnumErrors.INVALID_TOKEN:
                            res.status(403).json({ error: EnumErrors.INVALID_TOKEN });
                            break;
                        case EnumErrors.ERROR_UNKNOWN:
                            res.status(500).json({ error: EnumErrors.ERROR_UNKNOWN });
                            break;
                        default:
                            res.status(500).json({ error: EnumErrors.ERROR_UNKNOWN });
                    }
                }
                next(error);
            }
        });
    };
};

// Fonction utilitaire pour récupérer le token stocké
export function getStoredToken(): string | undefined {
    return asyncLocalStorage.getStore()?.token;
}

// Fonction utilitaire pour récupérer le contexte utilisateur stocké
export function getStoredUserContext(): UserContext | undefined {
    return asyncLocalStorage.getStore()?.userContext;
}