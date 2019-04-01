const config = require('../config.json');
const ytdl = require('ytdl-core');
const queue = require('./queue.js');
const songList = queue.songList;

module.exports = {
	name: 'play',
	execute(message) {
		console.log(message.guild);
		if(songList.length > 0) {
			const streamOptions = { seek: 0, volume: 1 };
			message.member.voiceChannel.join()
				.then(connection => {
					const stream = ytdl(songList.shift(), { filter : 'audioonly' });
					const dispatcher = connection.playStream(stream, streamOptions);
					const collector = message.channel.createCollector(m => m);
					collector.on('collect', m => {
						if (m.content.startsWith(config.prefix + 'pause')) {
							dispatcher.pause();
						}
						else if (m.content.startsWith(config.prefix + 'resume')) {
							dispatcher.resume();
						}
						else if (m.content.startsWith(config.prefix + 'skip')) {
							if(songList.length > 0) {
								dispatcher.end();
							}
						}
						else if (m.content.startsWith(config.prefix + 'stop')) {
							dispatcher.end();
							message.member.voiceChannel.leave();
						}
					});
					dispatcher.on('end', () => {
						collector.stop();
						play(connection, songList.shift());
					});
				}).catch(err => console.log(err));
		}
		else {
			message.channel.send('The queue seems to be empty. Please use the !queue "song" command...');
		}
	},
};

function play(guild, song) {
	const streamOptions = { seek: 0, volume: 1 };
	const stream = ytdl(song, { filter : 'audioonly' });
	const dispatcher = guild.connection.playStream(stream, streamOptions);
	dispatcher.on('end', () => {
		console.log('Dispatcher out');
	});
}