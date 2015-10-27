**AWS-ES**
======

AWS-ES is a Node.js binding for Amazon's [Elasticsearch service](https://aws.amazon.com/elasticsearch-service/) which requires Amazon's [Signature Version 4](http://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).

The binding is almost identical to the '[elasticsearch](https://www.npmjs.com/package/elasticsearch)' package to guarantee minimal changes in the code when moving from your Elasticsearch server to Amazon's Elasticsearch service. Currently, it supports the basic functionalities but they can probably get your app up and running in no-time.

This package was initially created to be used by [Notify.ly](https://notify.ly/) and [Crowd Analyzer](http://crowdanalyzer.com/). But you can use it as you like, under the Apache 2.0 license.

**How to use:**
---------
First, install the *aws-es* package.

    npm install aws-es --save

Require the package:

    var Elasticsearch = require('aws-es');

Initialization:

    elasticsearch = new Elasticsearch({
			accessKeyId: yourAccessKeyId,
			secretAccessKey: yourSecretAccessKey,
			service: 'es',
			region: yourServiceRegion,
			host: yourServiceHost
		});

**Examples:**
---------

**Index**

    elasticsearch.index({
				index: 'blog',
				type: 'posts',
				id: '1',
				body: {
					title: 'manually set id',
					shares: 10
				}
			}, function(err, data) {
				console.log('json reply received');
            });

    elasticsearch.index({
				index: 'blog',
				type: 'posts',
				body: {
					title: 'auto set id',
					shares: 5
				}
			}, function(err, data) {
				console.log('json reply received');
            });



**Get**

    elasticsearch.get({
				index: 'blog',
				type: 'posts',
				id: '1'
			}, function(err, data) {
				console.log('json reply received');
            });



**mGet**

    elasticsearch.mget({
				index: 'blog',
				type: 'posts',
				body: {
					ids: ['1', '2']
				}
			}, function(err, data) {
				console.log('json reply received');
            });



**Update**

    elasticsearch.update({
				index: 'blog',
				type: 'posts',
				id: '1',
				body: {
					doc: {
						title: 'new title'
					}
				}
			}, function(err, data) {
				console.log('json reply received');
            });



**Count**

    elasticsearch.count({
				index: 'blog',
				type: 'posts',
				body: {
					query: {
				    	match_all: {}
					}
				}
			}, function(err, data) {
                console.log('json reply received');
            });



**Search**

    elasticsearch.search({
				index: 'blog',
				type: 'posts',
				body: {
					query: {
				    	match_all: {}
					}
				}
			}, function(err, data) {
				console.log('json reply received');
            });

    elasticsearch.search({
				index: 'blog',
				type: 'posts',
				body: {
					query: {
				    	match_all: {}
					}
				},
				sort: 'shares:desc'
			}, function(err, data) {
				console.log('json reply received');
            });

    elasticsearch.search({
				index: 'blog',
				type: 'posts',
				body: {
					query: {
						query_string: {
							query: 'second title'
						}
					}
				},
				defaultOperator: 'AND'
			}, function(err, data) {
				console.log('json reply received');
			});



**Scroll**

    elasticsearch.search({
				index: 'blog',
				type: 'posts',
				body: {
					query: {
						match_all: {}
					}
				},
				scroll: '1ms'
			}, function(err, data) {
				console.log('json reply received');
				// scroll once, or you can recursively scroll
				elasticsearch.scroll({
					scroll: '1ms',
					scrollId: data._scroll_id
				}, function(err, data) {
					console.log('json reply received');
				});
			});


**Bulk**

	var ops = [];
	ops.push({ update: { _id : '1' }});
	ops.push({ doc: { title: 'brand new title' }});

	elasticsearch.bulk({
				index: 'blog',
				type: 'posts',
				body: ops
			}, function(err, data) {
				console.log('json reply received');
            });



**Delete**

    // delete a document
    elasticsearch.delete({
				index: 'blog',
				type: 'posts',
				id: '1'
			}, function(err, data) {
				console.log('json reply received');
            });

    // delte an index
    elasticsearch.delete({
				index: 'blog'
			}, function(err, data) {
				console.log('json reply received');
            });
