import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: "User password",
		example: "password123",
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	password: string;
}
