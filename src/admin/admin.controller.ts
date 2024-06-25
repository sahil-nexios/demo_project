import { Body, Controller, Post, Req, Res, HttpStatus, Get, UseGuards, Param, SetMetadata } from '@nestjs/common';
import { request } from 'http';
import { AdminService } from './admin.service'
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CustomRequest } from './custom.req';
import { RolesGuard } from '../passport.jwt';
import { Roles } from '../passport.jwt';

@Controller('admin')
// @UseGuards(AuthGuard('jwt'), RolesGuard)

export class AdminController {
    constructor(private readonly AdminService: AdminService) { }

    @Post('sign')
    async sign_admin(@Body() dto, @Res() res: Response) {
        const result = await this.AdminService.sign_admin(dto);
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('Add_admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    async Add_admin(@Req() req: CustomRequest, @Body() dto, @Res() res: Response) {
        const result = await this.AdminService.Add_admin(dto);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('All_admin')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    async All_admin(@Req() req: CustomRequest, @Res() res: Response) {
        const result = await this.AdminService.All_admin();
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('view_admin/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    async view_admin(@Param('id') id: number, @Res() res: Response) {
        const result = await this.AdminService.view_admin(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('edit_admin/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    async edit_admin(@Param('id') id: string, @Body() dto, @Res() res: Response) {
        const result = await this.AdminService.edit_admin(id, dto);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('delete_admin/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    async delete_admin(@Param('id') id: string, @Res() res: Response) {
        const result = await this.AdminService.delete_admin(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('admin_dashboard')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('superadmin')
    async admin_dashboard(@Res() res: Response) {
        const result = await this.AdminService.admin_dashboard();
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('Add_user')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async Add_user(@Req() req: CustomRequest, @Body() dto, @Res() res: Response) {
        const adminId = req.user.id;
        dto.addedByAdminId = adminId;
        const result = await this.AdminService.Add_user(dto);
        return res.status(HttpStatus.OK).json(result);
    }


    @Get('All_user')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    async All_user(@Req() req: CustomRequest, @Res() res: Response) {
        const result = await this.AdminService.All_user();
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('view_user/:id')
    @Roles('admin')
    async view_user(@Param('id') id: number, @Res() res: Response) {
        const result = await this.AdminService.view_user(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Post('edit_user/:id')
    @Roles('admin')
    async edit_user(@Param('id') id: string, @Body() dto, @Res() res: Response) {
        const result = await this.AdminService.edit_user(id, dto);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('delete_user/:id')
    @Roles('admin')
    async delete_user(@Param('id') id: string, @Res() res: Response) {
        const result = await this.AdminService.delete_user(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('dashboard')
    @Roles('admin')
    async Dashboard(@Res() res: Response) {
        const result = await this.AdminService.Dashboard();
        return res.status(HttpStatus.OK).json(result);
    }
}
