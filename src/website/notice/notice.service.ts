import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity) private readonly noticeRepository: Repository<NoticeEntity>,
  ) {}

  async create(createNoticeDto: CreateNoticeDto) {
    const notice: Partial<NoticeEntity> = {
      aaa: createNoticeDto.aaa,
      bbb: createNoticeDto.bbb,
      ccc: createNoticeDto.ccc,
    };
    return await this.noticeRepository.save(notice);
  }

  async findAll(): Promise<NoticeEntity[]> {
    return await this.noticeRepository.find();
  }

  async findOne(id: number): Promise<NoticeEntity> {
    return await this.noticeRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateNoticeDto: UpdateNoticeDto): Promise<NoticeEntity> {
    await this.noticeRepository.update(id, updateNoticeDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.noticeRepository.delete(id);
  }
}
