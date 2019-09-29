module.exports = (client) => {
	const member = client.guilds.get("237543420543893505").members.random();
	client.channels.get("237543420543893505").send(`${member} faggot`).catch(e => { return; });
};
