# node-which
1.node-which在npm生命周期脚本的npm修改PATH环境中运行。 

2.可用npm install来完成安装：npm install -g npm-which  

3.npm-which会找到相对于您提供的cwd的可执行文件。cwd是必须的，以便在需要查找的东西不明确时减少混淆。cwd:文件绝对路径。   

在PATH环境变量中查找指定可执行文件的第一个实例.  

4.node-which提供了同步、异步两种执行方法  
异步：  
var which = require('npm-which')(process.cwd()) // remember to supply cwd   
which（' node '，function（err，resolvedPath){    
  if (err) return console.error(err.message);    
  console.log(resolvedPath)   
})  
如果在PATH上找不到node则会返回错误信息，若找到则会返回绝对路径信息。        
同步：  
// throws if not found   如果没找到则抛出异常   
var resolved = which.sync('node')   

// if nothrow option is used, returns null if not found    
resolved = which.sync('node', {nothrow: true})    

// Pass options to override the PATH and PATHEXT environment vars.传递选项来覆盖PATH和PATHEXT环境变量    
which('node', { path: someOtherPath }, function (err, resolved) {   
  if (err)    
    throw err;    
  console.log('found at %j', resolved)   
})     

5.option     
传递一个选项作为第二个参数   
path：使用而不是PATH环境变量。  
pathExt：使用而不是PATHEXT环境变量。  
all：返回所有匹配的，而不仅仅是第一个。请注意，这意味着该函数将返回一个字符串数组而不是单个字符串。  

