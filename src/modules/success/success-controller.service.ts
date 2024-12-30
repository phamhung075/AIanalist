import { ExtendedUserContextRequest } from "@src/_core/guard/handle-permission/CustomRequest.interface";
import _ERROR from "../../_core/helper/async-handler/error";
import { _SUCCESS } from "../../_core/helper/async-handler/success";
import { SuccessTestService } from "./success.service";
import { NextFunction, Response } from 'express';
export interface SuccessTestBodyRequest {
	message: string;
}

export class SuccessTestCloudService {

	constructor(
		private readonly successTestService: SuccessTestService
	) { }

	controller = (body: SuccessTestBodyRequest): SuccessTestBodyRequest => {
		if (!body.message) {
			throw new _ERROR.BadRequestError("The request body is missing a required property: 'message'");
		} else {
			return body;
		}
	}

	// 200 
	OKResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;

		const data = await this.successTestService.OKResponse(this.controller(body));
		new _SUCCESS.CreatedResponse({
			message: 'Registered OK!',
			metadata: data,
			options: {
				limit: 10
			}
		}).send(res);
	}

	// 201 Created
	CreatedResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.CreatedResponse(this.controller(body));
		new _SUCCESS.CreatedResponse({
			message: 'Resource Created Successfully!',
			metadata: data,
			options: {
				limit: 10
			}
		}).send(res);
	}

	// 202 Accepted
	AcceptedResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.AcceptedResponse(this.controller(body));
		new _SUCCESS.AcceptedResponse({
			message: 'Request Accepted!',
			metadata: data,
			options: {
				processingTime: '5 minutes'
			}
		}).send(res);
	}

	// 203 Non-Authoritative Information
	NonAuthoritativeInformationResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.NonAuthoritativeInformationResponse(this.controller(body));
		new _SUCCESS.NonAuthoritativeInformationResponse({
			message: 'Non-authoritative information!',
			metadata: data,
			options: {
				source: 'Third-Party'
			}
		}).send(res);
	}

	// 204 No Content
	NoContentResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.PartialContentResponse(this.controller(body));
		new _SUCCESS.NoContentResponse({
			message: 'No Content!',
			metadata: data,
		}).send(res);
	}

	// 205 Reset Content
	ResetContentResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.PartialContentResponse(this.controller(body));
		new _SUCCESS.ResetContentResponse({
			message: 'Reset Content!',
			metadata: data,
		}).send(res);
	}

	// 206 Partial Content
	PartialContentResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.PartialContentResponse(this.controller(body));
		new _SUCCESS.PartialContentResponse({
			message: 'Partial Content!',
			metadata: data,
			options: {
				range: 'bytes 0-499/1234'
			}
		}).send(res);
	}

	// 207 Multi-Status
	MultiStatusResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const data = await this.successTestService.MultiStatusResponse();
		new _SUCCESS.MultiStatusResponse({
			message: 'Multi-Status Response!',
			metadata: data
		}).send(res);
	}

	// 208 Already Reported
	AlreadyReportedResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const data = await this.successTestService.AlreadyReportedResponse();
		new _SUCCESS.AlreadyReportedResponse({
			message: 'Already Reported!',
			metadata: data
		}).send(res);
	}

	// 226 IM Used
	IMUsedResponse = async (_req: ExtendedUserContextRequest, res: Response, _next: NextFunction): Promise<void> => {
		const body: SuccessTestBodyRequest = _req.body;
		const data = await this.successTestService.IMUsedResponse(this.controller(body));
		new _SUCCESS.IMUsedResponse({
			message: 'IM Used!',
			metadata: data,
			options: {
				'instance-manipulation': true
			}
		}).send(res);
	}

}
