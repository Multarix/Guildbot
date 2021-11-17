const responses = require("./assholeResponses.json");
module.exports = async (client, guildID) => {
	const member = client.guilds.cache.get(guildID).members.cache.filter(m => m.user.id !== client.user.id).random();
	const msg = responses[Math.floor(Math.random() * responses.length)];

	const lstMsg = await client.channels.cache.get("237543420543893505").lastMessage.fetch();
	if(lstMsg.author.id !== client.user.id){
		client.channels.cache.get("237543420543893505").send(`${member} ${msg}`).catch(e => { return; });
	}
};
