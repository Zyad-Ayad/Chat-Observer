const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
// Grab your token and client ID from the .env file
const token = process.env.ENV == "DEV" ? process.env.token_DEV : process.env.token_PROD;
const clientId = process.env.ENV == "DEV" ? process.env.clientId_DEV : process.env.clientId_PROD;


const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
// env is PROD 
if(process.env.ENV == "PROD")
{
	// Deploy the commands to the top.gg API
	fetch(`https://discordbotlist.com/api/v1/bots/1199783232749707344/commands`, {
	method: 'POST',
	headers: {
		'Authorization': process.env.DBL_TOKEN,
		'Content-Type': 'application/json'
	},
	body: JSON.stringify(commands)
}).then(res => res.json()).catch(console.error);

}
