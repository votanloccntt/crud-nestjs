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

@WebSocketGateway()
export class MyGateway implements OnModuleInit {
  constructor(
    @InjectRepository(ConnectionEntity)
    private connectionRepository: Repository<ConnectionEntity>,

    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  socket: Socket;

  handleConnection(@ConnectedSocket() client: any) {
    const authorizationHeader = client.handshake.headers.authorization;
    const checkLogin: any = this.jwtService.decode(authorizationHeader);
    if (!checkLogin) {
      console.log('incorrect token');
    }

    this.connectionRepository.save({
      user_id: checkLogin.id,
      socket_id: client.id,
      conversation_id: 0,
    });

    // console.log(` ${client.id}  ${client.handshake?.query?.deviceId}`);
  }
  @SubscribeMessage('join')
  onJoin(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: any,
  ) {
    client.join(conversationId);

    this.server.to(conversationId).emit('onjoin', 'Da join phong');
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    // console.log(
    //   `user ${client.user.id} with socket ${client.id} with device ${client.handshake?.query?.deviceId} DISCONNECTED`,
    // );

    client.leave('1');
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'Connected');
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }
}
