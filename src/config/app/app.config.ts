import { registerAs } from "@nestjs/config";
import { AppConfig } from "./app-config.type";

export function getAppConfig(): AppConfig {
	return {
		port: Number.parseInt(process.env.APP_PORT || "8000"),
		env: process.env.APP_NODE_ENV || "local",
		name: process.env.APP_NAME || "nestjs_book_api",
		url: process.env.APP_URL || "http://localhost:8000",
		version: process.env.APP_VERSION || "1.0.0",
		corsOrigin: process.env.APP_CORS_ORIGIN
			? process.env.APP_CORS_ORIGIN.includes(",")
				? process.env.APP_CORS_ORIGIN.split(",")
				: process.env.APP_CORS_ORIGIN
			: "http://localhost:3000",
		jwtSecret: process.env.APP_JWT_SECRET,
		jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN || "1h",
		cloudinaryUrl: process.env.CLOUDINARY_URL,
		cloudinaryFolder: process.env.CLOUDINARY_FOLDER || "nestjs_book_api_covers",
	};
}

export default registerAs<AppConfig>("app", () => {
	return getAppConfig();
});
