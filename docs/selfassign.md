# Self-Assign
#### Permission level:
Admin+
#### Aliases:
`selfassign, sa, assign`
#### Description:
This command allows you to set a message with reactions to give users corresponding roles.<br/>
This consists of several things to get it set up.<br/>
<br/>
First you'll need to set the channel with `!selfassign set`<br/>
Secondly you'll need to do `!selfassign add @SuperAmazingRole`<br/>
Thirdly, you'll need to react to the message the bot sends in order to set the emoji.<br/>
<br/>
If you wish to delete an entry, you can do `!selfassign delete @SuperAmazingRole`<br/>
If for some reason you deleted a role prior to removing it from the reaction message, you may need to do `!selfassign reset`, which will remove all roles from the message. You will need to set up any roles you want again.<br/>
<br/>
More details on each subcommand can be found below:<br/>

### Setting the Channel
#### Aliases:
`set, channel`
#### Description:
Sets the channel for the self assign message.
#### Usage Example:
`!selfassign set`

### Adding a role
#### Aliases:
`add, addrole, new, newrole`
#### Description:
Adds a role to the list of self assignable roles.<br/>
<br/>
There is only one thing to remember:<br/>
The emoji you pick either originate from a server the bot is in, or be a default emoji.
#### Usage Example:
`!selfassign add @FancyPantsRole`

### Deleting a role
#### Aliases:
`remove, removerole, delete, deleterole`
#### Description:
Removes a role from the list of self assignable roles.
#### Usage Example:
`!selfassign remove @FancyPantsRole`<br/>

### Resetting the list of roles
#### Aliases:
`reset, reload, retry`
#### Description:
Resets and removes all roles from the list of self assignable roles.
#### Usage Example:
`!selfassign reset`
