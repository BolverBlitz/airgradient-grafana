const Influxdb = require('influxdb-v2');

const db = new Influxdb({
    host: process.env.Influx_Host,
    protocol: process.env.Influx_Protocol,
    port: process.env.Influx_Port,
    token: process.env.Influx_Token
});

/**
 * Write one Datapoint to influxdb
 * @param {String|Number} measurement 
 * @param {String|Number} value 
 * @param {String} host 
 */
const writeDatapoint = (measurement, value, host) => {
    return new Promise(async (resolve, reject) => {
        resolve(await db.write(
            {
                precision: 's',
                bucket: process.env.bucket,
                org: process.env.orga
            }, [{
                measurement: measurement,
                tags: { host: host },
                fields: value
            }]
        ))
    })
}

module.exports = {
    writeDatapoint
}