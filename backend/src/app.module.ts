import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UserModule } from './user/user.module.js';
import { CourseModule } from './course/course.module.js';
import { EnrollmentModule } from './enrollment/enrollment.module.js';
import { AssignmentModule } from './assignment/assignment.module.js';
import { SubmissionModule } from './submission/submission.module.js';

@Module({
  imports: [PrismaModule, UserModule, CourseModule, EnrollmentModule, AssignmentModule, SubmissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
ule {}
