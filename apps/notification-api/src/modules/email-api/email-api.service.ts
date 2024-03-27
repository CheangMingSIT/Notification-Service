import {
    ApiKey,
    NotificationLog,
    RK_NOTIFICATION_EMAIL,
    RabbitmqService,
    User,
} from '@app/common';
import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { GridFSBucket } from 'mongodb';
import { Connection, Model } from 'mongoose';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

interface EmailLog {
    readonly _id: string;
    readonly channel: string;
    readonly status: string;
    readonly subject: string;
    readonly message: string;
    readonly sender: string;
    readonly recipient: string[];
    readonly scheduleDate: Date;
    readonly fileIds?: string[];
    readonly secretKey: string;
    readonly user: {
        readonly userId: string;
        readonly organisationId: string;
    };
}

@Injectable()
export class EmailApiService {
    bucket: GridFSBucket;
    constructor(
        private readonly rabbitMQService: RabbitmqService,
        @InjectModel(NotificationLog.name)
        private notificationLogModel: Model<NotificationLog>,
        @InjectRepository(ApiKey, 'postgres')
        private apiKeyRepo: Repository<ApiKey>,
        @InjectRepository(User, 'postgres')
        private userRepo: Repository<User>,
        @InjectConnection() private connection: Connection,
    ) {
        this.initializeGridFSBucket();
    }

    private initializeGridFSBucket() {
        if (!this.connection.readyState) {
            this.connection.once('open', () => {
                console.log('Connected to the database');
                this.bucket = new GridFSBucket(this.connection.db, {
                    bucketName: 'fs',
                });
            });
        } else {
            console.log('Database connection already established');
            this.bucket = new GridFSBucket(this.connection.db, {
                bucketName: 'fs',
            });
        }
    }
    async publishEmail(
        body: {
            from: string;
            to: string[];
            cc?: string[];
            bcc?: string[];
            subject: string;
            body: string;
        },
        files: any[],
        secretKey: string,
    ) {
        const _id = uuidv4();
        let mergeRecipients: string[] = [];
        let response: Boolean;
        let fileIds: string[] = [];
        try {
            const { userId } = await this.apiKeyRepo.findOneBy({ secretKey });
            const { organisationId } = await this.userRepo.findOne({
                where: { userId },
            });
            if (files && files.length > 0) {
                for (const file of files) {
                    const id = await this.uploadFile(file);
                    fileIds.push(id);
                }
            }
            const payload = { _id, body, fileIds };
            response = await this.rabbitMQService.publish(
                RK_NOTIFICATION_EMAIL,
                payload,
            );
            if (!response) {
                return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Email failed to add to the queue',
                };
            }
            mergeRecipients = [
                ...(body.cc || []),
                ...(body.bcc || []),
                ...body.to,
            ];

            const log: EmailLog = {
                _id,
                channel: 'Email',
                status: response === true ? 'QUEUING' : 'QUEUE FAIL',
                subject: body.subject,
                message: body.body,
                sender: body.from,
                recipient: mergeRecipients,
                fileIds,
                scheduleDate: new Date(),
                secretKey,
                user: {
                    userId,
                    organisationId,
                },
            };

            const logModel = new this.notificationLogModel(log);
            await logModel.save();
            return {
                status: HttpStatus.CREATED,
                message: 'Email added to the queue successfully',
            };
        } catch (error) {
            console.error(error);
            return {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Something went wrong',
            };
        }
    }

    async uploadFile(file: any): Promise<string> {
        if (!this.bucket) {
            throw new InternalServerErrorException(
                'Database connection not established',
            );
        }

        try {
            const fileStream = this.bucket.openUploadStream(file.originalname, {
                contentType: file.mimetype,
            });
            const fileBuffer = Buffer.from(file.buffer);
            fileStream.write(fileBuffer);
            fileStream.end();
            return fileStream.id.toString();
        } catch (error) {
            throw new InternalServerErrorException('Failed to upload file');
        }
    }
}
