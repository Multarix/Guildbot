module.exports = (client) => {
	const member = client.guild.members.cache.filter(m => m.user.id !== client.user.id).random();
	const msg = (Math.random() > 0.5) ? "faggot" : "I love you";
	client.channels.cache.get("237543420543893505").send(`${member} ${msg}`).catch(e => { return; });
};
