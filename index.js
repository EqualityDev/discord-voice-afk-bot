const { execSync } = require('child_process');

const requiredModules = [
    'discord.js-selfbot-v13',
    '@discordjs/voice',
    'libsodium-wrappers'
];

function checkModules(modules) {
    modules.forEach(module => {
        try {
            require.resolve(module);
        } catch (e) {
            console.log(`Module "${module}" is not installed. Installing...`);
            execSync(`npm install ${module}`, { stdio: 'inherit' });
        }
    });
}
checkModules(requiredModules);

const Discord = require('discord.js-selfbot-v13');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const client = new Discord.Client({
    readyStatus: false,
    checkUpdate: false,
    partials: ['CHANNEL', 'MESSAGE']
});

const token = process.env.DISCORD_TOKEN || 'TOKEN_DISINI';

// Simpan info channel asal per guild
const targetChannels = {};

function joinChannel(channel, guildId) {
    const existing = getVoiceConnection(guildId);
    if (existing) existing.destroy();

    joinVoiceChannel({
        channelId: channel.id,
        guildId: guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true
    });

    console.log(`[join] Masuk ke: ${channel.name}`);
}

client.on('messageCreate', async (message) => {

    // JOIN
    if (message.content === 'join') {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
            return message.reply('Kamu harus masuk voice channel dulu!');
        }

        targetChannels[message.guild.id] = voiceChannel;
        joinChannel(voiceChannel, message.guild.id);
        message.reply(`✅ Standby di **${voiceChannel.name}** — auto rejoin aktif`);
    }

    // LEAVE
    if (message.content === 'leave') {
        const existing = getVoiceConnection(message.guild.id);
        if (existing) {
            existing.destroy();
            delete targetChannels[message.guild.id];
            console.log('[leave] Keluar dari voice channel.');
            message.reply('👋 Keluar dari voice channel. Auto rejoin dimatikan.');
        } else {
            message.reply('Bot tidak ada di voice channel.');
        }
    }

    // STATUS
    if (message.content === 'status') {
        const existing = getVoiceConnection(message.guild.id);
        const target = targetChannels[message.guild.id];
        if (existing && target) {
            message.reply(`✅ Bot standby di **${target.name}** — auto rejoin aktif`);
        } else {
            message.reply('❌ Bot tidak ada di voice channel.');
        }
    }

});

// Auto rejoin kalau bot dipindah ke channel lain (misal AFK channel)
client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member?.id !== client.user.id) return;

    const guildId = newState.guild.id;
    const target = targetChannels[guildId];
    if (!target) return;

    // Kalau bot dipindah ke channel yang bukan target
    if (newState.channelId && newState.channelId !== target.id) {
        console.log(`[auto-rejoin] Bot dipindah ke ${newState.channel?.name}, balik ke ${target.name}...`);
        setTimeout(() => {
            joinChannel(target, guildId);
        }, 1000);
    }

    // Kalau bot di-kick dari voice
    if (!newState.channelId && oldState.channelId) {
        console.log(`[auto-rejoin] Bot di-kick, balik ke ${target.name}...`);
        setTimeout(() => {
            joinChannel(target, guildId);
        }, 1000);
    }
});

client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    console.log('Commands: join | leave | status');
});

client.login(token);
