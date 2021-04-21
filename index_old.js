let { Botkit } = require('botkit');
const { SlackAdapter } = require('botbuilder-adapter-slack');
require('dotenv').config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
    console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
    process.exit(1);
} else {
    console.log('Good job, you have the variables!')
}

const adapter = new SlackAdapter({
    clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
    botToken: process.env.BOT_TOKEN
});

const controller = new Botkit({
    adapter,
    json_file_store: './ db_slackbutton_slash_command /',
    debug: true
});

// controller.configureSlackApp({
//     clientId: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
//     scopes: ['commands', 'bot'],
// })

var bot = controller.spawn({
    token: process.env.BOT_TOKEN,
    incoming_webhook: {
        url: 'WE_WILL_GET_TO_THIS'
    }
}).startRTM();

controller.setupWebserver(process.env.PORT, function (err, webserver) {
    controller.createWebhookEndpoints(controller.webserver);
    controller.createOauthEndpoints(controller.webserver,
        function (err, req, res) {
            if (err) {
                res.status(500).send('ERROR: ' + err);
            } else {
                res.send('Success!');
            }
        });
});

controller.hears('hi', 'direct_message', function (bot, message) {
    bot.reply(message, 'Hello.');
});

controller.on('slash_command', function (bot, message) {
    bot.replyAcknowledge()
    switch (message.command) {
        case '/echo':
            bot.reply(message, 'heard ya!')
            break;
        default:
            bot.reply(message, 'Did not recognize that command, sorry!')
    }
});