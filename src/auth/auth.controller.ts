import { Body, Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, Req } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { AuthService } from "./auth.service";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { UserService } from "../user/user.service";
import { FileService } from "../file/file.service";
import { AuthGuard } from "../guards/auth.guard";
import { User } from "../decorators/user.decorator";


@Controller('auth')
export class AuthController {

    constructor(private readonly userService: UserService,
                private readonly authService: AuthService,
                private readonly fileService: FileService
        ){}

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO){
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO){
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO){
        return this.authService.reset(password, token);
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user, @Req() {tokenPayload}){
        return {user, tokenPayload};
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({fileType: 'image/jpeg'}),
                new MaxFileSizeValidator({maxSize: 1024 * 50})
            ]
        })) photo: Express.Multer.File){

        const filename = `photo-${user.id}.png`;

        try{
        await this.fileService.upload(photo, filename);
        } catch (e){
            throw new BadRequestException(e);
        }

        return {photo};
    }


    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuard)
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]){
        return files;
    }


    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    },{
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuard)
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}){
        return files;
    }

}