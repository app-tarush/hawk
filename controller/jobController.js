var agenda = require("../config/agenda");
const api = require('axios');
var es = require("../config/elasticsearch");
const dateTime = require('date-time');

var Metric = function (id, data) {
    this.timestamp = dateTime({local: false, showTimeZone: true});
    this.id = id;
    this.data = data;
};

exports.schedule = function (req, res) {
    agenda.define(req.body.jobName, function (job) {
        job.attrs.data = req.body;
        api.get(job.attrs.data.url, {
            headers: {
                'accept': 'application/json',
                'accept-language': 'en_US',
                'content-type': 'application/json'
            }
        }).then(function (response) {
            var metric = new Metric(job.attrs._id, response.data);
            var indexName = job.attrs.data.index;
            var type = job.attrs.data.type;
            es.indexExists(indexName).then(function (exists) {
                if (!exists) {
                    return es.createIndex(indexName).then(function () {
                        var mapping = JSON.parse(job.attrs.data.responseSchemaMapping);
                        if (Object.keys(mapping).length === 0) {
                            console.log("response schema mapping not defined!");
                        } else {
                            es.addMapping(indexName, type, mapping);
                        }
                    });
                }
            }).then(function () {
                return es.addDocument(indexName, type, metric);
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        });
    });
    agenda.every(req.body.frequency, req.body.jobName);
    res.sendStatus(201);
};