const ftp = new require('ftp')();
const fs = require('fs');
const log = require('log4js');

const CONNECT_CONFIG = {
  host: '172.28.89.9',
  port: 21,
  user: 'upload',
  password: '',
};

log.configure({
  appenders: {
    info: {
      type: 'file',
      filename: './info.log',
    },
    error: {
      type: 'file',
      filename: './error.log',
    }
  },
  categories: {
    default: {
      appenders: ['info', 'error'],
      level: 'off'
    }
  }
});

const infoLogger = log.getLogger('info');
const errorLogger = log.getLogger('error');
infoLogger.level = 'info';
errorLogger.level = 'error';

try {
  ftp.on('ready', ()=> {
    console.log('ready');
  
    ftp.get('/offices2016/123.bat', (err, stream)=> {
      if(err) {
        errorLogger.error(err);
        console.log(err);
        throw err;
      } else {
        infoLogger.info('下载成功');
        stream.once('close', function() { ftp.end(); });
        stream.pipe(fs.createWriteStream('C:/Users/83859/Desktop/123.bat'));
      }
    })
  });

  ftp.on('error', (err)=> {
    throw err;
  })
} catch(err) {
  errorLogger.error(err);
}


try {
  ftp.connect(CONNECT_CONFIG);
} catch(err) {
  errorLogger.error(err);
}
