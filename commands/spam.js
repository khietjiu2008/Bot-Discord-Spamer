// commands/spam.js
const fs = require("fs");

module.exports = {
    name: 'spam',
    description: 'Bắt đầu hoặc dừng spam tin nhắn.',
    execute(message, client, config, args) {
        if (!args || args.length === 0 || args[0].toLowerCase() === 'start') {
            startSpam(client, message, config);
        } else if (args[0].toLowerCase() === 'stop') {
            stopSpam(client, message);
        } else {
            message.reply("Sử dụng lệnh `!spam` để bắt đầu hoặc dừng spam tin nhắn.");
        }
    }
};

function startSpam(client, message, config) {
    if (!client.spamInterval) {
        client.user.setStatus("invisible");

        const messagesPath = "./commands/data/messages.txt";
        let messages = [];
        try {
            messages = fs.readFileSync(messagesPath, "utf-8").split("\n");
        } catch (error) {
            console.error("Không thể đọc tin nhắn từ tệp", error);
            return;
        }

        let messageIndex = 0;
        client.spamInterval = setInterval(() => {
            if (messageIndex < messages.length) {
                message.channel.send(messages[messageIndex])
                    .catch(err => console.error(err));
                messageIndex++;
            } else {
                clearInterval(client.spamInterval);
                console.log("Hoàn thành spam tin nhắn...");
            }
        }, config.spamSpeed);
    } else {
        console.log("Bot đã bắt đầu spam trước đó.");
    }
}

function stopSpam(client, message) {
    if (client.spamInterval) {
        console.log("Dừng spam tin nhắn...");
        clearInterval(client.spamInterval);
        client.spamInterval = null;
    } else {
        console.log("Bot chưa bắt đầu spam.");
    }
}
