/**
 * 提供图片的上传代理服务(COS object upload proxy)
 *
 * @Request.uri - https://s.domain.com/upload
 */

import * as express from "express";
import * as responseTimer from "response-time";
import * as cors from "cors";
import * as env from "../../env";
import fileHandler from "./handler";

const app = express();
app.disable("x-powered-by");

if (env.isDev) {
    app.use(responseTimer());
}

// Cors
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin || env.UPLOAD_ALLOW_ORIGIN.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(`Origin ${origin} not allowed`);
        }
    }
};

// Route
app.options("*", function(_req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.sendStatus(200);
    res.end();
});

app.post("/upload", cors(corsOptions), fileHandler);

app.all("*", function(_req, res) {
    res.sendStatus(404);
    res.end();
});

// Startup
app.listen(env.UPLOAD_PORT, env.UPLOAD_HOST, err => {
    if (err) {
        return console.error(err);
    }
    console.log(`Listening at http://${env.UPLOAD_HOST}:${env.UPLOAD_PORT}`);
});
