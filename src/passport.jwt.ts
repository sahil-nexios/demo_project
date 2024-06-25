import { Injectable, UnauthorizedException, ExecutionContext, CanActivate } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from './admin/admin.service';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly AdminService: AdminService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "CODE",
        });
    }

    async validate(payload: any) {
        const user = await this.AdminService.validateUserById(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return roles.includes(user.role);
    }
}