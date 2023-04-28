import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id: number;

    @Column({
        length: 63
    })
    name: string;

    @Column({
        length: 127,
        unique: true
    })
    email: string;

    @Column({
        length: 127
    })
    password: string;

    @Column({
        type: 'date',
        nullable: true
    })
    birthAt: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column({
        enum: [1, 2]
    })
    role: number;

}