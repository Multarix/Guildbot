module.exports = (client) => {
	const member = client.guilds.cache.get("237543420543893505").members.random();
	const msg = (Math.random() > 0.5) ? "faggot" : "I love you";
	client.channels.cache.get("237543420543893505").send(`${member} ${msg}`).catch(e => { return; });
};
