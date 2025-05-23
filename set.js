const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaVA2bHQ2MnBXL0krNWdWQTRWd1VmQkh0blhhUWZWU2syQjJVWTlvTG5FZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRklhang4Vjl2MlZKS2FRbzk4V0lyM0FMOFgvem5xNXEzcFBaU0tkakZIaz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhRXhrVEFvODFnUUQ0RmVpQXlZaFlCRDlDUXYrVUtidCtlbk5qSUw3UjNRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJWU0g3dzdkT2p4RjB2N0xvczNEMmxsRHVVa1c2K2FjL1ZGc1hCNTd0QlJ3PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik9DQ0ZiZUJ5V1Azd2pycHlIejRkbkhJaWlTWnpNMjhSR3ZCZ21ieXdCbk09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldUNm11MTN4SExYd2tSY1doeXdrd2ZQenZmSkZxNUZGREE0WFVyaHVUZ009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVVBNb2NaTXBWOU92R21Xdmp5bDlmMiswWFRKTU4xVGhBRk84THV0eTEwOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVlhDSGtNV252dnN0UWlMbWlBYXFXMldJL1RhMHdNcGl0Q3c2U2tualBFUT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlA5M2NlTzBuZVdTMmpLUmozUmU0SURjdnkvZFF3MkNSYTRrN1k4QWpxK2JHV1VLcGgvUS9ocXNsdTNHd3dCcVpxWmFlNHg3dDhCSzVPalBBZVkvR2pRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTU3LCJhZHZTZWNyZXRLZXkiOiJSWTFESW1BZ2NVSndYZjc4SWhGSXlKZDIzanB1a2Z0Mlh2OWNXVC9GdjlVPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjI3NjU1MjAyODQxQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjJGMEM1Rjg4QzY3QTIwNTI2NzQzRUQyQkM5QTRERDk1In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NDc5OTE3Mjd9LHsia2V5Ijp7InJlbW90ZUppZCI6IjI3NjU1MjAyODQxQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkJCRjdBODNGRDMyQzMyMURDQ0RBQTZFRkU3QTFDMDFBIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NDc5OTE3NDN9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IkpYVzg5OFY5IiwibWUiOnsiaWQiOiIyNzY1NTIwMjg0MTo4M0BzLndoYXRzYXBwLm5ldCIsImxpZCI6IjI1ODE5Njk3NTQyMzU2Mzo4M0BsaWQiLCJuYW1lIjoi8J2Qk/CdkIfwnZCU8J2QhvCdkIrwnZCE8J2QhPCdkIMifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0tMcjFlVUdFSTc1d01FR0dBTWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6ImovSWxsNnRmbjlMM3FLRG5jRWdUMkZ2R1BIT2NsY2VydVRsL1ZObzB0Rjg9IiwiYWNjb3VudFNpZ25hdHVyZSI6IkxyUHR3YTlOT3Zrd2doTmR2aGtSTWZrZjEzNjJQdllMczhydEtXT1hxSTQrVlNEUzVqbnZjTVVSTUFxRGpwV2lYaGVWblkvckhULzY1R0duUHdrMUFBPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJCQWI3V2pWbGZ1MGdzSlVTYUdtZlYxdVRKNHFuWE42UnBHb3ArajFtZEpkZW9lMW1wM3ZYc2tqN2pneXAvTTMxU21IallHckhWcUJXakU1Zm1jc3pqQT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI3NjU1MjAyODQxOjgzQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlkveUpaZXJYNS9TOTZpZzUzQklFOWhieGp4em5KWEhxN2s1ZjFUYU5MUmYifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElDQT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0Nzk5MTcwOSwibGFzdFByb3BIYXNoIjoiMlY3N3FVIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMSisifQ==',
    PREFIXE: process.env.PREFIX || "*",
    OWNER_NAME: process.env.OWNER_NAME || "THUGKEED",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "THUGKEED",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'THUGKEED-MD',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/ahh2sa.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'yes',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

