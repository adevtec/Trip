#!/usr/bin/env node

/**
 * Skript andmebaasi ühenduse andmete tuvastamiseks
 * Käivita: node find_db_config.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Default seadistused db.ts failist
const defaultConfig = {
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'eksootikareisid'
};

// Võimalikud kasutaja/parooli kombinatsioonid
const credentialOptions = [
  { user: 'taskuser', password: 'taskpassword' },
  { user: 'root', password: 'taskpassword' },
  { user: 'taskuser', password: '' },
  { user: 'root', password: '' },
  { user: 'root', password: 'root' },
  { user: 'root', password: 'password' },
  { user: 'eksootikareisid', password: 'taskpassword' },
];

console.log('=== Andmebaasi konfiguratsioon ===\n');

// 1. Kontrollime environment variables
console.log('1. Environment variables:');
const envVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
let hasEnvVars = false;

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ${varName}=${value}`);
    hasEnvVars = true;
  } else {
    console.log(`   ${varName}=undefined (kasutab default: ${getDefaultValue(varName)})`);
  }
});

if (!hasEnvVars) {
  console.log('   Ühtegi environment variable\'it ei leitud.');
}

// 2. Default konfiguratsioon
console.log('\n2. Default konfiguratsioon (db.ts failist):');
Object.entries(defaultConfig).forEach(([key, value]) => {
  console.log(`   ${key}: ${value || '(tühi)'}`);
});

// 3. Proovime ühendust
console.log('\n3. Testime andmebaasi ühendust...');
testMultipleConnections();

function getDefaultValue(envVar) {
  const defaults = {
    'DB_HOST': 'localhost',
    'DB_USER': 'root',
    'DB_PASSWORD': '',
    'DB_NAME': 'eksootikareisid'
  };
  return defaults[envVar] || '';
}

async function testConnection() {
  // Proovime erinevaid MySQL kasutajaid ja paroole
  const configs = [
    // Tühjad paroolid
    { host: 'localhost', user: 'root', password: '', database: 'wordpress' },
    { host: 'localhost', user: 'root', password: '', database: 'eksootikareisid' },
    { host: 'localhost', user: 'root', password: '', database: 'eksootikareisid_new' },
    
    // Tavalisemad paroolid
    { host: 'localhost', user: 'root', password: 'root', database: 'wordpress' },
    { host: 'localhost', user: 'root', password: 'password', database: 'wordpress' },
    { host: 'localhost', user: 'root', password: 'admin', database: 'wordpress' },
    { host: 'localhost', user: 'root', password: '123456', database: 'wordpress' },
    { host: 'localhost', user: 'root', password: 'mysql', database: 'wordpress' },
    
    // Erinevad andmebaasid root parooliga
    { host: 'localhost', user: 'root', password: 'root', database: 'eksootikareisid' },
    { host: 'localhost', user: 'root', password: 'root', database: 'eksootikareisid_new' },
    
    // Erinevad kasutajad
    { host: 'localhost', user: 'wordpress', password: 'wordpress', database: 'wordpress' },
    { host: 'localhost', user: 'wp_user', password: 'wp_password', database: 'wordpress' },
    
    // 127.0.0.1 variandid
    { host: '127.0.0.1', user: 'root', password: '', database: 'wordpress' },
    { host: '127.0.0.1', user: 'root', password: 'root', database: 'wordpress' },
    { host: '127.0.0.1', user: 'root', password: 'password', database: 'wordpress' },
    
    // Environment variables (kui on seadistatud)
    {
      host: process.env.DB_HOST || defaultConfig.host,
      user: process.env.DB_USER || defaultConfig.user,
      password: process.env.DB_PASSWORD || defaultConfig.password,
      database: process.env.DB_NAME || defaultConfig.database
    }
  ];

  console.log(`   Testime ${configs.length} erinevat konfiguratsiooni...\n`);

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    
    try {
      console.log(`   ${i + 1}. Proovin: ${config.user}@${config.host}/${config.database} (parool: ${config.password ? '***' : 'tühi'})`);
      
      const connection = await mysql.createConnection(config);
      console.log('   ✅ ÜHENDUS ÕNNESTUS!');
      console.log(`   📋 Andmebaasi andmed:`);
      console.log(`      Host: ${config.host}`);
      console.log(`      User: ${config.user}`);
      console.log(`      Password: ${config.password || '(tühi)'}`);
      console.log(`      Database: ${config.database}`);
      
      // Kontrollime WordPress tabeleid
      console.log('\n4. WordPress tabelite kontroll:');
      const [tables] = await connection.execute('SHOW TABLES LIKE "wp_%"');
      
      if (tables.length > 0) {
        console.log(`   Leitud ${tables.length} WordPress tabelit:`);
        tables.slice(0, 5).forEach(table => {
          const tableName = Object.values(table)[0];
          console.log(`   - ${tableName}`);
        });
        if (tables.length > 5) {
          console.log(`   ... ja veel ${tables.length - 5} tabelit`);
        }
        
        // Kontrollime API võtit
        await checkApiKey(connection);
      } else {
        console.log('   ❌ WordPress tabeleid ei leitud');
      }
      
      await connection.end();
      
      // Kui leidsime töötava ühenduse, lõpetame
      console.log('\n🎉 LEITUD! Kasuta neid andmeid .env.local failis:');
      console.log(`DB_HOST=${config.host}`);
      console.log(`DB_USER=${config.user}`);
      console.log(`DB_PASSWORD=${config.password}`);
      console.log(`DB_NAME=${config.database}`);
      
      return; // Lõpetame, kuna leidsime töötava ühenduse
      
    } catch (error) {
      console.log(`   ❌ Ebaõnnestus: ${error.message.split('\n')[0]}`);
      
      // Kui see on viimane katse, näitame rohkem infot
      if (i === configs.length - 1) {
        console.log('\n❌ Ükski ühendus ei õnnestunud!');
        console.log('\n🔧 Probleemi lahendamiseks:');
        console.log('1. Kontrolli kas MySQL server töötab:');
        console.log('   brew services start mysql  # macOS');
        console.log('   sudo service mysql start   # Linux');
        console.log('2. Kontrolli MySQL kasutajaid:');
        console.log('   mysql -u root -p');
        console.log('   SHOW DATABASES;');
        console.log('3. Loo andmebaas kui vaja:');
        console.log('   CREATE DATABASE wordpress;');
        console.log('   CREATE DATABASE eksootikareisid;');
      }
    }
  }
}

async function checkApiKey(connection) {
  try {
    console.log('\n5. NovIT API võtme kontroll:');
    const [rows] = await connection.execute(
      'SELECT option_value FROM wp_options WHERE option_name = "novit_api_key"'
    );
    
    if (rows.length > 0) {
      const encryptedKey = rows[0].option_value;
      console.log(`   ✅ API võti leitud andmebaasist`);
      console.log(`   Krüpteeritud võti: ${encryptedKey.substring(0, 20)}...`);
      console.log('   💡 Kasuta wp-content/get_api_key.php dekrüpteerimiseks');
    } else {
      console.log('   ❌ API võtit ei leitud andmebaasist');
      console.log('   💡 Sisesta API võti WordPress Admin > Tools > NovIT Tours');
    }
  } catch (error) {
    console.log(`   ❌ Viga API võtme kontrollimisel: ${error.message}`);
  }
}

// 6. Otsi .env faile
console.log('\n6. .env failide otsimine:');
const possibleEnvFiles = [
  '.env',
  '.env.local', 
  '.env.development',
  '.env.production'
];

let foundEnvFiles = [];
possibleEnvFiles.forEach(fileName => {
  if (fs.existsSync(fileName)) {
    foundEnvFiles.push(fileName);
    console.log(`   ✅ Leitud: ${fileName}`);
  }
});

if (foundEnvFiles.length === 0) {
  console.log('   ❌ .env faile ei leitud');
  console.log('   💡 Loo .env.local fail andmebaasi seadistuste jaoks');
}
