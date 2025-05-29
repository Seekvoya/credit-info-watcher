import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class WatcherService {
  async getClientCredinInfoByUID(param: string) {
    if (!param) {
      throw new HttpException('Search param not found', HttpStatus.NOT_FOUND);
    }
    // написать entity или interface через который буду осуществлять поиск в бд.

    const manager = getManager();

    const { dog } = await manager
      .getRepository(mockEntity) //Сюда кинуть сущность с которой буду работать
      .createQueryBuilder('dog')
      .where('dog.ID = :id');

    return dog;
  }

  async postCorrectionsIntoEquifax() {
    // здесь описать логику того как в equifax будут делаться вставки в зависимости от полученных параметров из первого метода

    // Данные должны быть стандартизированы таким образом,
    // Что можно будет сразу скопировать нужные поля в нужном форме из Get запроса
    // И вставить их в тело Post запроса, в нём же в зависимости от полей,
    // Таких как ID_STATUS, с помощью енамов будут проставляться нужные ивенты
    return;
  }

  async deleteEquifaxInfo() {
    return;
  }
}
