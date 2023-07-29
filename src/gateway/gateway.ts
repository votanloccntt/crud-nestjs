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
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
  constructor(
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,

    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,

    @InjectRedis() private readonly redis: Redis,

    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  socket: Socket;

  async handleConnection(@ConnectedSocket() client: any) {
    const authorizationHeader = client.handshake.headers.authorization;

    const user: any = this.jwtService.decode(authorizationHeader);

    if (!user) {
      console.log('incorrect token');
    }

    console.log(`${user.email} Đã online`);

    client.data.user_id = user.id;
    client.data.user_email = user.email;

    const connection = await this.connectionRepository.save({
      user_id: user.id,
      socket_id: client.id,
      conversation_id: 0,
    });

    await this.redis.set(user.id, JSON.stringify(connection));
  }

  async handleDisconnect(@ConnectedSocket() client: any) {
    console.log(`${client.data.user_email} Đã offline`);
    const redisData = await this.redis.get(client.data.user_id);
    const result = JSON.parse(redisData);

    await this.connectionRepository.delete(result.id);
    client.leave(client.data.conversation_id);
  }

  @SubscribeMessage('join')
  async onJoin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const redisData = await this.redis.get(client.data.user_id);
    const result = JSON.parse(redisData);

    const { conversationId } = body;

    await this.connectionRepository.update(result.id, {
      ...result,
      conversation_id: conversationId,
    });

    client.join(conversationId);

    this.server
      .to(conversationId)
      .emit(
        'onjoin',
        `${client.data.user_email} Đã vào phòng ${conversationId}`,
      );
  }

  onModuleInit() {
    // this.server.on('connection', (socket) => {
    //   console.log(socket.id, 'Connected');
    // });
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
