import { Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ContactService } from '../../contact/services/contact.service';
import { ProjectService } from '../../project/services/project.service';
import { TechnologyService } from '../../technology/services/technology.service';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { ContactResponseDto } from '../../contact/dtos/responses/contact-response.dto';
import { ProjectResponseDto } from '../../project/dtos/responses/project-response.dto';
import { TechnologyResponseDto } from '../../technology/dtos/responses/technology-response.dto';
import { IResponse } from '../../../common/interfaces/response.interface';

interface FullPortfolioData {
    profile: UserResponseDto;
    contacts: ContactResponseDto[];
    projects: ProjectResponseDto[];
    technologies: TechnologyResponseDto[];
}

@Controller({
    path: 'profile',
    version: '1',
})
export class ProfileController {
    constructor(
        private readonly userService: UserService,
        private readonly contactService: ContactService,
        private readonly projectService: ProjectService,
        private readonly technologyService: TechnologyService,
    ) { }

    @Get()
    async getPublicProfile(): Promise<IResponse<UserResponseDto>> {
        const user = await this.userService.findMainProfile();

        if (!user) {
            throw new NotFoundException('Main profile not found');
        }

        return {
            status_code: HttpStatus.OK,
            message: 'Profile retrieved successfully',
            data: UserResponseDto.fromEntity(user),
            version: '1.0.0',
        };
    }

    @Get('full')
    async getFullPortfolio(): Promise<IResponse<FullPortfolioData>> {
        const user = await this.userService.findMainProfile();

        if (!user) {
            throw new NotFoundException('Main profile not found');
        }

        // Get all visible contacts ordered
        const contacts = await this.contactService.findAllVisible();

        // Get all visible projects ordered
        const projects = await this.projectService.findAllVisible();

        // Get all visible technologies
        const technologies = await this.technologyService.findAllVisible();

        const portfolioData: FullPortfolioData = {
            profile: UserResponseDto.fromEntity(user),
            contacts: contacts.map((c) => ContactResponseDto.fromEntity(c)),
            projects: projects.map((p) => ProjectResponseDto.fromEntity(p)),
            technologies: technologies.map((t) =>
                TechnologyResponseDto.fromEntity(t),
            ),
        };

        return {
            status_code: HttpStatus.OK,
            message: 'Full portfolio retrieved successfully',
            data: portfolioData,
            version: '1.0.0',
        };
    }
}
