import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Task } from '../entity/Task.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as moment from 'moment';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Task)
        private readonly taskModel: Repository<Task>,
    ) { }

    async Add_task(dto, file) {
        try {
            if (!file) return { statusCode: HttpStatus.NOT_FOUND, status: false, message: 'Please upload image !' };
            let image = `public/image/${file.filename}`
            const create = this.taskModel.create({ ...dto, image: image })
            await this.taskModel.save(create)
            return { statusCode: HttpStatus.OK, status: true, message: 'Task Created Succesfully !' }

        } catch (error) {
            console.log("🚀 ~ UserService ~ Add_task ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async All_Task(id) {
        try {
            const Alluser = await this.taskModel.find({ where: { userid: id } });
            if (Alluser.length <= 0) return { statusCode: HttpStatus.NOT_FOUND, status: false, message: 'Task Not Found !' };
            return { statusCode: HttpStatus.OK, status: true, message: 'All Task !', count: Alluser.length, data: Alluser }
        } catch (error) {
            console.log("🚀 ~ UserService ~ All_Task ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }


    async View_Task(id) {
        try {
            const Alluser = await this.taskModel.findOne({ where: { id: id } });
            if (!Alluser) return { statusCode: HttpStatus.NOT_FOUND, status: false, message: 'Task Not Found !' };
            return { statusCode: HttpStatus.OK, status: true, message: 'Task !', data: Alluser }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ All_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async edit_task(dto, file, id) {
        try {
            const Alluser = await this.taskModel.findOne({ where: { id: id } });
            let image
            if (file) {
                fs.unlinkSync(Alluser.image)
                image = `public/image/${file.filename}`
            }
            dto.image = image
            await this.taskModel.update(Number(id), dto);
            return { statusCode: HttpStatus.OK, status: true, message: 'Task Updated Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ UserService ~ edit_task ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }


    async delete_task(id) {
        try {
            const finduser = await this.taskModel.findOne({ where: { id: id } })
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'Task Not Found !' };
            fs.unlinkSync(finduser.image)
            await this.taskModel.delete(id)
            return { statusCode: HttpStatus.OK, status: true, message: 'Task Deleted Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ UserService ~ delete_task ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async user_dashboard(id) {
        try {
            const Alluser = await this.taskModel.find({ where: { userid: id } });
            const monthlyCounts = Alluser.reduce((acc, user) => {
                const month = moment(user.createdAt).format('YYYY-MM');
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month]++;
                return acc;
            }, {});
            return { statusCode: HttpStatus.OK, status: true, message: 'Data !', data: { Total_User: Alluser.length, Average: Object.keys(monthlyCounts).map(month => ({ month, count: monthlyCounts[month], })) } }
        } catch (error) {
            console.log("🚀 ~ UserService ~ user_dashboard ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

}
