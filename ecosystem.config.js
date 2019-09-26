module.exports = {
	apps : [{
		name: "bot",
		script: "./bot.js",
		watch: ["events", "modules", "./bot.js"],
		ignore_watch: ["node_modules", "objects/settings.sqlite", "objects.settings.sqlite-journal", "docs"],
		cron_restart : "30 5 * * 6",
		max_restarts: 10,
		env: {
			NODE_ENV: 'development',
		},
		env_production : {
			NODE_ENV: 'production',
		},
	}],

	deploy : {
		production : {
			user: 'node',
			host: '212.83.163.1',
			ref: 'origin/master',
			repo: 'git@github.com:repo.git',
			path: '/var/www/production',
			'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
		},
	},
};

// git branch -D <branchName>
