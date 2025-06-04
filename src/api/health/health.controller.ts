import { Controller, Get } from "@nestjs/common";
import {
	HealthCheckService,
	HttpHealthIndicator,
	HealthCheck,
	HealthIndicatorResult,
} from "@nestjs/terminus";
import { DataSource } from "typeorm";

@Controller("health")
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private dataSource: DataSource,
	) {}

	@Get()
	@HealthCheck()
	async check() {
		return this.health.check([
			() => this.http.pingCheck("nestjs-docs", "https://docs.nestjs.com"),
			async () => {
				try {
					await this.dataSource.query("SELECT 1");
					return {
						database: {
							status: "up",
						},
					} as HealthIndicatorResult;
				} catch (error) {
					return {
						database: {
							status: "down",
							error: error.message,
						},
					} as HealthIndicatorResult;
				}
			},
		]);
	}
}
