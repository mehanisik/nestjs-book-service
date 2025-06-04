import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { GlobalConfig } from "./config/config.type";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("api");
	const configService = app.get(ConfigService<GlobalConfig>);
	await app.listen(configService.getOrThrow("app.port", { infer: true }));
}
bootstrap();
