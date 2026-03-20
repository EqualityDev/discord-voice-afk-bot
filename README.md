# Discord Voice AFK Bot

Discord selfbot standby di voice channel 24/7 dengan auto rejoin otomatis.

## ⚠️ Peringatan
Bot ini menggunakan token akun Discord biasa (selfbot) yang melanggar Terms of Service Discord. Gunakan akun alternatif, bukan akun utama.

---

## Install & Jalankan

### 1. Clone repo
```bash
git clone https://github.com/EqualityDev/discord-voice-afk-bot.git
cd discord-voice-afk-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Isi token
Edit `index.js`, ganti `TOKEN_DISINI` dengan token Discord kamu:
```bash
nano index.js
```

### 4. Jalankan
```bash
node index.js
```

---

## 24/7 dengan PM2

```bash
npm install -g pm2
pm2 start index.js --name "afkbot"
pm2 save
```

Kalau Termux restart:
```bash
pm2 resurrect
```

---

## Commands
| Command | Fungsi |
|---------|--------|
| `join` | Bot join voice channel kamu |
| `leave` | Bot keluar voice channel |
| `move <nama channel>` | Pindah ke channel lain |
| `status` | Cek status bot |
| `ping` | Cek latency |
| `uptime` | Berapa lama bot nyala |
| `help` | Daftar command |

---

## Cara Ambil Token Discord
1. Buka Discord di browser → https://discord.com/app
2. Tekan `F12` → tab **Network**
3. Kirim pesan di Discord
4. Cari request apapun → klik → **Headers** → cari `authorization`
5. Copy nilainya — itu token kamu
