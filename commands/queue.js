const config = require('../config.json');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(config.YOUTUBE_API_KEY);


const songList = [];
module.exports = {
	name: 'queue',
	args: true,
	execute(message, args) {
		let youtubeLink = 'www.youtube.com/watch?v=';
		youtube.searchVideos(args, 4)
			.then(results => {
				console.log(results[0].title);
				youtubeLink += results[0].id;
				songList.push(youtubeLink);
				message.channel.send('Adding ' + results[0].title + ' to the queue...');
			})
			.catch(console.log);
	},
	songList: songList,
};