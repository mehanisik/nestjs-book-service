import {
	Injectable,
	ConflictException,
	UnauthorizedException,
	Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInDto } from "./dto/sign-in.dto";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	public async signUp(
		registerDto: SignUpDto,
	): Promise<{ user: Omit<User, "password">; token: string }> {
		this.logger.debug(`Attempting to sign up user: ${registerDto.email}`);
		const existingUser = await this.findUserByEmailOrUsername(
			registerDto.email,
			registerDto.username,
		);

		if (existingUser) {
			this.logger.warn(`User already exists: ${registerDto.email}`);
			throw new ConflictException(
				"User with this email or username already exists",
			);
		}

		const hashedPassword = await this.hashPassword(registerDto.password);
		if (registerDto.password !== registerDto.confirmPassword) {
			this.logger.warn(`Password mismatch for user: ${registerDto.email}`);
			throw new ConflictException("Passwords do not match");
		}

		const user = this.userRepository.create({
			email: registerDto.email,
			username: registerDto.username,
			password: hashedPassword,
		});

		await this.userRepository.save(user);
		this.logger.log(`User successfully registered: ${user.email}`);

		const token = this.generateToken(user);
		const { password, ...userWithoutPassword } = user;
		return { user: userWithoutPassword, token };
	}

	public async signIn(
		loginDto: SignInDto,
	): Promise<{ user: Omit<User, "password">; token: string }> {
		this.logger.debug(`Attempting to sign in user: ${loginDto.email}`);
		const user = await this.findUserByEmail(loginDto.email);

		if (!user) {
			this.logger.warn(
				`Invalid login attempt for non-existent user: ${loginDto.email}`,
			);
			throw new UnauthorizedException("Invalid credentials");
		}

		const isPasswordValid = await this.validatePassword(
			loginDto.password,
			user.password,
		);

		if (!isPasswordValid) {
			this.logger.warn(`Invalid password for user: ${loginDto.email}`);
			throw new UnauthorizedException("Invalid credentials");
		}

		this.logger.log(`User successfully signed in: ${user.email}`);
		const token = this.generateToken(user);
		const { password, ...userWithoutPassword } = user;
		return { user: userWithoutPassword, token };
	}

	public async findById(id: string): Promise<User | undefined> {
		return this.userRepository.findOne({ where: { id } });
	}

	private async findUserByEmailOrUsername(
		email: string,
		username: string,
	): Promise<User | undefined> {
		return this.userRepository.findOne({
			where: [{ email }, { username }],
		});
	}

	private async findUserByEmail(email: string): Promise<User | undefined> {
		return this.userRepository.findOne({ where: { email } });
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	private async validatePassword(
		plainPassword: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(plainPassword, hashedPassword);
	}

	private generateToken(user: User): string {
		return this.jwtService.sign({ sub: user.id, email: user.email });
	}
}
