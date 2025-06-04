import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HealthController } from "./health.controller";

@Module({
	imports: [TerminusModule, HttpModule, TypeOrmModule],
	controllers: [HealthController],
})
export class HealthModule {}
