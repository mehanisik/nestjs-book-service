import { AppConfig } from "./app/app-config.type";
import { DatabaseConfig } from "./database/database-config.type";
import { AuthConfig } from "./auth/auth-config.type";
import { CloudConfig } from "./cloud/cloud-config.type";

export interface Config {
	app: AppConfig;
	database: DatabaseConfig;
	auth: AuthConfig;
	cloud: CloudConfig;
}
