import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
		required: true,
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({
		description: "Username (minimum 3 characters)",
		example: "johndoe",
		required: true,
		minLength: 3,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	username: string;

	@ApiProperty({
		description: "User password (minimum 6 characters)",
		example: "password123",
		required: true,
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@ApiProperty({
		description: "Password confirmation (must match password)",
		example: "password123",
		required: true,
		minLength: 6,
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	confirmPassword: string;
}
