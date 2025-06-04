import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { connectionSource } from 'src/config/ormConfig';
import { getValue } from 'src/utils/getValue';
import { ProcessedCreditData } from './dto/watcher.dto.out';
import { ManagerService, ProviderType } from '../manager/manager.service';
@Injectable()
export class WatcherService {
  private readonly logger = new Logger(WatcherService.name);
  private readonly manager: ManagerService;

  public async getClientCreditInfoById(
    searchData: any,
    shouldTriggerManager: boolean = false,
  ): Promise<ProcessedCreditData> {
    if (!searchData) {
      throw new HttpException(
        'Invalid search parameter provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    const searchParam = searchData.id;
    let queryRunner = null;

    try {
      if (!connectionSource.isInitialized) {
        await connectionSource.initialize();
      }

      queryRunner = connectionSource.createQueryRunner();

      const rawData = await connectionSource
        .createQueryBuilder()
        .select([
          'DBO.get_guid(d.ID) AS guid_id',
          'd.ID_DOGOVOR',
          'd.ID',
          'd.D_DATESTOP',
          'd.D_DATE_END',
          'd.ID_CLIENT',
          'd.ID_STATUS',
        ])
        .from('Dogovor', 'd')
        .innerJoin('Dict', 'dictionary', 'dictionary.ID = d.ID_OFO')
        .where('d.ID_DOGOVOR = :searchParam', { searchParam })
        .getRawOne();

      if (!rawData) {
        throw new HttpException(
          `No credit info found for ID: ${searchParam}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const processedData: ProcessedCreditData =
        this.mapRawDataToProcessed(rawData);

      if (processedData.treaty_id && shouldTriggerManager) {
        this.logger.log(
          `Triggering manager method for treaty ID: ${processedData.treaty_id}`,
        );
        await this.manager.processCorrection(processedData, {
          provider: ProviderType.EQUIFAX,
          isBankrupt: false,
        });
      }

      return processedData;
    } catch (error) {
      this.logger.error(
        `
        Error fetching client credit info for ID ${searchParam}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch client credit information',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (queryRunner) {
        await queryRunner.release();
      }
    }
  }

  private mapRawDataToProcessed(rawData) {
    return {
      uid: getValue(rawData),
      treaty_id: rawData.ID_DOGOVOR,
      treaty_num: rawData.ID,
      treaty_date_stop: rawData.D_DATESTOP,
      treaty_date_end: rawData.D_DATE_END,
      treaty_client_id: rawData.ID_CLIENT,
      treaty_event_status: rawData.ID_STATUS,
    };
  }
}
