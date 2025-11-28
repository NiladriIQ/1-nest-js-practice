import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CreateProfileDto } from "src/modules/profile/dto/create-profile.dto";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(24)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsEmail()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    password: string;

    @IsOptional()
    profile?: CreateProfileDto;
}
