#!/usr/bin/env node

/**
 * Lihtsam skript andmebaasi ühenduse testimiseks
 */

const mysql = require('mysql2/promise');

// Testkonditsioonid (esimene on sinu soovitus)
const testConfigs = [
  { host: 'localhost', user: 'taskuser', password: 'taskpassword', database: 'eksootikareisid' },
  { host: 'localhost', user: 'taskuser', password: 'taskpassword', database: 'wordpress' },
  { host: 'localhost', user: 'root', password: 'taskpassword', database: 'eksootikareisid' },
  { host: 'localhost', user: 'root', password: '', database: 'eksootikareisid' },
  { host: 'localhost', user: 'root', password: 'root', database: 'eksootikareisid' },
];

console.log('=== MySQL Andmebaasi Testi ===\n');

async function testDatabase() {
  for (let i = 0; i < testConfigs.length; i++) {
    const config = testConfigs[i];
    console.log(`${i + 1}. Testin: ${config.user}@${config.host}/${config.database} (parool: ${config.password || 'tühi'})`);
    
    try {
      const connection = await mysql.createConnection(config);
      console.log('   ✅ ÜHENDUS ÕNNESTUS!');
      
      // Kontrollime WordPress tabeleid
      const [tables] = await connection.execute('SHOW TABLES LIKE "wp_%"');
      console.log(`   📊 WordPress tabeleid: ${tables.length}`);
      
      if (tables.length > 0) {
        // Kontrollime API võtit
        try {
          const [rows] = await connection.execute(
            'SELECT option_value FROM wp_options WHERE option_name = "novit_api_key"'
          );
          
          if (rows.length > 0) {
            console.log('   🔑 NovIT API võti leitud!');
            console.log(`   Krüpteeritud: ${rows[0].option_value.substring(0, 30)}...`);
          } else {
            console.log('   ❌ API võtit ei leitud');
          }
        } catch (e) {
          console.log('   ⚠️  API võtme kontroll ebaõnnestus');
        }
      }
      
      await connection.end();
      
      // Väljasta töötav konfiguratsioon
      console.log('\n=== TÖÖTAV KONFIGURATSIOON ===');
      console.log(`DB_HOST=${config.host}`);
      console.log(`DB_USER=${config.user}`);
      console.log(`DB_PASSWORD=${config.password}`);
      console.log(`DB_NAME=${config.database}`);
      console.log('===============================\n');
      
      return; // Esimene töötav konfiguratsioon
      
    } catch (error) {
      console.log(`   ❌ Ebaõnnestus: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('❌ Ükski konfiguratsioon ei töötanud!');
  console.log('💡 Kontrolli MySQL serveri seisukorda või andmeid');
}

testDatabase();
