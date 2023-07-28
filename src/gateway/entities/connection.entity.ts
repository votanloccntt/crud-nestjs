import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('connection')
export class ConnectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column()
  socket_id: string;

  @Column({ type: 'int' })
  conversation_id: number;
}
