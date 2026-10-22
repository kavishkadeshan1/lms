import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service.js';
import { SubmissionController } from './submission.controller.js';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
