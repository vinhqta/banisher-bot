const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', message => {
	console.log(message.content);
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	let args = '';
	let commandName = '';
	if (message.content.startsWith('!queue')) {
		args = message.content.slice(7);
		commandName = 'queue';
	}
	else {
		args = message.content.slice(prefix.length).split(/ +/);
		commandName = args.shift().toLowerCase();
	}

	const command = client.commands.get(commandName);

	if(!command) return;

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
		
		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!client.commands.has(commandName)) return;

	try {
		command.execute(message, args);
	} 
	catch (error) {
		console.error(error);
		message.reply('oops. there was something wrong with that command');
	}
});

client.login(token);