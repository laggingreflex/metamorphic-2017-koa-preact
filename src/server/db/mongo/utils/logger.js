import changeCase from 'change-case';
import { createLogger } from '.../server/utils/log';

export default (schema, opts = {}) => {
  const log = createLogger({
    ...opts,
    name: changeCase.sentence(opts.name),
  });
  schema.static('log', log);

  schema.method('log', {
    info(...m) { log.info({ document: this }, ...m) },
    error(...m) { log.error({ document: this }, ...m) },
  });
};
