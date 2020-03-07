"use strict";
const credentials = require("./ENV.js");
const { TextAnalyticsClient, TextAnalyticsApiKeyCredential } = require("@azure/ai-text-analytics");
const textAnalyticsClient = new TextAnalyticsClient(credentials.endpoint, new TextAnalyticsApiKeyCredential(credentials.key));

async function keyPhraseExtraction(client, keyPhrasesInput) {
    keyPhrasesInput = keyPhrasesInput ? keyPhrasesInput : [];
  const keyPhraseResult = await client.extractKeyPhrases(keyPhrasesInput);
  return keyPhraseResult;
  /* keyPhraseResult.forEach(document => {
    console.log(`ID: ${document.id}`);
    console.log(`\tDocument Key Phrases: ${document.keyPhrases}`);
  }); */
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (req.query.json || (req.body && req.body.json)) {
        const json = req.query.json ? JSON.parse(req.query.json) : req.body.json;
        const keyPhraseResult = await keyPhraseExtraction(
          textAnalyticsClient,
          json
        );
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: keyPhraseResult,
          headers: {
            "Content-Type": "application/json"
          }
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};