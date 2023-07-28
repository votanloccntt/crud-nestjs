import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.id)
  @JoinColumn({ name: 'conversation_id' })
  conversation_id: ConversationEntity;

  @Column({ type: 'bigint', nullable: true })
  user_id: number;

  @Column({ type: 'int', nullable: true })
  type: number;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'int', nullable: true })
  status: number;

  @Column({ type: 'timestamptz', nullable: true })
  timestamp: Date;
}
