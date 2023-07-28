import { MessageEntity } from 'src/message/entities/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MessageEntity, (message) => message.conversation_id)
  @JoinColumn({ name: 'message_id' })
  message: MessageEntity;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'bigint', nullable: true })
  last_message_id: number;

  @Column({ type: 'int', nullable: true })
  type: number;

  @Column({ type: 'int', array: true, nullable: true })
  members: number[];

  @Column({ type: 'text', nullable: true })
  background: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_activity: Date;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'timestamptz', nullable: true })
  timestamp: Date;
}
