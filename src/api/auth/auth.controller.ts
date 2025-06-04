import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("/sign-up")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Register a new user" })
	@ApiBody({ type: SignUpDto })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User successfully registered",
		schema: {
			example: {
				accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				user: {
					id: 1,
					email: "user@example.com",
					username: "username",
				},
			},
		},
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid input data or validation failed",
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: "User with this email or username already exists",
	})
	public async signUp(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto);
	}

	@Post("sign-in")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Authenticate user and get access token" })
	@ApiBody({ type: SignInDto })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User successfully authenticated",
		schema: {
			example: {
				accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				user: {
					id: 1,
					email: "user@example.com",
					username: "username",
				},
			},
		},
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: "Invalid input data or validation failed",
	})
	@ApiResponse({
		status: HttpStatus.UNAUTHORIZED,
		description: "Invalid credentials",
	})
	public async signIn(@Body() signInDto: SignInDto) {
		return this.authService.signIn(signInDto);
	}
}
