import { Body, Controller, Get, Post, Res, HttpStatus, UploadedFile, UseInterceptors, Req, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service'
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { taskImageupload } from '../multerService'
import { CustomRequest } from '../admin/custom.req'
import { RolesGuard } from '../passport.jwt';
import { Roles } from '../passport.jwt';
import { AuthGuard } from '@nestjs/passport';


@Controller('user')
export class UserController {

    constructor(private readonly UserService: UserService) { }


    @Post('Add_task')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    @UseInterceptors(FileInterceptor('image', taskImageupload))
    async Add_task(@Body() dto, @Req() req: CustomRequest, @Res() res: Response, @UploadedFile() file) {
        const userid = req.user.id;
        dto.userid = userid;
        const result = await this.UserService.Add_task(dto, file);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('All_Task')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    @UseInterceptors(FileInterceptor('image', taskImageupload))
    async All_Task(@Body() dto, @Req() req: CustomRequest, @Res() res: Response, @UploadedFile() file) {
        const id = req.user.id;
        const result = await this.UserService.All_Task(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('View_Task/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    async View_Task(@Param('id') id: number, @Req() req: CustomRequest, @Res() res: Response) {
        const result = await this.UserService.View_Task(id);
        return res.status(HttpStatus.OK).json(result);
    }



    @Post('edit_task/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    @UseInterceptors(FileInterceptor('image', taskImageupload))
    async edit_task(@Body() dto, @Param('id') id: number, @Req() req: CustomRequest, @Res() res: Response, @UploadedFile() file) {
        const result = await this.UserService.edit_task(dto, file, id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get('delete_task/:id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    async delete_task(@Param('id') id: number, @Req() req: CustomRequest, @Res() res: Response) {
        const result = await this.UserService.delete_task(id);
        return res.status(HttpStatus.OK).json(result);
    }

    @Get("user_dashboard")
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('user')
    async user_dashboard(@Req() req: CustomRequest, @Res() res: Response) {
        const result = await this.UserService.user_dashboard(req.user.id);
        return res.status(HttpStatus.OK).json(result);
    }


}
