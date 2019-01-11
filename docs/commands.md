# Commands List
This page lists and explains how to use commands and the results that you get while using these commands.
---
## Config Command
#### Permission level:
Guild Master Only
#### Aliases:
`Config, Bot`
#### Usage:
Before getting into the main commands, I'll cover the config command as it has many parts.<br/>
The Config command is used to set, edit or remove certain configuration settings.

Within config you can see the settings you have by doing `!config <setting>`<br/>
Example, `!config prefix` would result in the current prefix set for the guild.

You can change a setting by doing `!config set <setting> < New Setting >`<br/>
Example, `!config set prefix &&` would set the guilds prefix to '&&'

You can delete or reset a setting by doing `!config delete <setting>`<br/>
Example, `!config delete prefix` would reset the guilds prefix back to '!'

Settings available and their Aliases:

### Prefix
#### Aliases:
`none`
#### Description:
Changes the prefix of the guild.
#### Usage:
Set a new prefix: `!config set prefix < new prefix >`<br/>
Reset the prefix: `!config delete prefix`

### Star Channel
#### Aliases:
`StarChannel, Stars`
#### Description:
Sets the guilds [Star Channel](https://multarix.github.io/Guildbot/starchannel).<br/>
#### Usage:
Set current channel as the Star Channel: `!config set stars`<br/>
Set a different channel as the Star Channel: `!config set stars < channel >`<br/>
Disabling this is as simple as: `!config delete stars`

### Welcome Message
#### Aliases:
`JoinMessage, JM, WelcomeMessage, WM, JMsg, WMsg`
#### Description:
Sets a custom welcome message for anyone who enters the server. The welcome channel must also be set for this to function.
#### Usage:
Putting `<@user>` in the message will be converted to a mention of the user.<br/>
Putting `<user>` in the message will be converted to the users username.<br/>
`!config set joinmessage <@user> Has joined the server, welcome <user>!` results in:
```md
@Guildbot#2193 Has joined the server, welcome Guildbot!
```
Disabling this is as simple as `!config delete JoinMessage`

### Welcome Channel
#### Aliases:
`JoinChannel, JC, WelcomeChannel, WC, JChnl, wChnl`
#### Description:
Sets the welcome message channel for the guild.
#### Usage:
Set current channel as the Welcome Channel: `!config set WelcomeChannel`<br/>
Set a different channel as the Welcome Channel: `!config set WelcomeChannel < channel >`<br/>
Disabling this is as simple as: `!config delete WelcomeChannel`

### Leave Message
#### Aliases:
`LeaveMessage, LM, LMsg`
#### Description:
Sets a custom leave message for anyone who leaves the server. The leave channel must also be set for this to function.
#### Usage:
Putting `<@user>` in the message will be converted to a mention of the user.<br/>
Putting `<user>` in the message will be converted to the users username.<br/>
`!config set LeaveMessage <@user> Has left the server, bye bye <user>!` results in:
```md
@Guildbot#2193 Has left the server, bye bye Guildbot.
```
Disabling this is as simple as `!config delete LeaveMessage`

### Leave Message Channel
#### Aliases:
`LeaveChannel, LC, LChnl`
#### Description:
Sets the leave message channel for the guild.
#### Usage:
Set current channel as the Leave Channel: `!config set LeaveChannel`<br/>
Set a different channel as the Leave Channel: `!config set LeaveChannel < channel >`<br/>
Disabling this is as simple as: `!config delete LeaveChannel`

### Admin
#### Aliases:
`Admin, Admins`
#### Description:
Sets the Admin permission check role. Anyone with this role is able to use any command marked as Admin or lower.
#### Usage:
Set the role: !config set Admin <@role>
Remove the role: !config delete Admin

### Moderator
#### Aliases:
`Moderator, Moderators, Mod, Mods`
#### Description:
Sets the Moderator permission check role. Anyone with this role is able to use any command marked as Moderator or lower.
#### Usage:
Set the role: !config set Moderator <@role>
Remove the role: !config delete Moderator

### Member
#### Aliases:
`Member, Members`
#### Description:
Sets the Member permission check role. Anyone with this role is able to use any command marked as Member or lower.
#### Usage:
Set the role: !config set Member <@role>
Remove the role: !config delete Member
---
# Misc Commands

### Cancerous Text
#### Permission level:
Member+
#### Aliases:
`Cancer`
#### Description:
This command will take any text you write and will randomize the capitalization of it.<br/>
For example, `!cancer this is a demonstration of what this command does` results in:
```md
tHiS is a deMOnStrAtiON Of WhaT THIS coMmAnD dOes
```
---
### Define
#### Permission level:
Everyone
#### Aliases:
`Define`
This command will get dictionary.com link of whatever word you input afterwards.<br/>
For example, `!define notification` results in:
```md
http://www.dictionary.com/browse/notification
```
---
### Echo
#### Permission level:
Member+
#### Aliases:
`Echo`
This command will simply take anything you say and simply repeat it. If the bot has permission to delete messages, it will also delete yours - making it seem like the bot sent the message all by itself, and not you.<br/>
For example, `!echo I love Guildbot` results in:
```md
I love Guildbot
```
---
### Fancy Text
#### Permission level:
Member+
#### Aliases:
`Fancy`
This command will take any text you write and turn it into "fancy" looking text.<br/>
For example, `!fancy I love Guildbot` results in:
```md
𝓘 ˡᵒᵛᵉ 𝓖ᵘᶤˡᵈᵇᵒᵗ
```
---
### Gay
#### Permission level:
Member+
#### Aliases:
`Gay, Gey`
This command allows you to see just how gay you or a friend is. It will generate a random number between 0 and 100.<br/>
Usage of the command would simply be: `!gay` or `!gay @Guildbot#2193`
---
### Invite
#### Permission level:
Everyone
#### Aliases:
`Invite, Inv`
This command will simply make the bot post its invite link with the recommended permissions.<br/>
Usage of the command would simply be: `!invite`
---
### Leet Speak
#### Permission level:
Member+
#### Aliases:
`Leet, 1337, L33T`
This command will take any text you write and turn it into "1337 5P34K" (Leet Speak).<br/>
For example, `!leet I love guildbot` results in:
```md
! 10V3 9U!1D807
```
---
### Love
#### Permission level:
Member+
#### Aliases:
`Love, Crush`
This command allows you to see who you or a friend has a secret crush on.<br/>
The command will grab a random user from the guild the command is executed in and output that as the persons crush.<br/>
Due to the nature of how this command is written, it's actually possible to have a crush on yourself but it's very rare.<br/>
For example, `!love` & `!love @Guildbot#2193` results in:
```md
Multarix#1337 has a crush on @Guildbot#2193 ❤😍
@Guildbot#2193 has a crush on Multarix#1337 ❤😍
```
---
### Ping
#### Permission level:
Everyone
#### Aliases:
`Ping`
This command reveals to you the bots ping to discord.<br/>
(It's probably pretty high as I live in Australia and host the bot here ¯\\_(ツ)_/¯)<br/>
Usage of the command would simply be: `!ping`
---
### Points
#### Permission level:
Everyone
#### Aliases:
`Points, Point, P`
This command checks how many points you or a friend has. Points are accumulated by simply making posts. There is no annoying level feature that notifies you or any of that crap. Points are points and points are all you get.<br/>
Usage of the command would simply be: `!points` or `!points @Guildbot#2193`
---
### Rank
#### Permission level:
Everyone
#### Aliases:
`Rank, Ranks, Ranking, Rankings`
This command will post the users with the top 5 (or less) amount of points from the guild alongside how many points they currently have.<br/>
Usage of the command would simply be: `!rank`
---
### Server Status
#### Permission level:
Everyone
#### Aliases:
`Server, Discord`
This command simply posts a link to the [discord server status](https://status.discordapp.com/) page.<br/>
Usage of the command would simply be: `!status` which results in:
```md
https://status.discordapp.com/
```
---
### Urban Dictionary
#### Permission level:
Everyone
#### Aliases:
`Urban, UD`
This command will get an urban dictionary link of whatever word you input afterwards.<br/>
For example, `!urban notification` results in:
```md
http://www.urbandictionary.com/define.php?term=notification
```
---
### User Info
#### Permission level:
Everyone
#### Aliases:
`UserInfo, uInfo`
This command will post some basic information about you or a mentioned user.<br/>
This will include: Username, discriminator, discord ID, when you joined discord, your current status and if you're a bot account or not.<br/>
Usage of the command would simply be: `!uinfo` or `!uinfo @Guildbot#2193`
---
# Moderation

### Purge Self
#### Permission level:
Moderator+
#### Aliases:
`Purge, PurgeSelf, Prune, PruneSelf`
#### Description:
Instantly delete up to 100 messages from a channel sent by the bot.
#### Usage:
Usage of the command would simply be:`!purge 76` or `!md 42`
---
### Mass Delete
#### Permission level:
Moderator+
#### Aliases:
`MassDelete, MD`
#### Description:
Instantly delete up to 100 messages from a channel (including the command you just sent).<br/>
*I am not responsible for any information you may lose.*
#### Usage:
Usage of the command would simply be: `!md 76` or `!md 42`
---
# System Commands

### Help
#### Permission level:
Everyone
#### Aliases:
`Help`
This command currently doesn't link to this site, but it will in the future (maybe).<br/>
At the moment it will simply DM the user that uses the command with some basic command information.<br/>
Usage of the command would simply be: `!help`
---
### Info
#### Permission level:
Member+
#### Aliases:
`Info, Stats`
This command will post some bot statistics such as:<br/>
Memory Usage, Node & Discord.js versions, the uptime of the bot as well as how many users, channels and servers it has access to.<br/>
Usage of the command would simply be: `!info`
