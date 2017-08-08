import cos from "../../COS";
import { isDev } from "../../env";
import redisClient from "../redis";

// delete via visiting specified link
export default async function deleteLinkHandler(req, res) {
    const match = req.url.match(/\/delete\/([0-9a-z-]+)/i);
    let deleteKey = "";
    if (match && match.length > 1) {
        deleteKey = match[1];
    }
    if (isDev) {
        console.log(
            `${new Date().toISOString()}: Redis get image storage info using delete key ${deleteKey}`
        );
    }
    const value = await redisClient.getAsync(deleteKey).catch(err => {
        if (isDev) {
            console.log(
                `${new Date().toISOString()}: Redis get value for key ${deleteKey} failed: ${err.toString()}`
            );
        }
        res.status(500).send("Delete image failed");
    });
    if (!value) {
        res
            .status(200)
            .send("Invalid delete link or image has been deleted before");
    }

    const [bucket, region, objectName] = value.split("|");
    const params = {
        Bucket: bucket,
        Region: region,
        Key: objectName
    };

    return cos
        .deleteObject(params)
        .then(result => {
            if (result.statusCode < 200 || result.statusCode >= 300) {
                if (isDev) {
                    console.log(
                        `${new Date().toISOString()}: delete object with ${result.status} status error`
                    );
                    console.log(result);
                }
                // result.data.toString();
                res.status(result.statusCode).send("Delete image failed");
            }

            // clear redis deleteKey
            redisClient.del(deleteKey);

            res.status(200).send("Image deleted successfully");
        })
        .catch(err => {
            const msg =
                err instanceof Error ? err.message : err.response.data.message;
            if (isDev) {
                console.log(
                    `${new Date().toISOString()}: delete object with error: ${msg}`
                );
                console.log(err);
            }
            res.status(400).send(msg);
        });
}
