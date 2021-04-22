/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { SlackDialog } = require('botbuilder-adapter-slack');

module.exports = function(controller) {

    controller.on('slash_command', async(bot, message) => {
        if (message.command === '/playlist') {
            await bot.reply(message, 'So I will make a playlist called "' + message.text + '"');
        }
    });

}
