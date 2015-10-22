var https = require('https');
var aws4  = require('aws4');
var is = require('is_js');

function AWSES(config) {
    if( !is.existy(config) ) throw new Error('not_config');
    if( !is.json(config) ) throw new Error('invalid_config');

    if( !is.existy(config.accessKeyId) ) throw new Error('not_accessKeyId');
    if( !is.string(config.accessKeyId) ) throw new Error('invalid_accessKeyId');

    if( !is.existy(config.secretAccessKey) ) throw new Error('not_secretAccessKey');
    if( !is.string(config.secretAccessKey) ) throw new Error('invalid_secretAccessKey');

    if( !is.existy(config.service) ) throw new Error('not_service');
    if( !is.string(config.service) ) throw new Error('invalid_service');

    if( !is.existy(config.region) ) throw new Error('not_region');
    if( !is.string(config.region) ) throw new Error('invalid_region');

    if( !is.existy(config.host) ) throw new Error('not_host');
    if( !is.string(config.host) ) throw new Error('invalid_host');

    this.config = config;
};

AWSES.prototype._request = function(path, body, callback) {
    self = this;

    if( !is.existy(callback) )
    {
        if(is.function(body))
        {
            callback = body;
            body = null;
        }
        else if(is.function(path))
        {
            callback = path;
            path = null;
        }
    }

    if( !is.existy(callback) ) throw new Error('not_callback');
    if( !is.function(callback) ) throw new Error('invalid_callback');

    if( !is.existy(body) ) body = null;
    if( is.existy(body) && !is.json(body) ) return callback('invalid_body');

    if( !is.existy(path) ) return callback('not_path');
    if( !is.string(path) ) return callback('invalid_path');

    var options = {
        service: self.config.service,
        region: self.config.region,
        host: self.config.host,
        path: path,
        body: JSON.stringify(body)
    }

    aws4.sign(
        options,
        {
            accessKeyId: self.config.accessKeyId,
            secretAccessKey: self.config.secretAccessKey
        }
    );

    var fullResponse = '';

    var req = https.request(options, function(res) {
        res.on('data', function (chunk) {
            fullResponse += chunk;
        });
        res.on('end', function() {
            try {
                return callback(null, JSON.parse(fullResponse));
            } catch (e) {
                return callback(e);
            }
        });
    });
    req.on('error', function(e) {
        return callback(e.message, null);
    });
    req.end(options.body || '');
};

AWSES.prototype.count = function(options, callback) {
    self = this;

    if( !is.existy(callback) )
    {
        if(is.function(options))
        {
            callback = options;
            options = null;
        }
    }

    if( !is.existy(callback) ) throw new Error('not_callback');
    if( !is.function(callback) ) throw new Error('invalid_callback');

    if( !is.existy(options) ) return callback('not_options');
    if( !is.json(options) ) return callback('invalid_options');

    if( !is.existy(options.index) ) return callback('not_index');
    if( !is.string(options.index) ) return callback('invalid_index');

    if( !is.existy(options.type) ) return callback('not_type');
    if( !is.string(options.type) ) return callback('invalid_type');

    if( is.existy(options.body) && !is.json(options.body) ) return callback('invalid_body');

    var path = '/' + options.index + '/' + options.type + '/_count';
    self._request(path, options.body, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

module.exports = AWSES;
