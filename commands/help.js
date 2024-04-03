// commands/help.js

module.exports = {
    name: 'help',
    description: 'Hiển thị danh sách các lệnh và hướng dẫn sử dụng.',
    execute(message, prefix) {
        message.author.send(`**Hướng dẫn sử dụng:**\n- \`!spam\`: Bắt đầu spam tin nhắn.\n- \`!stop\`: Dừng spam tin nhắn.\n- \`!ping\`: Kiểm tra ping của bot đến Discord API.`);
        message.reply("Một hướng dẫn sử dụng đã được gửi đến hộp thư của bạn.");
    }
};
