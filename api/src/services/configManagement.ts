import config from '../config';
import logger from '../helpers/logger';
import { callApi } from '../helpers/apiCaller';
import { getMySQLPool } from '../loaders/mysql';
import { maskSecrets } from '../helpers/configManagement';
import { SLAVE_APITESTER } from '../constants/constants';

export const saveConfigRequest = async(
  payload: any,
  userMail: string,
  status: string,
  action: string = 'insert',
  configId: string | null = null,
) => {
  const mysql = getMySQLPool();
  switch (action) {
    case 'insert':
      logger.info('saveConfigRequest: insert');
      mysql.query(
        'INSERT INTO config_requests(request,orgId,cluster,configName,configValue,defaultValue,isSecret,tags, user, status) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [
          JSON.stringify(payload),
          payload?.orgId ?? null,
          payload?.cluster ?? null,
          payload?.configName ?? null,
          payload?.configValue ?? null,
          payload?.defaultValue ?? '',
          payload?.isSecret ?? false,
          payload?.tags ?? null,
          userMail ?? null,
          status ?? null,
        ],
      );
      break;
    case 'approve':
      logger.info('saveConfigRequest: approve');
      mysql.query('UPDATE config_requests SET status = ? WHERE id = ?', [
        'SUCCESS',
        configId,
      ]);
      break;
    case 'reject':
      logger.info('saveConfigRequest: reject');
      mysql.query('UPDATE config_requests SET status = ? WHERE id = ?', [
        'REJECTED',
        configId,
      ]);
      break;
    default:
      logger.error(`saveConfigRequest: invalid action ${action}`);
      break;
  }
};

export const getConfigData = async (
  orgId: number,
  status: string = 'SUCCESS',
  configName: string = '',
) => {
  if (config?.MASTER_APITESTER) {
    const mysql = getMySQLPool();
    const [configs] = await mysql.query(
      'SELECT id,configName,configValue,defaultValue,isSecret,user,status,orgId,cluster FROM config_requests where orgId = ? and status = ? and configName LIKE ? ORDER BY auto_update_time DESC',
      [orgId, status, `%${configName}%`],
    );
    return maskSecrets(configs);
  }
};
