import { Hashtag } from "src/modules/hashtag/entities/hashtag.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tweet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text',
        nullable: false,
    })
    text: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    image?: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: false,
    })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tweets, { eager: true })
    user: User;

    @ManyToMany(() => Hashtag, (hashtag) => hashtag.tweets, { eager: true })
    @JoinTable()
    hashtags: Hashtag[];
}
