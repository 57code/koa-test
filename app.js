const Koa = require('koa')
const app = new Koa();

// 修改ctx原型
app.context.log = console.log;
// app.context.db = require('./model/db');

// cookie签名使用keys
app.keys = ['secret'];

// 错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    }catch (e) {
        // 委托全局事件
        ctx.app.emit('error', e);
        ctx.body = '服务器内部错误：500'
    }
})

// logger
app.use(async (ctx, next) => {
    //1
    console.log(1);
    await next();
    //5
    // console.log(ctx.method + '-' + ctx.url + ' ' + ctx.response.get('X-Response-Time'));
})

// 响应时间
app.use(async (ctx, next) => {
    //2
    console.log(2);
    await cb();
    setTimeout(() => {
        console.log('setTimeout 100');
    }, 100)
    // const start = Date.now();//开始计时
    await next();
    //4
    console.log(4);
    // const ms = Date.now() - start;//计时结束
    // ctx.set('X-Response-Time', ms+'ms');
})

function cb() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('setTimeout');
            resolve();
        }, 1000)
    })
}

// 路由响应
app.use(ctx => {
    //3
    console.log(3);
    // ctx封装了req,res
    // ctx.log(ctx);
    // console.log(ctx.method);
    // console.log(ctx.href);
    // console.log(ctx.headers);
    // console.log(ctx.query);
    // console.log(ctx.request.body); // 请求体中数据


    // 常用响应别名
    // ctx.status = 200;
    // ctx.type = 'json';
    // ctx.body = {success: true, data: 'lalala'};
    ctx.type = 'html';

    // 访问cookie
    if (ctx.url === '/index') {
        ctx.cookies.set('foo', 'bar', {
            domain: 'localhost', // 表示域名匹配才进行path验证
            path: '/index', // 表示请求url必须是localhost/index
            maxAge: 86400000,
            httpOnly: true,
            signed: true // 签名cookie
        });
        ctx.body = '<h1>koa</h1>';
    } else if (ctx.url === '/index/a') {
        console.log(ctx.cookies.get('foo', {signed: true}));
        ctx.body = '<h1>' + ctx.cookies.get('foo') + '</h1>';
    } else {
        // ctx.throw(404)
        // ctx.throw(404, '没有您要的页面')
        // ctx.throw(404, '没有您要的页面', {foo: 'bar'})
        throw new Error('自定义错误信息')
    }
})


// 监听, 等同于http.createServer(app.callback()).listen(3000)
app.listen(3000);

// 全局错误处理
app.on('error', err => {
    console.error(err);
})
