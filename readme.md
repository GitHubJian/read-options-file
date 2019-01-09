###Read Options File

>读取根目录下 Setting 目录中的配置文件
NODE_ENV 或者 APP_CONFIG_ENV 当前环境
APP_CONFIG_INSTANCE 当前实例对象
APP_CONFIG_ENABLED 开启各环境实例 default: false


```
export APP_CONFIG_ENV="development"
export APP_CONFIG_INSTANCE="xiaows"
export APP_CONFIG_ENABLED="true"

const config = require('read-options-file').load('project.config.js')
```

```
上述代码执行结果
依次读取下列文件
1. root/setting/project.config.js
2. root/setting/project.config-development.js
3. root/setting/project.config-development-xiaows.js

优先级 3 > 2 > 1