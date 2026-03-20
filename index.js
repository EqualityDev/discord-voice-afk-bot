const Discord = require('discord.js-selfbot-v13');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const client = new Discord.Client({
    readyStatus: false,
    checkUpdate: false,
    partials: ['CHANNEL', 'MESSAGE']
});

const token = 'TOKEN_DISINI';
const OWNER_ID = '1430728197720375367';
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
    if (message.author.id !== OWNER_ID) return;

    if (message.content === 'join') {
        const vc = message.member?.voice?.channel;
        if (!vc) return message.reply('Kamu harus masuk voice channel dulu!');
        targetChannels[message.guild.id] = vc;
        joinChannel(vc, message.guild.id);
        message.reply(`✅ Standby di **${vc.name}** — auto rejoin aktif`);
    }

    if (message.content === 'leave') {
        const conn = getVoiceConnection(message.guild.id);
        if (conn) {
            conn.destroy();
            delete targetChannels[message.guild.id];
            message.reply('👋 Keluar. Auto rejoin dimatikan.');
        } else {
            message.reply('Bot tidak ada di voice channel.');
        }
    }

    if (message.content === 'status') {
        const conn = getVoiceConnection(message.guild.id);
        const target = targetChannels[message.guild.id];
        if (conn && target) {
            message.reply(`✅ Standby di **${target.name}**`);
        } else {
            message.reply('❌ Bot tidak ada di voice channel.');
        }
    }

    if (message.content === 'ping') {
        message.reply(`🏓 Pong! ${client.ws.ping}ms`);
    }

    if (message.content === 'uptime') {
        const s = Math.floor(process.uptime());
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const d = s % 60;
        message.reply(`⏱️ Uptime: ${h}j ${m}m ${d}d`);
    }

    if (message.content.startsWith('move ')) {
        const name = message.content.split(' ').slice(1).join(' ');
        const vc = message.guild.channels.cache.find(
            c => c.type === 2 && c.name.toLowerCase() === name.toLowerCase()
        );
        if (!vc) return message.reply(`❌ Channel **${name}** tidak ditemukan.`);
        targetChannels[message.guild.id] = vc;
        joinChannel(vc, message.guild.id);
        message.reply(`✅ Pindah ke **${vc.name}**`);
    }

    if (message.content === 'help') {
        message.reply(`📋 **Commands:**
\`join\` — Bot join voice channel kamu
\`leave\` — Bot keluar voice channel
\`move <nama>\` — Pindah ke channel lain
\`status\` — Cek status bot
\`ping\` — Cek latency
\`uptime\` — Berapa lama bot nyala`);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member?.id !== client.user.id) return;
    const guildId = newState.guild.id;
    const target = targetChannels[guildId];
    if (!target) return;

    if (newState.channelId && newState.channelId !== target.id) {
        console.log(`[auto-rejoin] Dipindah ke ${newState.channel?.name}, balik ke ${target.name}...`);
        setTimeout(() => joinChannel(target, guildId), 1000);
    }

    if (!newState.channelId && oldState.channelId) {
        console.log(`[auto-rejoin] Di-kick, balik ke ${target.name}...`);
        setTimeout(() => joinChannel(target, guildId), 1000);
    }
});

client.on('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(token);
