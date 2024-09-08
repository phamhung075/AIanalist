// import { Request, Response, NextFunction } from 'express';

// const mainMode = configService.getEnvProperty('supa.url') as string
// const supaUrl = mainMode != 'dev' ? configService.getEnvProperty('parse.url') as string : configService.getEnvProperty('dev.url') as string
// const supaKey = configService.getEnvProperty('supa.anon')

// const supabase: SupabaseClient = createClient(
//     supaUrl,
//     supaKey
// );

// export const supabaseAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     res;
//     const token = req.headers.authorization?.split(' ')[1];
//     if (token) {
//         try {
//             const { data: { user }, error } = await supabase.auth.getUser(token);
//             if (error) throw error;

//             if (user) {
//                 // Attacher l'utilisateur à la requête pour une utilisation ultérieure
//                 (req as any).user = user;

//                 // Créer et attacher un nouveau client Supabase configuré avec le token de l'utilisateur
//                 (req as any).supabaseClient = createClient(
//                     supaUrl,
//                     supaKey,
//                     {
//                         global: {
//                             headers: {
//                                 Authorization: `Bearer ${token}`
//                             }
//                         }
//                     }
//                 );
//             }
//         } catch (error) {
//             console.error('Error authenticating token:', error);
//             // Ne pas envoyer d'erreur, juste continuer sans authentification
//         }
//     }

//     next();
// };