import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { ConnectionEntity } from './entities/connection.entity';
import { MessageEntity } from 'src/message/entities/message.entity';

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
  constructor(
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,

    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,

    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  socket: Socket;

  async handleConnection(@ConnectedSocket() client: any) {
    const authorizationHeader = client.handshake.headers.authorization;
    const user: any = this.jwtService.decode(authorizationHeader);

    client.data.user_id = user.id;

    if (!user) {
      console.log('incorrect token');
    }

    await this.connectionRepository.save({
      user_id: user.id,
      socket_id: client.id,
      conversation_id: 0,
    });
    console.log('Đã lưu connection vào database');
  }

  @SubscribeMessage('join')
  onJoin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { conversationId } = body;

    client.join(conversationId);

    this.server
      .to(conversationId)
      .emit('onjoin', `Đã vào phòng ${conversationId}`);
  }

  handleDisconnect(@ConnectedSocket() client: any, @MessageBody() body: any) {
    const { conversationId } = body;
    client.leave(conversationId);
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'Connected');
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    this.server.to(body.conversationId).emit('onMessage', body.message);
    this.messageRepository.save({
      conversation_id: body.conversationId,
      user_id: client.data.user_id,
      message: body.message,
    });
  }
}
