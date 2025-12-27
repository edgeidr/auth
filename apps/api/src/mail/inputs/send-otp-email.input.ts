import { SendEmailInput } from "./send-email.input";

export interface SendOtpEmailInput {
	subject: SendEmailInput["subject"];
	recipients: SendEmailInput["recipients"];
	code: string;
}
