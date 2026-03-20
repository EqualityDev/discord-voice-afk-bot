# Discord Voice AFK Bot

Discord selfbot yang standby di voice channel 24/7 dengan fitur auto rejoin otomatis.

## Fitur
- Standby di voice channel tanpa terputus
- Auto rejoin kalau dipindah ke AFK channel atau di-kick
- Berjalan 24/7 menggunakan PM2

## ⚠️ Peringatan
Bot ini menggunakan token akun Discord biasa (selfbot) yang melanggar Terms of Service Discord. Gunakan akun alternatif, bukan akun utama.

## Requirement
- Node.js v18+
- npm
- Termux (Android) atau Linux

## Instalasi

**1. Clone repo:**
```bash
git clone https://github.com/EqualityDev/discord-voice-afk-bot.git
cd discord-voice-afk-bot
```

**2. Install dependencies:**
```bash
npm install discord.js-selfbot-v13 @discordjs/voice libsodium-wrappers
```

**3. Isi token:**

Edit `index.js`, ganti `TOKEN_DISINI` dengan token Discord kamu:
```js
const token = 'TOKEN_KAMU_DISINI';
```

Atau pakai environment variable:
```bash
export DISCORD_TOKEN=token_kamu
```

**4. Jalankan:**
```bash
node index.js
```

## Cara Pakai 24/7 dengan PM2

**Install PM2:**
```bash
npm install -g pm2
```

**Jalankan bot:**
```bash
pm2 start index.js --name "afkbot"
pm2 save
```

**Kalau Termux restart:**
```bash
pm2 resurrect
```

## Commands

| Command | Fungsi |
|---------|--------|
| `join` | Bot join voice channel kamu |
| `leave` | Bot keluar voice channel |
| `status` | Cek status bot |

## Cara Ambil Token Discord

1. Buka Discord di browser — https://discord.com/app
2. Tekan `F12` → tab **Network**
3. Kirim pesan di Discord
4. Cari request apapun → klik → lihat **Headers** → cari `authorization`
5. Copy nilai tersebut — itu token kamu
