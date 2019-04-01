const fetch = require('node-fetch');
const config = require('../config.json');

const url = 'https://api.fortnitetracker.com/v1/profile/';

const options = {
	method: 'GET',
	headers: {
		'TRN-Api-Key': config.TRN_API_KEY,
	},
};

function formatStatsString(epicName, wins, kills, kd) {
	let statsString = '';
	statsString += 'Player: ' + epicName + ' has ' + wins + ' wins, ' + kills + ' kills, with a ' + kd + ' KD.';
	return statsString;
}

module.exports = {
	name : 'fortnite',
	description : 'GET Fortnite Stats',
	args : true,
	// GET https://api.fortnitetracker.com/v1/profile/{platform}/{epic-nickname}
	// Platforms: pc, xbl, psn
	// args[0] nickname args[1] platform
	execute(message, args) {
		if (args.length != 2) {
			return message.channel.send('You must send a valid epic-nickname, and a platform: (pc, xbl, or psn)');
		}
		
		const epicName = args[0];
		const platform = args[1];
		const uri = url + platform + '/' + epicName;

		fetch(uri, options)
			.then(response => response.json()
				.then(myJson => message.channel.send(formatStatsString(myJson.epicUserHandle, myJson.lifeTimeStats[8].value, myJson.lifeTimeStats[10].value, myJson.lifeTimeStats[11].value))))
			.catch(err => console.error(err));

	},
};
