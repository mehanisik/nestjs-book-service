import { registerAs } from "@nestjs/config";
import { AppConfig } from "./app-config.type";

export function getAppConfig(): AppConfig {
	return {
		port: Number.parseInt(process.env.PORT || "8000", 10),
		env: process.env.NODE_ENV || "development",
	};
}

export default registerAs<AppConfig>("app", () => {
	return getAppConfig();
});
