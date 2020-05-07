'use strict';
const fetch = require('node-fetch');

module.exports.handler = async event => {
    const result = await fetch('https://www.covidvisualizer.com/api')
        .then(result => result.json());


    return {
        statusCode: 200,
        body: JSON.stringify(result.countries)
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
