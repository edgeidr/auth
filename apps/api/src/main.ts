import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import cookieParser from "cookie-parser";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);
	const host = configService.get<string>("API_HOST")!;
	const port = configService.get<number>("API_PORT")!;
	const corsAllowedOriginRaw = configService.get<string>("CORS_ALLOWED_ORIGIN", "");
	const corsAllowedOrigin = corsAllowedOriginRaw.split(",").map((origin) => origin.trim());

	app.use(cookieParser());
	app.enableCors({
		origin: corsAllowedOrigin,
		credentials: true,
	});
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new BadRequestException(
					validationErrors.map((error) => ({
						field: error.property,
						error: error.constraints ? Object.values(error.constraints) : "",
					})),
				);
			},
		}),
	);

	await app.listen(port, host);
}

void bootstrap();
