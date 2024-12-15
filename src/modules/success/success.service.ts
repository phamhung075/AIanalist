import { _SUCCESS } from "../../_core/helper/async-handler/success/success.response";
import { SuccessTestBodyRequest } from "./success-controller.service";




export class SuccessTestService {

	async OKResponse(body: SuccessTestBodyRequest): Promise<string> {
		return "this is a test OKResponse" + (body.message);
	}

	// 201 Created
	async CreatedResponse(body: SuccessTestBodyRequest): Promise<string> {
		return "this is a test CreatedResponse: " + (body.message);
	}

	// 202 Accepted
	async AcceptedResponse(body: SuccessTestBodyRequest): Promise<string> {
		return "this is a test AcceptedResponse: " + (body.message);
	}

	// 203 Non-Authoritative Information
	async NonAuthoritativeInformationResponse(body: SuccessTestBodyRequest): Promise<string> {
		return "this is a test NonAuthoritativeInformationResponse: " + (body.message);
	}

	// 204 No Content
	async NoContentResponse(): Promise<string> {
		return "this is a test NoContentResponse: No content to return.";
	}

	// 205 Reset Content
	async ResetContentResponse(): Promise<string> {
		return "this is a test ResetContentResponse: Content has been reset.";
	}

	// 206 Partial Content
	async PartialContentResponse(body: SuccessTestBodyRequest): Promise<string> {
		return "this is a test PartialContentResponse: " + (body.message);
	}

	// 207 Multi-Status
	async MultiStatusResponse(): Promise<string> {
		return "this is a test MultiStatusResponse: Multiple statuses returned.";
	}

	// 208 Already Reported
	async AlreadyReportedResponse(): Promise<string> {
		return "this is a test AlreadyReportedResponse: This has already been reported.";
	}

	// 226 IM Used
	async IMUsedResponse(body: SuccessTestBodyRequest): Promise<string> {
		return "this is a test IMUsedResponse: " + (body.message);
	}

}