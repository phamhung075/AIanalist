// import { FireBaseUtilsService } from './../../../utils/firebase-utils.service';
import { EnumErrors } from '../../../enums/Error';
import { ExtendedUserContextRequest } from "./user-context.interface";

// const fireBaseUtilsService = new FireBaseUtilsService();

class UserContextMiddleware {
    static async loadUserContext(req: ExtendedUserContextRequest): Promise<void> {
        if (!req.headers.authorization) {
            // Pas de token, on ne charge pas de contexte utilisateur
			console.log('token not configured');
            // return;
        }

        // const token = req.headers.authorization.split(' ')[1];

        try {
            
            // const { data: user, error } = await fireBaseUtilsService.getClient(true).auth.getUser(token);
            // if (error || !user) {
            //     throw new Error(EnumErrors.INVALID_TOKEN);
            // }

            // const { data: contact, error: contactError } = await fireBaseUtilsService.getClient(true)
            //     .from('Contact')
            //     .select('*')
            //     .eq('email', user.user.email)
            //     .single();

            // if (contactError || !contact) {
            //     throw new Error(EnumErrors.ERROR_UNKNOWN);
            // }

            // req.userContext = {
            //     user: user.user,
            //     contactDetails: contact,
            // };

            // console.log("User context loaded with contact details.");
			console.log("User context not configured yet.");

        } catch (error) {
            console.error("Failed to load user context:", error);
            throw error;
        }
    }

    // Affichage du contexte utilisateur pour débogage
    static consoleDisplayUserContext = async (req: ExtendedUserContextRequest): Promise<void> => {
        if (req.userContext) {
            console.log("User context loaded successfully.");
        } else {
            console.error("User context not loaded.");
            throw new Error(EnumErrors.ERROR_UNKNOWN);
        }
    };
}

export function withUserContextAndPermissions(originalFunction: (req: ExtendedUserContextRequest) => Promise<any | EnumErrors>) {
    return async (req: ExtendedUserContextRequest, res: any) => {
        try {
            await UserContextMiddleware.loadUserContext(req);

            // if (req.headers.authorization && !req.userContext) {
            //     console.error("Middleware cannot read contact user, user not valid or deleted");
            //     throw new Error(EnumErrors.ERROR_UNKNOWN);
            // }

            const result = await originalFunction(req);
            res.json({ result });  // Utilisation du format de réponse unifié
        } catch (error: any) {
            throw error;
        }
    };
}
