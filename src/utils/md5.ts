import * as crypto from 'crypto';

export const md5 = (value: string) => {
  const hash = crypto.createHash('md5');
  hash.update(value);
  return hash.digest('hex');
};
