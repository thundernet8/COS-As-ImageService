/**
 * 提供图片的删除代理服务(COS object delete proxy)
 *
 * @Request.uri - https://s.domain.com/delete/
 */

import * as express from "express";
import * as responseTimer from "response-time";
import * as env from "../../env";
import deleteLinkHandler from "./handler";

const app = express();
app.disable("x-powered-by");

if (env.isDev) {
    app.use(responseTimer());
}

// Route
app.options("*", function(_req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendStatus(200);
    res.end();
});

app.get(/^\/delete\/([^\/]+)$/, deleteLinkHandler);

app.all("*", function(_req, res) {
    res.sendStatus(404);
    res.end();
});

// Startup
app.listen(env.DELETE_PORT, env.DELETE_HOST, err => {
    if (err) {
        return console.error(err);
    }
    console.log(`Listening at http://${env.DELETE_HOST}:${env.DELETE_PORT}`);
});
