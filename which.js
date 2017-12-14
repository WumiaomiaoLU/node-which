module.exports = which // 暴露which模块


var isWindows = process.platform === 'win32' || // 根据短路原则，||前边为真，返回前边，判断系统类型  
    process.env.OSTYPE === 'cygwin' || // 操作系统类型      
    process.env.OSTYPE === 'msys'  
 
var path = require('path')
var COLON = isWindows ? ';' : ':'
var isexe = require('isexe') // 引用isexe模块  

// 发生错误，未找到是调用的函数  
function getNotFoundError (cmd) {
  var err = new Error('not found: ' + cmd)
  err.code = 'ENOENT' //代码报错解决方案，显示'ENOENT'  

  return err
}


//得到路径信息函数  
function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON // colon:冒号  
  var pathEnv = opt.path || process.env.PATH || '' // 路径，环境变量  
  var pathExt = ['']

  pathEnv = pathEnv.split(colon) // 路径用冒号分割,分割为字符串数组  

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd()) // 在头部插入绝对路径
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)

    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '') // cmd系统命令执行程序  
      pathExt.unshift('')
  }     
    
  return {
    env: pathEnv, // 返回path路径
    ext: pathExt, // 返回path路径文件后缀名  
    extExe: pathExtExe //返回可执行文件  
  }
}


//异步方式
function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) { // 检查后路径  
    if (i === l) {    
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd)) // 错误信息  
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1) // 去除前后引号  

    var p = path.join(pathPart, cmd) // 将多个参数组合成一个 path  
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) { // 正则表达式  
      p = cmd.slice(0, 2) + p // p为最后找到的路径
    }
    ;(function E (ii, ll) { // 检查后缀名    
      if (ii === ll) return F(i + 1, l)  
      var ext = pathExt[ii]  
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) { // 通过检查文件扩展名来确定文件是否为可执行文件  
        if (!er && is) {  
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}


//同步方式
function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}
