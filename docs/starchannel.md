# Star Channels
This page explains the __Starboard__ feature.

### What is a starboard?
A Starboard is a fairly simple concept.<br/>
When a user reacts to a message with a star (⭐), the bot will post a message on the Starboard.<br/>
The rules of this are as follows:

- Users cannot star their own messages
- Users cannot star bot messages
- A message requires at least 2 stars to be posted on the Starboard.

### So what's the point?
The point is to basically "pin" messages that a community feels worthwhile. This can be literally anything such as a good joke, a dumb comment or even an amazing announcement. The message will be on the Starboard for all eternity (or until you delete it).

### So how do I set up a Starboard?
This is a pretty simple process.

1. Create a channel you wish for all these starred comments to live.
2. Set the permissions so that only the bot can post in the channel.
3. Run the command `!config set stars <#channel>`
4. Announce to the rest of the community and let the stars flow.

If the bot isn't posting any messages, make sure is has the permission "Embed Links".
