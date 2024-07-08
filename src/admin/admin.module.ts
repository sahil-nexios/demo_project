import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../passport.jwt'
import { User } from '../entity/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entity/Task.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Task]),
        JwtModule.register({
            secret: process.env.JWT_SECRET
        }),
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [AdminController],
    providers: [AdminService, JwtStrategy],
    exports: [AdminService],
})
export class AdminModule { }
