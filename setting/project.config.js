const defaultConfig = {
  kv: {
    limit: 5,
    timeout: 300,
    keepAliveTimeout: 15000,
    charset: 'utf8',
    pool: [
      // 连接后端服务
      {
        host: 'weball01.sgsfe.djt.ted',
        port: 8088
      },
      {
        host: 'weball02.sgsfe.djt.ted',
        port: 8088
      },
      {
        host: 'weball01.sgsfe.sjs.ted',
        port: 8088
      },
      {
        host: 'weball02.sgsfe.sjs.ted',
        port: 8088
      }
    ]
  },
  redis: {
    open: false, // 是否开启 redis, default: true
    feCache: {
      host: 'a.redis.sogou',
      port: '2017',
      password: 'SgsDevFeCache',
      db: 1
    }
  },
  mysql: {
    host: 'admin.weixinheadline.rds.sogou',
    port: 3306,
    username: 'wx_mis',
    password: 'wx_mis_headline',
    db: 'wx',
    charset: 'UTF8_GENERAL_CI',
    maxConnection: 5
  },
  app: {
    mid: '966b@@shida_yinhe',
    xid: '6329@@shida_yinhe',
    retryTimes: 3
  }
}

module.exports = defaultConfig
