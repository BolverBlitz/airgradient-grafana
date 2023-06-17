require('dotenv').config();
require('module-alias/register')

const port = process.env.PORT || 4000;

const { log } = require('@lib/logger');
const { writeDatapoint } = require('@lib/influx');

process.log = {};
process.log = log;

const HyperExpress = require('hyper-express');
const Joi = require('joi');

const { isAllowed } = require('@middleware/deviceCheck');

const app = new HyperExpress.Server({
    fast_buffers: process.env.HE_fast_buffers == 'false' ? false : true || false,
});

const airgradientSensor = Joi.object({
    wifi: Joi.number().min(-1024).max(0).required(),
    rco2: Joi.number().min(0).max(100_000).required(),
    pm02: Joi.number().min(0).max(100_000).required(),
    tvoc_index: Joi.number().min(0).max(100_000).required(),
    nox_index: Joi.number().min(0).max(100_000).required(),
    atmp: Joi.number().min(-60).max(100_000).required(),
    rhum: Joi.number().min(0).max(200).required(),
});

app.post('/sensors/airgradient/:chipID', isAllowed(),  async (req, res) => {
    try {
        const value = await airgradientSensor.validateAsync(await req.json());
        await writeDatapoint('airgradient', value, req.params.chipID);
        res.send('ok');
        res.status(200);
    } catch (error) {
        res.status(500);
        return (error);
    }
});

/* Handlers */
app.set_error_handler((req, res, error) => {
    res.status(500);
    res.json({
        message: error.message,
    });
});


app.listen(port)
    .then((socket) => process.log.system(`Listening on port: ${port}`))
    .catch((error) => process.log.error(`Failed to start webserver on: ${port}\nError: ${error}`));