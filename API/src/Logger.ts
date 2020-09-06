import winston from 'winston';

class Logger {

    private static _logger: Logger;

    public static get instance(): Logger {
        if (!this._logger){
            this._logger = new Logger();
        }

        return this._logger;
    }

    private _log: winston.Logger;

    private constructor() {
        this._log = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
              //
              // - Write all logs with level `error` and below to `error.log`
              // - Write all logs with level `info` and below to `combined.log`
              //
              new winston.transports.File({ filename: '/logs/error.log', level: 'error' }),
              new winston.transports.File({ filename: '/logs/combined.log' }),
            ],
          });

          if (process.env.NODE_ENV !== 'production') {
            this._log.add(new winston.transports.Console({
              format: winston.format.simple(),
            }));
          }
    }

    public error = (str: string) => this._log.error(str);

    public warn = (str: string) => this._log.warn(str);

    public info = (str: string) => this._log.info(str);

    public debug = (str: string) => this._log.debug(str);
}

export default Logger;

