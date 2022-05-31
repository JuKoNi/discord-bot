const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const fetch = require('node-fetch');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
});

async function getCat() {
    const BASE_URL = 'https://api.flickr.com/services/rest?method=flickr.photos.search';
    const API_KEY = 'e0172323e6629835589bbbed7d3327e4';
    try {
        const response = await fetch(`${BASE_URL}&api_key=${API_KEY}&text=kitten&sort=relevance&content_type=1&format=json&nojsoncallback=1`);

        const data = await response.json();

        let url = await getURL(data);
        return url;

    }
    catch(error) {
        console.error(error);
        
    }
}

async function getURL(data) {
    let randomNumber = Math.floor(Math.random() * data.photos.photo.length);

    let serverId = data.photos.photo[randomNumber].server;
    let id = data.photos.photo[randomNumber].id;
    let secret = data.photos.photo[randomNumber].secret;

    let thumbnailURL =  `https://live.staticflickr.com/${serverId}/${id}_${secret}_q.jpg`;

    return thumbnailURL;
}

client.on('messageCreate', async (message) => {
    console.log(message.content);

    if (message.content.toLowerCase().includes('cat')) {
        let imageurl = await getCat()
        message.reply(imageurl)
    }
})

client.login(token);