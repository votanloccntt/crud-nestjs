import { OauthEntity } from 'src/oauth/entities/oauth.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FriendEntity } from 'src/friend/entities/friend.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => OauthEntity, (oauth) => oauth.id)
  oauth_id: OauthEntity[];

  @OneToMany(() => FriendEntity, (friend) => friend.id)
  friend: FriendEntity[];

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  street: string;

  @Column({ type: 'text', nullable: true })
  lat: string;

  @Column({ type: 'text', nullable: true })
  lng: string;

  @Column({ type: 'int', nullable: true })
  country_id: number;

  @Column({ type: 'int', nullable: true })
  city_id: number;

  @Column({ type: 'int', nullable: true })
  district_id: number;

  @Column({ type: 'int', nullable: true })
  ward_id: number;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  birthday: Date;

  @Column({ type: 'timestamptz', nullable: true })
  timestamp: Date;

  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }
}
