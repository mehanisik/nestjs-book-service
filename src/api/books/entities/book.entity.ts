import { User } from "@/api/auth/entities/user.entity";
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";

@Entity("books")
export class Book {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	title: string;

	@Column()
	author: string;

	@Column({ nullable: true })
	description?: string;

	@Column()
	year: number;

	@Column({ nullable: true })
	coverImageUrl?: string;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;

	@Column()
	userId: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	constructor(partial: Partial<Book>) {
		Object.assign(this, partial);
	}
}
