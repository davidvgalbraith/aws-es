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
            this.timeout(10000);

            elasticsearch._request('/', function(err, data) {
                expect(err).to.be.null;
                expect(is.json(data)).to.be.true;
                done();
            });
        })
    })
});
