const fs = require('fs');

/**
 * Checks if the device is allowed to access the server
 * @returns 
 */
const isAllowed = () => {
    return async (req, res) => {
        try {
            const { chipID } = req.params;
            const allowedDevices = JSON.parse(fs.readFileSync('./data/store.json'));
            if (allowedDevices[chipID]) {
                return true;
            } else {
                // Add device to allowedDevices.json
                fs.writeFileSync('./data/store.json', JSON.stringify({ ...allowedDevices, [chipID]: false}, null, 4));
                throw new Error('Device not allowed');
            }
        } catch (error) {
            return (error);
        }
    };
};

module.exports = {
    isAllowed,
};