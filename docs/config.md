# Config Command
#### Permission level:
Guild Master Only
#### Aliases:
`Config, Bot`
#### Description:
Within config you can see the settings you have by doing `!config <setting>`<br/>
Example, `!config prefix` would result in the current prefix set for the guild.

You can change a setting by doing `!config set <setting> < New Setting >`<br/>
Example, `!config set prefix &&` would set the guilds prefix to '&&'

You can delete or reset a setting by doing `!config delete <setting>`<br/>
Example, `!config delete prefix` would reset the guilds prefix back to '!'

Settings available and their Aliases:

### Prefix
#### Aliases:
`Prefix`
#### Description:
Changes the prefix of the guild.
#### Usage Example:
Set a new prefix: `!config set prefix < new prefix >`<br/>
Reset the prefix: `!config delete prefix`

### Starboard
#### Aliases:
`Starboard, StarChannel, Stars`
#### Description:
Sets the guilds [Starboard](https://multarix.github.io/Guildbot/starchannel).<br/>
#### Usage Example:
Set current channel as the Starboard: `!config set stars`<br/>
Set a different channel as the Starboard: `!config set stars < channel >`<br/>
Disabling this is as simple as: `!config delete stars`

### Welcome Message
#### Aliases:
`JoinMessage, JM, WelcomeMessage, WM, JMsg, WMsg`
#### Description:
Sets a custom welcome message for anyone who enters the server. The welcome channel must also be set for this to function.
#### Usage Example:
Putting `<@user>` in the message will be converted to a mention of the user.<br/>
Putting `<user>` in the message will be converted to the users username.<br/>
`!config set joinmessage <@user> Has joined the server, welcome <user>!` results in:
```md
@Guildbot#2193 Has joined the server, welcome Guildbot!
```
Disabling this is as simple as `!config delete JoinMessage`

### Welcome Channel
#### Aliases:
`WelcomeChannel, WChnl, WC, WMC`
#### Description:
Sets the welcome message channel for the guild.
#### Usage Example:
Set current channel as the Welcome Channel: `!config set WelcomeChannel`<br/>
Set a different channel as the Welcome Channel: `!config set WelcomeChannel < channel >`<br/>
Disabling this is as simple as: `!config delete WelcomeChannel`

### Leave Message
#### Aliases:
`ByeMessage, ByeMsg, BMsg, BM, LM`
#### Description:
Sets a custom leave message for anyone who leaves the server. The leave channel must also be set for this to function.
#### Usage Example:
Putting `<@user>` in the message will be converted to a mention of the user.<br/>
Putting `<user>` in the message will be converted to the users username.<br/>
`!config set LeaveMessage <@user> Has left the server, bye bye <user>!` results in:
```md
@Guildbot#2193 Has left the server, bye bye Guildbot.
```
Disabling this is as simple as `!config delete LeaveMessage`

### Leave Message Channel
#### Aliases:
`Goodbye, GChnl, GC, GMC, LMC`
#### Description:
Sets the leave message channel for the guild.
#### Usage Example:
Set current channel as the Leave Channel: `!config set LeaveChannel`<br/>
Set a different channel as the Leave Channel: `!config set LeaveChannel < channel >`<br/>
Disabling this is as simple as: `!config delete LeaveChannel`

### Admin
#### Aliases:
`Admin, Admins`
#### Description:
Sets the Admin permission check role. Anyone with this role is able to use any command marked as Admin or lower.
#### Usage Example:
Set the role: !config set Admin <@role><br/>
Remove the role: !config delete Admin

### Moderator
#### Aliases:
`Moderator, Moderators, Mod, Mods`
#### Description:
Sets the Moderator permission check role. Anyone with this role is able to use any command marked as Moderator or lower.
#### Usage Example:
Set the role: !config set Moderator <@role><br/>
Remove the role: !config delete Moderator

### Member
#### Aliases:
`Member, Members`
#### Description:
Sets the Member permission check role. Anyone with this role is able to use any command marked as Member or lower.
#### Usage Example:
Set the role: !config set Member <@role><br/>
Remove the role: !config delete Member
