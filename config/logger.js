const log4js = require('log4js');

log4js.configure({
  appenders: {
    console: { 
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c:%] %m'
      }
    },
    file: { 
      type: 'file', 
      filename: 'logs/fortepress.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true
    }
  },
  categories: {
    default: { 
      appenders: ['console', 'file'], 
      level: 'info' 
    },
    'service:analytic': { 
      appenders: ['console', 'file'], 
      level: 'debug' 
    },
    'utils:paseto': { 
      appenders: ['console', 'file'], 
      level: 'info' 
    },
    'utils:paginate': { 
      appenders: ['console', 'file'], 
      level: 'info' 
    }
  }
});

module.exports = log4js;