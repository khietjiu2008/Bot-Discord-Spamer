// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Kiểm tra ping của bot đến Discord API.',
    async execute(message, client) {
        const sent = await message.reply("Pinging...");
        sent.edit(`Pong! Latency is ${sent.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms.`);
    }
};
