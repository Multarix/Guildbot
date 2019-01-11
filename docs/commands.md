# Commands List
This page lists and explains how to use commands and the results that you get while using these commands.


### Config Command
Aliases: `Config, Bot`<br/>
Before getting into the main commands, I'll cover the config command as it has many parts.<br/>
The Config command is used to set, edit or remove certain configuration settings.

Within config you can see the settings you have by doing `!config <setting>`<br/>
Example, `!config prefix` would result in the current prefix set for the guild.

You can change a setting by doing `!config set <setting> < New Setting >`<br/>
Example, `!config set prefix &&` would set the guilds prefix to '&&'

You can delete or reset a setting by doing `!config delete <setting>`<br/>
Example, `!config delete prefix` would reset the guilds prefix back to '!'

Settings available and their Aliases:
#### Prefix
Aliases: `none`<br/>
Changes the prefix of the guild.<br/>
This setting can be altered with `!config set prefix < new prefix >`<br/>
This setting can be reset with `!config delete prefix`

#### Star channel
Aliases: `StarChannel, Stars`<br/>
This command sets the guilds [star channel](starchannel).<br/>
This setting can be altered with `!config set stars` or `!config set stars < channel >`<br/>
This will set the star channel to either the channel it is done in, or the channel mentioned respectively.<br/>
Disabling the star channel is as simple as `!config delete stars`

#### Welcome Message
Aliases: `JoinMessage, JM, WelcomeMessage, WM, JMsg, WMsg`<br/>
This command will set a custom welcome message for anyone who enters the server. The welcome channel must also be set for this to function.<br/>
Putting `<@user>` in the message will be converted to a mention of the user.<br/>
Putting `<user>` in the message will be converted to the users username.<br/>
For example, `!config set joinmessage <@user> Has joined the server, welcome <user>!` results in:
```md
@Guildbot#2193 Has joined the server, welcome Guildbot!
```
Disabling this is as simple as `!config delete JoinMessage`

#### Welcome Channel
Aliases: `Aliases: `JoinChannel, JC, WelcomeChannel, WC, JChnl, wChnl`<br/>
This sets the welcome message channel for the guild.
This setting can be altered with `!config set WelcomeChannel` or `!config set WelcomeChannel < channel >`<br/>
This will set the star channel to either the channel it is done in, or the channel mentioned respectively.<br/>

Disabling this is as simple as `!config delete WelcomeChannel`

#### Leave Message
Aliases: `LeaveMessage, LM, LMsg`<br/>
This command will set a custom leave message for anyone who leaves the server. The leave channel must also be set for this to function.<br/>
Putting `<@user>` in the message will be converted to a mention of the user.<br/>
Putting `<user>` in the message will be converted to the users username.<br/>
For example, `!config set LeaveMessage <@user> Has left the server, bye bye <user>!` results in:
```md
@Guildbot#2193 Has left the server, bye bye Guildbot.
```
Disabling this is as simple as `!config delete LeaveMessage`

#### Leave Message Channel
Aliases: `Aliases: `LeaveChannel, LC, LChnl`<br/>
This sets the leave message channel for the guild.
This setting can be altered with `!config set LeaveChannel` or `!config set LeaveChannel < channel >`<br/>
This will set the star channel to either the channel it is done in, or the channel mentioned respectively.<br/>

Disabling this is as simple as `!config delete LeaveChannel`

#### Admin

#### Member

#### Moderator

## Misc Commands

### Cancer
Aliases: `Cancer`<br/>
This command will take any text you write and will randomize the capitalization of it.<br/>
For example, `!cancer this is a demonstration of what this command does` results in:
```md
tHiS is a deMOnStrAtiON Of WhaT THIS coMmAnD dOes
```

### Define
Aliases: `Define`<br/>
This command will get dictionary.com link of whatever word you input afterwards.<br/>
For example, `!define notification` results in:
```md
http://www.dictionary.com/browse/notification
```

### Echo
Aliases: `Echo`<br/>
This command will simply take anything you say and simply repeat it. If the bot has permission to delete messages, it will also delete yours - making it seem like the bot sent the message all by itself, and not you.<br/>
For example, `!echo I love Guildbot` results in:
```md
I love Guildbot
```

### Fancy
Aliases: `Fancy`<br/>
This command will take any text you write and turn it into "fancy" looking text.<br/>
For example, `!fancy I love Guildbot` results in:
```md
𝓘 ˡᵒᵛᵉ 𝓖ᵘᶤˡᵈᵇᵒᵗ
```

### Gay
Aliases: `Gay, Gey`<br/>
This command allows you to see just how gay you or a friend is. It will generate a random number between 0 and 100.<br/>
Usage of the command would simply be: `!gay` or `!gay @Guildbot#2193`

### Invite
Aliases: `Invite`<br/>
This command will simply make the bot post its invite link with the recommended permissions.<br/>
Usage of the command would simply be: `!invite`

### Leet
Aliases: `Leet, 1337, L33T`<br/>
This command will take any text you write and turn it into "1337 5P34K" (Leet Speak).<br/>
For example, `!leet I love guildbot` results in:
```md
! 10V3 9U!1D807
```

### Love
Aliases: `Love, Crush`<br/>
This command allows you to see who you or a friend has a secret crush on.<br/>
The command will grab a random user from the guild the command is executed in and output that as the persons crush.<br/>
Due to the nature of how this command is written, it's actually possible to have a crush on yourself but it's very rare.<br/>
For example, `!love` & `!love @Guildbot#2193` results in:
```md
Multarix#1337 has a crush on @Guildbot#2193 ❤😍
@Guildbot#2193 has a crush on Multarix#1337 ❤😍
```

### Ping
Aliases: `Ping`<br/>
This command reveals to you the bots ping to discord.<br/>
(It's probably pretty high as I live in Australia and host the bot here ¯\\_(ツ)_/¯)<br/>
Usage of the command would simply be: `!ping`

### Points
Aliases: `Points, Point, P`<br/>
This command checks how many points you or a friend has. Points are accumulated by simply making posts. There is no annoying level feature that notifies you or any of that crap. Points are points and points are all you get.<br/>
Usage of the command would simply be: `!points` or `!points @Guildbot#2193`

### Rank
Aliases: `Rank, Ranks, Ranking, Rankings`<br/>
This command will post the users with the top 5 (or less) amount of points from the guild alongside how many points they currently have.<br/>
Usage of the command would simply be: `!rank`

### Server
Aliases: `Server, Discord`<br/>
This command simply posts a link to the [discord server status](https://status.discordapp.com/) page.<br/>
Usage of the command would simply be: `!status` which results in:
```md
https://status.discordapp.com/
```

### Urban
Aliases: `Urban, UD`<br/>
This command will get an urban dictionary link of whatever word you input afterwards.<br/>
For example, `!urban notification` results in:
```md
http://www.urbandictionary.com/define.php?term=notification
```

### User Info
Aliases: `UserInfo, uInfo`<br/>
This command will post some basic information about you or a mentioned user.<br/>
This will include: Username, discriminator, discord ID, when you joined discord, your current status and if you're a bot account or not.<br/>
Usage of the command would simply be: `!uinfo` or `!uinfo @Guildbot#2193`

## Moderation

### Mass Delete
Aliases: `MassDelete, MD`<br/>
This command will instantly delete up to 100 messages from a channel (including the command you just sent).<br/>
I am not responsible for any information you may lose.<br/>
Usage of the command would simply be: `!md 76` or `!md 42`

## System Commands

### Help
Aliases: `Help`<br/>
This command currently doesn't link to this site, but it will in the future (maybe).<br/>
At the moment it will simply DM the user that uses the command with some basic command information.<br/>
Usage of the command would simply be: `!help`

### Info
Aliases: `Info, Stats`<br/>
This command will post some bot statistics such as:<br/>
Memory Usage, Node & Discord.js versions, the uptime of the bot as well as how many users, channels and servers it has access to.<br/>
Usage of the command would simply be: `!info`

### System
Aliases: `System, Sys, SysInfo`<br/>
This command will post information about the system the bot is running on such as Processor, RAM and OS.<br/>
Usage of the command would simply be: `!system`
