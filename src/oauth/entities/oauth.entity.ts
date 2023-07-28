import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oauth')
export class OauthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column({ type: 'text' })
  access_token: string;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'timestamptz', nullable: true })
  timestamp: Date;
}
