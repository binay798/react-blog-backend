const url = require('url');

const getUrl = (req) => {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    })
}

module.exports = getUrl;