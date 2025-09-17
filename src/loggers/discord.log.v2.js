const { Client, GatewayIntentBits } = require("discord.js");
class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
      ],
    });
    this.channelId = process.env.CHANNEL_ID_DISCORD;
    this.client.on("ready", () => {
      console.log(`Logged is as ${this.client.user.tag}`);
    });
    this.client.login(process.env.TOKEN_DISCORD);
  }
  sendFormatCode(logData = "") {
    const {
      code,
      message = "This is some additional information about the code.",
      title = "Code Example",
    } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };
    this.sendMessage(codeMessage);
  }
  sendMessage(message = "") {
    const channel = this.client.channels.cache.get(this.channelId);
    console.log(this.channelId);
    console.log(channel);
    if (!channel) {
      console.error(`Couldn't find the channel...`, this.channelId);
      return;
    }
    channel.send(message).catch((e) => console.error(e));
  }
}
module.exports = new LoggerService();
