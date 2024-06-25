import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    addedByAdminId: number;

    @ManyToOne(() => User, user => user.usersAdded, { nullable: true })
    @JoinColumn({ name: 'addedByAdminId' })
    addedByAdmin: User;

    @OneToMany(() => User, user => user.addedByAdmin)
    usersAdded: User[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
