const fetch = require("node-fetch");

module.exports.handler = async () => {
  const data = await fetch("https://www.covidvisualizer.com/api")
    .then((result) => result.json());

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(data),
  };
};
