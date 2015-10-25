var expect = require('chai').expect;
var is = require('is_js');
var AWSES = require(__dirname + '/../../lib/aws-es');

var config = {
	accessKeyId: 'KEY',
	secretAccessKey: 'SECRET',
    service: 'es',
    region: 'REGION',
	host: 'DOMAIN_ENDPOINT'
};
var INDEX = 'testindex';
var TYPE = 'posts';

describe('aws-es', function() {

    describe('init', function() {

        it('should throw an error for no config', function() {
            var fn = function(){ new AWSES(); };
            expect(fn).to.throw('not_config');
        });

        it('should throw an error for invalid config', function() {
            var fn = function(){ new AWSES([]); };
            expect(fn).to.throw('invalid_config');
        });

        it('should throw an error for no accessKeyId', function() {
            var fn = function(){ new AWSES({}); };
            expect(fn).to.throw('not_accessKeyId');
        });

        it('should throw an error for invalid accessKeyId', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: 123
                });
            };
            expect(fn).to.throw('invalid_accessKeyId');
        });

        it('should throw an error for no secretAccessKey', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123'
                });
            };
            expect(fn).to.throw('not_secretAccessKey');
        });

        it('should throw an error for invalid secretAccessKey', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: 123
                });
            };
            expect(fn).to.throw('invalid_secretAccessKey');
        });

        it('should throw an error for no service', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: '123'
                });
            };
            expect(fn).to.throw('not_service');
        });

        it('should throw an error for invalid service', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: '123',
                    service: 123
                });
            };
            expect(fn).to.throw('invalid_service');
        });

        it('should throw an error for no region', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: '123',
                    service: '123'
                });
            };
            expect(fn).to.throw('not_region');
        });

        it('should throw an error for invalid region', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: '123',
                    service: '123',
                    region: 123
                });
            };
            expect(fn).to.throw('invalid_region');
        });

        it('should throw an error for not host', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: '123',
                    service: '123',
                    region: '123'
                });
            };
            expect(fn).to.throw('not_host');
        });

        it('should throw an error for invalid host', function() {
            var fn = function(){
                new AWSES({
                    accessKeyId: '123',
                    secretAccessKey: '123',
                    service: '123',
                    region: '123',
                    host: 123
                });
            };
            expect(fn).to.throw('invalid_host');
        });

        it('should succeed', function() {
            var fn = function() {
                var elasticsearch = new AWSES({
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                    service: config.service,
                    region: config.region,
                    host: config.host
                });
            };
            expect(fn).to.not.throw(Error);
        });
    });

    describe('_request', function() {

        var elasticsearch = null;

        before(function(done) {
            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
            done();
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch._request(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch._request('', '', 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for invalid body', function() {
            elasticsearch._request('a path', 'invalid body', function(err, data) {
                expect(err).to.be.equal('invalid_body');
            });
        });

        it('should return an error for invalid path', function() {
            elasticsearch._request(['invalid path'], function(err, data) {
                expect(err).to.be.equal('invalid_path');
            });
        });

        it('should return a valid JSON reply', function(done) {
            this.timeout(20000);

            elasticsearch._request('/', function(err, data) {
                expect(err).to.be.null;
                expect(is.json(data)).to.be.true;
                done();
            });
        });
    });

    describe('count', function() {

        var elasticsearch = null;

        before(function(done) {
			this.timeout(20000);

            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
                expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE,
					{
						title: 'hello world'
					},
				function(err, data) {
	                expect(err).to.be.null;
					done();
	            });
            });
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch.count(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch.count({}, 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for no options', function() {
            elasticsearch.count(function(err, data) {
                expect(err).to.be.equal('not_options');
            });
        });

        it('should return an error for invalid options', function() {
            elasticsearch.count([], function(err, data) {
                expect(err).to.be.equal('invalid_options');
            });
        });

		it('should return an error for no index', function() {
            elasticsearch.count({}, function(err, data) {
                expect(err).to.be.equal('not_index');
            });
        });

		it('should return an error for invalid index', function() {
            elasticsearch.count({
				index: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_index');
            });
        });

		it('should return an error for no type', function() {
            elasticsearch.count({
				index: INDEX
			}, function(err, data) {
                expect(err).to.be.equal('not_type');
            });
        });

		it('should return an error for invalid type', function() {
            elasticsearch.count({
				index: INDEX,
				type: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_type');
            });
        });

		it('should return an error for invalid body', function() {
            elasticsearch.count({
				index: INDEX,
				type: TYPE,
				body: []
			}, function(err, data) {
                expect(err).to.be.equal('invalid_body');
            });
        });

		it('should succeed', function(done) {
			this.timeout(20000);

            elasticsearch.count({
				index: INDEX,
				type: TYPE,
				body: {
					query: {
				    	match_all: {}
					}
				}
			}, function(err, data) {
                expect(err).to.be.null;
				expect(is.existy(data.count)).to.be.true;
				done();
            });
        });
    });

	describe('update', function() {

        var elasticsearch = null;

        before(function(done) {
			this.timeout(20000);

            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
                expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE+'/'+'1',
					{
						title: 'hello world'
					},
				function(err, data) {
	                expect(err).to.be.null;
					done();
	            });
            });
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch.update(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch.update({}, 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for no options', function() {
            elasticsearch.update(function(err, data) {
                expect(err).to.be.equal('not_options');
            });
        });

        it('should return an error for invalid options', function() {
            elasticsearch.update([], function(err, data) {
                expect(err).to.be.equal('invalid_options');
            });
        });

		it('should return an error for no index', function() {
            elasticsearch.update({}, function(err, data) {
                expect(err).to.be.equal('not_index');
            });
        });

		it('should return an error for invalid index', function() {
            elasticsearch.update({
				index: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_index');
            });
        });

		it('should return an error for no type', function() {
            elasticsearch.update({
				index: INDEX
			}, function(err, data) {
                expect(err).to.be.equal('not_type');
            });
        });

		it('should return an error for invalid type', function() {
            elasticsearch.update({
				index: INDEX,
				type: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_type');
            });
        });

		it('should return an error for no id', function() {
            elasticsearch.update({
				index: INDEX,
				type: TYPE
			}, function(err, data) {
                expect(err).to.be.equal('not_id');
            });
        });

		it('should return an error for invalid id', function() {
            elasticsearch.update({
				index: INDEX,
				type: TYPE,
				id: 1
			}, function(err, data) {
                expect(err).to.be.equal('invalid_id');
            });
        });

		it('should return an error for no body', function() {
            elasticsearch.update({
				index: INDEX,
				type: TYPE,
				id: '1'
			}, function(err, data) {
                expect(err).to.be.equal('not_body');
            });
        });

		it('should return an error for invalid body', function() {
            elasticsearch.update({
				index: INDEX,
				type: TYPE,
				id: '1',
				body: []
			}, function(err, data) {
                expect(err).to.be.equal('invalid_body');
            });
        });

		it('should succeed', function(done) {
			this.timeout(20000);

            elasticsearch.update({
				index: INDEX,
				type: TYPE,
				id: '1',
				body: {
					title: 'new title'
				}
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.created).to.be.false;
				expect(data._version).to.be.above(1);
				done();
            });
        });
    });

	describe('bulk', function() {

        var elasticsearch = null;

        before(function(done) {
			this.timeout(20000);

            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
                expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE+'/'+'1',
					{
						title: 'hello world'
					},
				function(err, data) {
	                expect(err).to.be.null;
					done();
	            });
            });
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch.bulk(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch.bulk({}, 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for no options', function() {
            elasticsearch.bulk(function(err, data) {
                expect(err).to.be.equal('not_options');
            });
        });

        it('should return an error for invalid options', function() {
            elasticsearch.bulk([], function(err, data) {
                expect(err).to.be.equal('invalid_options');
            });
        });

		it('should return an error for no index', function() {
            elasticsearch.bulk({}, function(err, data) {
                expect(err).to.be.equal('not_index');
            });
        });

		it('should return an error for invalid index', function() {
            elasticsearch.bulk({
				index: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_index');
            });
        });

		it('should return an error for no type', function() {
            elasticsearch.bulk({
				index: INDEX
			}, function(err, data) {
                expect(err).to.be.equal('not_type');
            });
        });

		it('should return an error for invalid type', function() {
            elasticsearch.bulk({
				index: INDEX,
				type: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_type');
            });
        });

		it('should return an error for no body', function() {
            elasticsearch.bulk({
				index: INDEX,
				type: TYPE
			}, function(err, data) {
                expect(err).to.be.equal('not_body');
            });
        });

		it('should return an error for invalid body', function() {
            elasticsearch.bulk({
				index: INDEX,
				type: TYPE,
				body: []
			}, function(err, data) {
                expect(err).to.be.equal('invalid_body');
            });
        });

		it('should succeed', function(done) {
			this.timeout(20000);

			var ops = [];
			ops.push({ update: { _id : '1' }});
			ops.push({ doc: { title: 'brand new' }});

            elasticsearch.bulk({
				index: INDEX,
				type: TYPE,
				body: ops
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.errors).to.be.false;
				expect(data.items[0].update.status).to.be.equal(200);
				done();
            });
        });
    });

	describe('search', function() {

        var elasticsearch = null;

        before(function(done) {
			this.timeout(20000);

            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
                expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE+'/'+'1',
					{
						title: 'hello world'
					},
				function(err, data) {
	                expect(err).to.be.null;
					done();
	            });
            });
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch.search(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch.search({}, 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for no options', function() {
            elasticsearch.search(function(err, data) {
                expect(err).to.be.equal('not_options');
            });
        });

        it('should return an error for invalid options', function() {
            elasticsearch.search([], function(err, data) {
                expect(err).to.be.equal('invalid_options');
            });
        });

		it('should return an error for no index', function() {
            elasticsearch.search({}, function(err, data) {
                expect(err).to.be.equal('not_index');
            });
        });

		it('should return an error for invalid index', function() {
            elasticsearch.search({
				index: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_index');
            });
        });

		it('should return an error for no type', function() {
            elasticsearch.search({
				index: INDEX
			}, function(err, data) {
                expect(err).to.be.equal('not_type');
            });
        });

		it('should return an error for invalid type', function() {
            elasticsearch.search({
				index: INDEX,
				type: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_type');
            });
        });

		it('should return an error for no body', function() {
            elasticsearch.search({
				index: INDEX,
				type: TYPE
			}, function(err, data) {
                expect(err).to.be.equal('not_body');
            });
        });

		it('should return an error for invalid body', function() {
            elasticsearch.search({
				index: INDEX,
				type: TYPE,
				body: []
			}, function(err, data) {
                expect(err).to.be.equal('invalid_body');
            });
        });

		it('should succeed', function(done) {
			this.timeout(20000);

            elasticsearch.search({
				index: INDEX,
				type: TYPE,
				body: {
					query: {
				    	match_all: {}
					}
				}
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.hits.total).to.be.above(0);
				done();
            });
        });

		it('should succeed with scroll', function(done) {
			this.timeout(20000);

            elasticsearch.search({
				index: INDEX,
				type: TYPE,
				body: {
					query: {
				    	match_all: {}
					}
				},
				scroll: '1ms'
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.hits.total).to.be.above(0);
				expect(data._scroll_id).to.be.a('string');
				done();
            });
        });

		it('should succeed with scroll-scan', function(done) {
			this.timeout(20000);

            elasticsearch.search({
				index: INDEX,
				type: TYPE,
				body: {
					query: {
				    	match_all: {}
					}
				},
				scroll: '1ms',
				search_type: 'scan'
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.hits.total).to.be.above(0);
				expect(data._scroll_id).to.be.a('string');
				done();
            });
        });
    });

	describe('scroll', function() {

		var elasticsearch = null;

		before(function(done) {
			this.timeout(20000);

			elasticsearch = new AWSES({
				accessKeyId: config.accessKeyId,
				secretAccessKey: config.secretAccessKey,
				service: config.service,
				region: config.region,
				host: config.host
			});
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
				expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE+'/'+'1',
					{
						title: 'hello world'
					},
				function(err, data) {
					expect(err).to.be.null;
					done();
				});
			});
		});

		it('should throw an error for no callback', function() {
			var fn = function(){ elasticsearch.scroll(); };
			expect(fn).to.throw('not_callback');
		});

		it('should throw an error for invalid callback', function() {
			var fn = function(){ elasticsearch.scroll({}, 'callback'); };
			expect(fn).to.throw('invalid_callback');
		});

		it('should return an error for no options', function() {
			elasticsearch.scroll(function(err, data) {
				expect(err).to.be.equal('not_options');
			});
		});

		it('should return an error for invalid options', function() {
			elasticsearch.scroll([], function(err, data) {
				expect(err).to.be.equal('invalid_options');
			});
		});

		it('should return an error for no scroll', function() {
			elasticsearch.scroll({}, function(err, data) {
				expect(err).to.be.equal('not_scroll');
			});
		});

		it('should return an error for invalid scroll', function() {
			elasticsearch.scroll({
				scroll: 1
			}, function(err, data) {
				expect(err).to.be.equal('invalid_scroll');
			});
		});

		it('should return an error for no scrollId', function() {
			elasticsearch.scroll({
				scroll: '1ms'
			}, function(err, data) {
				expect(err).to.be.equal('not_scrollId');
			});
		});

		it('should return an error for invalid scrollId', function() {
			elasticsearch.scroll({
				scroll: '1ms',
				scrollId: 123
			}, function(err, data) {
				expect(err).to.be.equal('invalid_scrollId');
			});
		});

		it('should succeed with scroll', function(done) {
			this.timeout(20000);

			elasticsearch.search({
				index: INDEX,
				type: TYPE,
				body: {
					query: {
						match_all: {}
					}
				},
				scroll: '1ms'
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.hits.total).to.be.above(0);
				expect(data._scroll_id).to.be.a('string');
				elasticsearch.scroll({
					scroll: '1ms',
					scrollId: data._scroll_id
				}, function(err, data) {
					expect(err).to.be.null;
					done();
				});
			});
		});
	});

	describe('get', function() {

        var elasticsearch = null;

        before(function(done) {
			this.timeout(20000);

            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
                expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE+'/'+'1',
					{
						title: 'hello world'
					},
				function(err, data) {
	                expect(err).to.be.null;
					done();
	            });
            });
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch.get(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch.get({}, 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for no options', function() {
            elasticsearch.get(function(err, data) {
                expect(err).to.be.equal('not_options');
            });
        });

        it('should return an error for invalid options', function() {
            elasticsearch.get([], function(err, data) {
                expect(err).to.be.equal('invalid_options');
            });
        });

		it('should return an error for no index', function() {
            elasticsearch.get({}, function(err, data) {
                expect(err).to.be.equal('not_index');
            });
        });

		it('should return an error for invalid index', function() {
            elasticsearch.get({
				index: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_index');
            });
        });

		it('should return an error for no type', function() {
            elasticsearch.get({
				index: INDEX
			}, function(err, data) {
                expect(err).to.be.equal('not_type');
            });
        });

		it('should return an error for invalid type', function() {
            elasticsearch.get({
				index: INDEX,
				type: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_type');
            });
        });

		it('should return an error for no id', function() {
            elasticsearch.get({
				index: INDEX,
				type: TYPE
			}, function(err, data) {
                expect(err).to.be.equal('not_id');
            });
        });

		it('should return an error for invalid id', function() {
            elasticsearch.get({
				index: INDEX,
				type: TYPE,
				id: 1
			}, function(err, data) {
                expect(err).to.be.equal('invalid_id');
            });
        });

		it('should succeed', function(done) {
			this.timeout(20000);

            elasticsearch.get({
				index: INDEX,
				type: TYPE,
				id: '1'
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data._id).to.be.equal('1');
				done();
            });
        });
    });

	describe('mget', function() {

        var elasticsearch = null;

        before(function(done) {
			this.timeout(20000);

            elasticsearch = new AWSES({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                service: config.service,
                region: config.region,
                host: config.host
            });
			// create test index
			elasticsearch._request('/'+INDEX, function(err, data) {
                expect(err).to.be.null;
				// create new document
				elasticsearch._request(
					'/'+INDEX+'/'+TYPE+'/'+'1',
					{
						title: 'hello world'
					},
				function(err, data) {
	                expect(err).to.be.null;
					done();
	            });
            });
        });

        it('should throw an error for no callback', function() {
            var fn = function(){ elasticsearch.mget(); };
            expect(fn).to.throw('not_callback');
        });

        it('should throw an error for invalid callback', function() {
            var fn = function(){ elasticsearch.mget({}, 'callback'); };
            expect(fn).to.throw('invalid_callback');
        });

        it('should return an error for no options', function() {
            elasticsearch.mget(function(err, data) {
                expect(err).to.be.equal('not_options');
            });
        });

        it('should return an error for invalid options', function() {
            elasticsearch.mget([], function(err, data) {
                expect(err).to.be.equal('invalid_options');
            });
        });

		it('should return an error for no index', function() {
            elasticsearch.mget({}, function(err, data) {
                expect(err).to.be.equal('not_index');
            });
        });

		it('should return an error for invalid index', function() {
            elasticsearch.mget({
				index: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_index');
            });
        });

		it('should return an error for no type', function() {
            elasticsearch.mget({
				index: INDEX
			}, function(err, data) {
                expect(err).to.be.equal('not_type');
            });
        });

		it('should return an error for invalid type', function() {
            elasticsearch.mget({
				index: INDEX,
				type: 123
			}, function(err, data) {
                expect(err).to.be.equal('invalid_type');
            });
        });

		it('should return an error for no ids', function() {
            elasticsearch.mget({
				index: INDEX,
				type: TYPE
			}, function(err, data) {
                expect(err).to.be.equal('not_ids');
            });
        });

		it('should return an error for invalid ids', function() {
            elasticsearch.mget({
				index: INDEX,
				type: TYPE,
				ids: '1'
			}, function(err, data) {
                expect(err).to.be.equal('invalid_ids');
            });
        });

		it('should succeed', function(done) {
			this.timeout(20000);

            elasticsearch.mget({
				index: INDEX,
				type: TYPE,
				ids: ['1']
			}, function(err, data) {
				expect(err).to.be.null;
				expect(data.docs[0]._id).to.be.equal('1');
				done();
            });
        });
    });
});
