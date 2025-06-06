import { ProcessedCreditData } from 'src/modules/watcher/dto/watcher.dto.out';
import { EquifaxDeletionBody } from '../dto/manager.dto.in';
import { connectionSource } from 'src/config/ormConfig';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EquifaxRepository {
  async insertDeletion(data: EquifaxDeletionBody): Promise<void> {
    await connectionSource
      .createQueryBuilder()
      .insert()
      .into('api_bki_deleting')
      .values({
        ID_DOG: data.treaty_id,
        deletion_from: data.deleting_from,
        action: data.action,
        ...(data.is_treaty !== undefined && { is_treaty: data.is_treaty }),
      })
      .execute();
  }

  async insertCorrection(data: Partial<ProcessedCreditData>): Promise<void> {
    await connectionSource
      .createQueryBuilder()
      .insert()
      .into('equifax_dogovor')
      .values({
        ID_DOG: data.treaty_id,
        date: data.treaty_date_end,
        event: data.treaty_event_status,
      })
      .execute();
  }
}
