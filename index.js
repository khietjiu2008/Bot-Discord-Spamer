const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs-extra");
const Table = require('cli-table3');
const figlet = require('figlet');
const config = process.env.CONFIG ? JSON.parse(process.env.CONFIG) : require("./config.json");
let data = process.env.TOKENS || fs.readFileSync("./tokens.txt", "utf-8");
if (!data) throw new Error(`Không thể tìm thấy token.`);
const tokens = data.split(/\r?\n/).filter(token => token.trim()); 
config.tokens = tokens.map(token => ({ token }));
const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}
const prefix = config.Prefix;
start();
async function start() {
  console.log(figlet.textSync('Kaiyo Bot', {
      font: 'Rectangles',
      horizontalLayout: 'fitted',
      verticalLayout: 'default'
  }));

  console.log("➢ Author  : Kaiyo");
  console.log(`➣ Support : T.me/KaiyoDev`);

  const table = new Table({
      head: ['Token', 'Tên người dùng', 'ID', 'Guilds','Channels','Users', 'Online']
  });

  console.log(`➢ Token   : ${config.tokens.length}`);
  console.log(`➣ Commands: ${commands.size}`);
  console.log(`➣ Prefix  : ${prefix}`);


    for (const tokenObj of config.tokens) {
        const result = await loginAndStart(tokenObj.token);
        if (result) {
            table.push(result);
        }
    }

    console.log(table.toString());
}
async function loginAndStart(token) {
    if (!token) {
        console.log("Token hoặc API của bạn hết hạn. Liên hệ T.me/KaiyoDev");
        return;
    }

    const client = new Client({ checkUpdate: false, readyStatus: false });
    client.on("messageCreate", async (message) => {
        if (!message.guild || message.author.bot) return;

        if (message.content.startsWith(prefix)) {
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            let loginStatus = '';
            const command = commands.get(commandName);

            if (!command) return;

            try {
                command.execute(message, client, config);
            } catch (error) {
                console.error(error);
                message.reply('Đã xảy ra lỗi khi thực hiện lệnh!');
            }
        }
    });

    try {
        await client.login(token);
       // console.log(`Đăng nhập bằng token "${token}" thành công!`);
        loginStatus = '✅';
        return [token, client.user.tag, client.user.id, client.guilds.cache.size, client.channels.cache.size, client.users.cache.size,loginStatus];
    } catch (error) {
        console.error(`Không thể đăng nhập bằng token "${token}"! Vui lòng kiểm tra xem token có hợp lệ không.`);
        return null;
    }
}
