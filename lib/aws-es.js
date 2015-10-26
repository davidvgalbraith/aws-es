var https = require('https');
var querystring = require('querystring');
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

AWSES.prototype._request = function(path, body, options, callback) {
    var self = this;

    if( !is.existy(callback) )
    {
        if(is.function(options))
        {
            callback = options;
            options = null;
        }
        else if(is.function(body))
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
    if( is.existy(body) && !is.json(body) && !is.array(body) ) return callback('invalid_body');

    if( !is.existy(path) ) return callback('not_path');
    if( !is.string(path) ) return callback('invalid_path');

    var opts = {
        service: self.config.service,
        region: self.config.region,
        headers: {
            'Content-Type': 'application/json'
        },
        host: self.config.host,
        path: path
    }

    if(body && is.json(body))
    {
        opts.body = JSON.stringify(body);
    }
    else if(body && is.array(body))
    {
        opts.body = '';
        body.forEach(function(obj) {
            opts.body += JSON.stringify(obj);
            opts.body += '\n';
        });
    }

    if(options && options.method)
        opts.method = options.method;

    aws4.sign(
        opts,
        {
            accessKeyId: self.config.accessKeyId,
            secretAccessKey: self.config.secretAccessKey
        }
    );

    var fullResponse = '';

    var req = https.request(opts, function(res) {
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
    req.end(opts.body || '');
};

AWSES.prototype.count = function(options, callback) {
    var self = this;

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

AWSES.prototype.index = function(options, callback) {
    var self = this;

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

    if( is.existy(options.id) && !is.string(options.id) ) return callback('invalid_id');

    if( !is.existy(options.body) ) return callback('not_body');
    if( !is.json(options.body) ) return callback('invalid_body');

    var path = '/' + options.index + '/' + options.type;
    if(options.id)
        path += '/' + options.id;

    self._request(path, options.body, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.update = function(options, callback) {
    var self = this;

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

    if( !is.existy(options.id) ) return callback('not_id');
    if( !is.string(options.id) ) return callback('invalid_id');

    if( !is.existy(options.body) ) return callback('not_body');
    if( !is.json(options.body) ) return callback('invalid_body');

    var path = '/' + options.index + '/' + options.type + '/' + options.id + '/_update';
    self._request(path, options.body, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.bulk = function(options, callback) {
    var self = this;

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

    if( !is.existy(options.body) ) return callback('not_body');
    if( !is.array(options.body) || (options.body.length == 0) ) return callback('invalid_body');

    var path = '/' + options.index + '/' + options.type + '/_bulk';
    self._request(path, options.body, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.search = function(options, callback) {
    var self = this;

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

    if( !is.existy(options.body) ) return callback('not_body');
    if( !is.json(options.body) ) return callback('invalid_body');

    if( is.existy(options.scroll) && !is.string(options.scroll) ) return callback('invalid_scroll');
    if( is.existy(options.searchType) && !is.string(options.searchType) ) return callback('invalid_searchType');
    if( is.existy(options.defaultOperator) && !is.string(options.defaultOperator) ) return callback('invalid_defaultOperator');
    if( is.existy(options.size) && !is.integer(options.size) ) return callback('invalid_size');
    if( is.existy(options.from) && !is.integer(options.from) ) return callback('invalid_from');
    if( is.existy(options.sort) && !is.string(options.sort) ) return callback('invalid_sort');

    var qs = {};
    if(options.scroll) qs.scroll = options.scroll;
    if(options.searchType) qs.search_type = options.searchType;
    if(options.size) qs.size = options.size;
    if(options.from) qs.from = options.from;
    if(options.sort) qs.sort = options.sort;

    if( is.existy(options.defaultOperator) && is.existy(options.body)
        && is.existy(options.body.query) && is.existy(options.body.query.query_string))
        options.body.query.query_string.default_operator = options.defaultOperator;

    var path = '/' + options.index + '/' + options.type + '/_search';
    path += '/?' + querystring.stringify(qs);

    self._request(path, options.body, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.scroll = function(options, callback) {
    var self = this;

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

    if( !is.existy(options.scroll) ) return callback('not_scroll');
    if( !is.string(options.scroll) ) return callback('invalid_scroll');

    if( !is.existy(options.scrollId) ) return callback('not_scrollId');
    if( !is.string(options.scrollId) ) return callback('invalid_scrollId');

    var path = '/_search/scroll?scroll=' + options.scroll + '&scroll_id=' + options.scrollId;

    self._request(path, null, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.get = function(options, callback) {
    var self = this;

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

    if( !is.existy(options.id) ) return callback('not_id');
    if( !is.string(options.id) ) return callback('invalid_id');

    var path = '/' + options.index + '/' + options.type + '/' + options.id;
    self._request(path, null, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.mget = function(options, callback) {
    var self = this;

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

    if( !is.existy(options.body) ) return callback('not_body');
    if( !is.json(options.body) ) return callback('invalid_body');

    var path = '/' + options.index + '/' + options.type + '/_mget';
    self._request(path, options.body, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

AWSES.prototype.delete = function(options, callback) {
    var self = this;

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

    if( is.existy(options.type) && !is.string(options.type) ) return callback('invalid_type');

    if( is.existy(options.type) && is.existy(options.id) && !is.string(options.id) ) return callback('invalid_id');

    var path = '/' + options.index;

    if(options.type)
        path += '/'+options.type;

    if(options.id)
        path += '/'+options.id;

    self._request(path, null, {method: 'DELETE'}, function(err, data) {
        if(err) return callback(err);
        return callback(null, data);
    });
};

module.exports = AWSES;
