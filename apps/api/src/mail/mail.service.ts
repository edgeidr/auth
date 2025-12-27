import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { promises } from "fs";
import Handlebars from "handlebars";
import { createTransport, SendMailOptions, Transporter } from "nodemailer";
import { join } from "path";
import { RenderTemplateInput } from "./inputs/render-template.input";
import { SendEmailInput } from "./inputs/send-email.input";
import mailgunTransport, { Options } from "nodemailer-mailgun-transport";

@Injectable()
export class MailService implements OnModuleInit {
	private transporter: Transporter;

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		const mailgunAuth: Options = {
			auth: {
				apiKey: this.configService.get<string>("MAILGUN_API_KEY")!,
				domain: this.configService.get<string>("MAILGUN_DOMAIN")!,
			},
		};

		this.transporter = createTransport(mailgunTransport(mailgunAuth));

		await this.registerPartials();
	}

	async sendEmail(input: SendEmailInput) {
		const appName = this.configService.get<string>("APP_NAME");
		const senderEmail = this.configService.get<string>("MAILGUN_SENDER");
		const uniqueToken = Date.now();
		const context = { ...input.context, uniqueToken, appName };
		const mailSender = appName + " <" + senderEmail + ">";
		const html = await this.renderTemplate({
			template: input.template,
			context: context,
		});

		const options: SendMailOptions = {
			from: mailSender,
			to: input.recipients,
			subject: input.subject,
			html: html,
		};

		try {
			await this.transporter.sendMail(options);
		} catch (error) {
			console.log(error);
		}
	}

	private async renderTemplate(input: RenderTemplateInput): Promise<string> {
		const layoutPath = join(__dirname, "templates/layouts/main.hbs");
		const templatePath = join(__dirname, "templates", `${input.template}.hbs`);
		const globalStylePath = join(__dirname, "templates/styles/global.css.hbs");
		const pageStylePath = join(__dirname, "templates/styles/", `${input.template}.css.hbs`);

		const layoutSource = await promises.readFile(layoutPath, "utf8");
		const templateSource = await promises.readFile(templatePath, "utf8");

		const globalStyles = await this.readIfExists(globalStylePath);
		const pageStyles = await this.readIfExists(pageStylePath);
		const combinedStyles = `${globalStyles}\n${pageStyles}`.trim();

		const body = Handlebars.compile(templateSource)(input.context);
		const compiledLayout = Handlebars.compile(layoutSource);

		return compiledLayout({
			...input.context,
			body,
			styles: combinedStyles,
		});
	}

	private async registerPartials() {
		const partialsDir = join(__dirname, "templates", "partials");
		const files = await promises.readdir(partialsDir);

		await Promise.all(
			files.map(async (file) => {
				const filePath = join(partialsDir, file);
				const fileName = file.replace(".hbs", "");
				const fileContent = await promises.readFile(filePath, "utf8");

				Handlebars.registerPartial(fileName, fileContent);
			}),
		);
	}

	private async readIfExists(path: string): Promise<string> {
		try {
			return await promises.readFile(path, "utf8");
		} catch (error) {
			console.log(error);
			return "";
		}
	}
}
