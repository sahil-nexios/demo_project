import { Injectable, Res, HttpStatus, } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Task } from '../entity/Task.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userModel: Repository<User>,

        @InjectRepository(Task)
        private readonly taskModel: Repository<Task>,

        private jwtService: JwtService
    ) { }

    async onModuleInit() {
        await this.createDefaultAdmin();
    }

    async validateUserById(payload: any): Promise<any> {
        const users = await this.userModel.findOne({ where: { id: payload.id, email: payload.email } });
        return users
    }

    async sign_admin(user: User): Promise<any> {
        try {
            const adminCount = await this.userModel.findOne({ where: { email: user.email } })
            if (!adminCount) {
                return { statusCode: HttpStatus.NOT_FOUND, status: false, message: 'Admin Not Found. Please Enter Valid Email!' };
            }
            const pass = await bcrypt.compare(user.password, adminCount.password)
            if (!pass) return { statusCode: HttpStatus.UNAUTHORIZED, status: false, message: 'Invalid Password!' };
            return { statusCode: HttpStatus.OK, status: true, message: 'Sign-in Successfully !', token: this.jwtService.sign({ _id: adminCount.id, email: adminCount.email }), data: { email: adminCount.email, name: adminCount.name, role: adminCount.role } }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ sign_admin ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }


    //  ============================== superAdmin ================================

    async createDefaultAdmin() {
        const adminCount = await this.userModel.findOne({ where: { email: "admin01@gmail.com" } })
        if (!adminCount) {
            const defaultAdmin = {
                name: 'Admin',
                email: "admin01@gmail.com",
                password: await bcrypt.hash('Admin@123', 10),
                role: 'superadmin',
            };
            const admin = this.userModel.create(defaultAdmin)
            await this.userModel.save(admin);
        }
    }


    async Add_admin(user) {
        try {
            if (!user.email || !user.name || !user.password) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'All Fields Are Required !' };
            if (!user.email.includes("@")) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'Please Enter A valid Email Address !' };
            const finduser = await this.userModel.findOne({ where: { email: user.email } })
            if (finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'This Email IS Already Taken !' };
            const users = this.userModel.create({ ...user, password: await bcrypt.hash(user.password, 10), role: 'admin' });
            await this.userModel.save(users);
            return { statusCode: HttpStatus.OK, status: true, message: 'Admin Added Succesfully !' }
        } catch (error) {
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async All_admin() {
        try {
            const Alluser = await this.userModel.find({ where: { role: 'admin' } });
            if (Alluser.length <= 0) return { statusCode: HttpStatus.NOT_FOUND, status: false, message: 'Admin Not Found !' };
            return { statusCode: HttpStatus.OK, status: true, message: 'All Admin !', count: Alluser.length, data: Alluser }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ All_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async view_admin(id) {
        try {
            const finduser = await this.userModel.findOne({
                where: { id, role: 'admin' },
                relations: ['usersAdded'],
            });
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'Admin Not Found !' };
            return { statusCode: HttpStatus.OK, status: true, message: 'Admin !', data: finduser }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ view_admin ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async edit_admin(id, user) {
        try {
            const finduser = await this.userModel.findOne({ where: { id: id } })
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'admin Not Found !' };
            await this.userModel.update(Number(id), user);
            return { statusCode: HttpStatus.OK, status: true, message: 'Admin Edited Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ edit_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async delete_admin(id) {
        try {
            const finduser = await this.userModel.findOne({ where: { id: id } })
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'Admin Not Found !' };
            await this.userModel.delete(id)
            return { statusCode: HttpStatus.OK, status: true, message: 'Admin Deleted Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ delete_admin ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async admin_dashboard() {
        try {
            const Alluser = await this.userModel.find({ where: { role: 'admin' } });
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
            console.log("🚀 ~ AdminService ~ Dashboard ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }


    //=========================== Admin ================================


    async Add_user(user) {
        try {
            if (!user.email || !user.name || !user.password) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'All Fields Are Required !' };
            if (!user.email.includes("@")) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'Please Enter A valid Email Address !' };
            const finduser = await this.userModel.findOne({ where: { email: user.email } })
            if (finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'This Email IS Already Taken !' };
            const users = this.userModel.create({ ...user, password: await bcrypt.hash(user.password, 10) });
            await this.userModel.save(users);
            return { statusCode: HttpStatus.OK, status: true, message: 'User Registerd Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ UserService ~ Signup_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async All_user() {
        try {
            const Alluser = await this.userModel.find({ where: { role: 'user' } });
            if (Alluser.length <= 0) return { statusCode: HttpStatus.NOT_FOUND, status: false, message: 'User Not Found !' };
            return { statusCode: HttpStatus.OK, status: true, message: 'All User !', count: Alluser.length, data: Alluser }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ All_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async view_user(id) {
        try {
            const finduser = await this.userModel.findOne({ where: { id: id } })
            const findtask = await this.taskModel.find({ where: { userid: id } })
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'User Not Found !' };
            return { statusCode: HttpStatus.OK, status: true, message: 'All User !', data: finduser, findtask }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ view_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async edit_user(id, user) {
        try {
            const finduser = await this.userModel.findOne({ where: { id: id } })
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'User Not Found !' };
            await this.userModel.update(Number(id), user);
            return { statusCode: HttpStatus.OK, status: true, message: 'User Edited Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ edit_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async delete_user(id) {
        try {
            const finduser = await this.userModel.findOne({ where: { id: id } })
            if (!finduser) return { statusCode: HttpStatus.BAD_REQUEST, status: false, message: 'User Not Found !' };
            await this.userModel.delete(id)
            return { statusCode: HttpStatus.OK, status: true, message: 'User Deleted Succesfully !' }
        } catch (error) {
            console.log("🚀 ~ AdminService ~ delete_user ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }

    async Dashboard() {
        try {
            const Alluser = await this.userModel.find({ where: { role: 'user' } });
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
            console.log("🚀 ~ AdminService ~ Dashboard ~ error:", error)
            return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, status: false, message: 'Something Went Wrong !' };
        }
    }


}
