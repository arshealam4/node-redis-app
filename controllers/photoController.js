const axios = require("axios");
const redis = require('redis')

    // create and connect redis client to local instance.
    const client = redis.createClient(6379)
 
    // echo redis errors to the console
    client.on('error', (err) => {
        console.log("Error " + err)
    });

    
module.exports.getAll = async (req, res) => {

// key to store results in Redis store
    const photosRedisKey = 'photoKey';

    try {

        return client.get(photosRedisKey, async(err, photos) => {
            if (err) {
                console.log("==err==", err);
                res.send(err);
            }
            if (photos) {
                return res.json({ source: 'cache', data: JSON.parse(photos) })
            } else {
                let response = await axios('https://jsonplaceholder.typicode.com/photos');
    
                client.setex(photosRedisKey, 3600, JSON.stringify(response.data))
    
                return res.json({ source: 'api', data: response.data })
            }
        });
    } catch(err) {
        console.log("err", err);
        res.send({success: false, err: err});
    }
}