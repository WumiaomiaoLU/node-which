# node-which
node-which在npm生命周期脚本的npm修改PATH环境中运行。  
可用npm install来完成安装：npm install -g npm-which  
npm-which会找到相对于您提供的cwd的可执行文件。cwd是必须的，以便在需要查找的东西不明确时减少混淆。cwd:文件绝对路径。   
node-which提供了同步、异步两种执行方法  
异步：  
var which = require('npm-which')(process.cwd()) // remember to supply cwd   
which('tape', function(err, pathToTape) {  
  if (err) return console.error(err.message)  
  console.log(pathToTape) // /Users/.../node_modules/.bin/tape   
})  
