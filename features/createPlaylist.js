/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { SlackDialog } = require('botbuilder-adapter-slack');
const runSample = require('../googleapi/googleapi-youtube');
const { run } = require('googleapis/build/src/apis/run');

module.exports = function (controller) {

    controller.on('slash_command', async (bot, message) => {
        if (message.command === '/playlist') {
            if (message.text != "")
            {
                let response = await runSample();
                console.log(response);
                await bot.reply(message, 'So I will make a playlist called "' + message.text + '"');
            }
            else
                bot.httpBody({ text: 'Tsk tsk, you need to provide a title for the playlist. (Maybe try reading the hints displayed next time)' });
        }
    });

}
