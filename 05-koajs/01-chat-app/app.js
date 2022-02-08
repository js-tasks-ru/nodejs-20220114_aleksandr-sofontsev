const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let arr = [];

router.get('/subscribe', async (ctx) => {
  ctx.body = await new Promise((resolve) => {
    arr.push((message) => resolve(message));
  });
});

router.post('/publish', async (ctx) => {
  if (ctx.request.body.message) {
    arr.forEach((resolve) => {
      resolve(ctx.request.body.message);
    });
    ctx.status = 200;
    arr = [];
  } else {
    ctx.status = 400;
  }
});

app.use(router.routes());

module.exports = app;
