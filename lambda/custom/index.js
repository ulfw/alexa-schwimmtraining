/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.185fd685-e094-45e9-9a63-f89c4ba194b0';

const SKILL_NAME = 'nächstes Training';
const GET_MESSAGE = 'Das nächste Training ist';
const HELP_MESSAGE = 'Frag mich, wann das nächste Schwimmtraining ist.';
const HELP_REPROMPT = 'Wie kann ich Dir helfen?';
const STOP_MESSAGE = 'Auf Wiedersehen!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const termine = [
    { timestamp: 147600, message: 'Dienstag, 17 Uhr' },
    { timestamp: 315000, message: 'Donnerstag, 15 Uhr 30' },
    { timestamp: 400500, message: 'Freitag, 15 Uhr 15' },
    { timestamp: 464400, message: 'Samstag, 9 Uhr' },
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('NextTraining');
    },
    'NextTraining': function () {
        var lastEventOfWeek=0;
        termine.forEach(function(item){
            if(item.timestamp > lastEventOfWeek){
                lastEventOfWeek = item.timestamp;
            }
        });

        var item, d = new Date();
        var currentDate = parseInt(d.getTime()/1000);
        d.setDate(d.getDate() - d.getDay());
        var lastEventOfWeekTimestamp = parseInt(d.getTime()/1000) + parseInt(lastEventOfWeek);

        if(currentDate > lastEventOfWeekTimestamp){
            d.setDate(d.getDate() + (7 - d.getDay()));
        }
        d.setHours(0,0,0,0);
        var weekStart = parseInt(d.getTime()/1000);

        for (var i=0; i < termine.length; i++) {
            item = termine[i];
            var trainingTimestamp = (parseInt(weekStart) + parseInt(item.timestamp));
            if (currentDate < trainingTimestamp) break;
        }

        const termin = item;
        const speechOutput = GET_MESSAGE + " " + termin.message;

        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
