import { Profile } from "src/modules/profile/entities/profile.entity";
import { Tweet } from "src/modules/tweet/entities/tweet.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 24,
        unique: true,
    })
    username: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false,
        length: 100,
    })
    password: string;

    @OneToOne(() => Profile, (profile) => profile.user, { 
        cascade: ['insert'],
    })
    profile?: Profile;

    @OneToMany(() => Tweet, (tweet) => tweet.user)
    tweets: Tweet[];

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

    @DeleteDateColumn({
        type: 'timestamp',
        nullable: false,
    })
    deletedAt: Date;
}
