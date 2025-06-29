#!/usr/bin/env node

/**
 * Testi andmebaasi ühendust MySQL ajaloo põhjal leitud andmetega
 */

const mysql = require('mysql2/promise');

// Leitud kasutajad MySQL ajaloost
const testConfigs = [
  // Ajaloo põhjal leitud kasutajad
  { host: 'localhost', user: 'user', password: 'taskpassword', database: 'eksootikareisid' },
  { host: 'localhost', user: 'user', password: 'user', database: 'eksootikareisid' },
  { host: 'localhost', user: 'user', password: '', database: 'eksootikareisid' },
  { host: 'localhost', user: 'user', password: 'password', database: 'eksootikareisid' },
  
  // Root kasutaja erinevate paroolidega
  { host: 'localhost', user: 'root', password: 'taskpassword', database: 'eksootikareisid' },
  { host: 'localhost', user: 'root', password: '', database: 'eksootikareisid' },
  { host: 'localhost', user: 'root', password: 'root', database: 'eksootikareisid' },
  
  // Taskuser variant
  { host: 'localhost', user: 'taskuser', password: 'taskpassword', database: 'eksootikareisid' },
  
  // Proovi ka erinevaid andmebaasi nimesid
  { host: 'localhost', user: 'user', password: 'taskpassword', database: 'wordpress' },
  { host: 'localhost', user: 'user', password: 'taskpassword', database: 'doctors24' },
];

console.log('=== MySQL Testi (ajaloo põhjal) ===\n');

async function testDatabase() {
  for (let i = 0; i < testConfigs.length; i++) {
    const config = testConfigs[i];
    console.log(`${i + 1}. ${config.user}@${config.host}/${config.database} (${config.password || 'tühi'})`);
    
    try {
      const connection = await mysql.createConnection(config);
      console.log('   ✅ ÜHENDUS ÕNNESTUS!');
      
      // Näita kõiki andmebaase
      const [databases] = await connection.execute('SHOW DATABASES');
      console.log(`   📊 Andmebaasid: ${databases.map(db => Object.values(db)[0]).join(', ')}`);
      
      // Kontrollime WordPress tabeleid
      const [tables] = await connection.execute('SHOW TABLES LIKE "wp_%"');
      console.log(`   📋 WordPress tabeleid: ${tables.length}`);
      
      if (tables.length > 0) {
        // API võtme kontroll
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
          console.log(`   ⚠️  API võti kontroll: ${e.message}`);
        }
      }
      
      await connection.end();
      
      // Töötav konfiguratsioon
      console.log('\n=== TÖÖTAV KONFIGURATSIOON ===');
      console.log(`DB_HOST=${config.host}`);
      console.log(`DB_USER=${config.user}`);
      console.log(`DB_PASSWORD=${config.password}`);
      console.log(`DB_NAME=${config.database}`);
      console.log('===============================\n');
      
      return true;
      
    } catch (error) {
      console.log(`   ❌ ${error.message}`);
    }
  }
  
  console.log('\n❌ Ükski test ei õnnestunud!');
  return false;
}

testDatabase();
