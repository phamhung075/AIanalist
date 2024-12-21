
import { UserInput } from "@/_core/helper/validation/user/user.validation";
import _ERROR from "../../_core/helper/async-handler/error/error.response";




export class ErrorTestService {

    async BadRequestError(data: UserInput): Promise<never> {
        console.log(data)
        // If we get here, validation passed
        throw new _ERROR.BadRequestError({
            message: 'This is a test error',
        });
    }



}




