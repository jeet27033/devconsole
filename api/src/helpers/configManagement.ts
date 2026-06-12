import { map } from 'lodash';

export const maskSecrets = (arr: any) => {
  return map(arr, (item) => {
    if (item?.isSecret === 1) {
      return {
        ...item,
        configValue: '***',
      };
    }
    return item;
  });
};
