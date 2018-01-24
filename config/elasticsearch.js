const elasticsearch = require('elasticsearch');

//TODO configure according to env - dev or prod!
var client = new elasticsearch.Client(
    {
        host: 'localhost:9200',
        log: 'trace'
    }
);

exports.createIndex = function (indexName) {
  return client.indices.create({
      index : indexName
  })
};

exports.addDocument = function (indexName, type, data) {
  return client.index({
      index: indexName,
      type: type,
      body: data
  })
};

exports.indexExists = function (indexName) {
    return client.indices.exists({
        index: indexName
    })
};

exports.addMapping = function (indexName, type, schema) {
    return client.indices.putMapping({
        index: indexName,
        type: type,
        body: schema
    })
};