export interface AppConfig {
	port: number;
	env: string;
	name: string;
	url: string;
	version: string;
	corsOrigin: string | string[];
}
