const express = require('express');
const router = require('./routers');

// ...

const app = express();

app.use(express.json());

app.use('/user', router.userRouter);
app.use('/login', router.loginRouter);
app.use('/categories', router.categoryRouter);
app.use('/post', router.postRouter);
// ...

// É importante exportar a constante `app`,
// para que possa ser utilizada pelo arquivo `src/server.js`
module.exports = app;
