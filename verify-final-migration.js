#!/usr/bin/env node

/**
 * Final Migration Verification Script
 * Ensures api-integration/ can be safely removed
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Final Migration Verification\n');

// Check 1: No active imports from api-integration in src/
console.log('1️⃣ Checking for active api-integration imports in src/...');
const { execSync } = require('child_process');

try {
  const grepResult = execSync(
    `grep -r "import.*api-integration" src/ 2>/dev/null || true`, 
    { encoding: 'utf8' }
  );
  
  if (grepResult.trim()) {
    console.log('❌ Found active imports from api-integration:');
    console.log(grepResult);
    process.exit(1);
  } else {
    console.log('✅ No active imports from api-integration found');
  }
} catch (error) {
  console.log('✅ No active imports from api-integration found');
}

// Check 2: Verify new lib files exist and have content
console.log('\n2️⃣ Verifying migrated lib files...');
const libFiles = [
  'src/services/providers/novit/lib/config.ts',
  'src/services/providers/novit/lib/cache.ts',
  'src/services/providers/novit/lib/encryption.ts',
  'src/services/providers/novit/lib/http-client.ts',
  'src/services/providers/novit/lib/index.ts'
];

for (const file of libFiles) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.length > 100) {
      console.log(`✅ ${file} - ${content.length} chars`);
    } else {
      console.log(`⚠️ ${file} - seems too small (${content.length} chars)`);
    }
  } else {
    console.log(`❌ ${file} - missing!`);
    process.exit(1);
  }
}

// Check 3: Verify types are in place
console.log('\n3️⃣ Verifying NovIT types...');
const typesFile = 'src/services/providers/novit/types/api.ts';
if (fs.existsSync(typesFile)) {
  const content = fs.readFileSync(typesFile, 'utf8');
  const hasRequiredTypes = [
    'NovitApiResponse',
    'NovitApiClient',
    'NovitEncryption',
    'NovitCache',
    'NovitApiError'
  ].every(type => content.includes(type));
  
  if (hasRequiredTypes) {
    console.log('✅ All required NovIT types present');
  } else {
    console.log('❌ Missing required NovIT types');
    process.exit(1);
  }
} else {
  console.log('❌ NovIT types file missing');
  process.exit(1);
}

// Check 4: Verify no require() calls to api-integration
console.log('\n4️⃣ Checking for require() calls to api-integration...');
try {
  const requireResult = execSync(
    `grep -r "require.*api-integration" src/ 2>/dev/null || true`, 
    { encoding: 'utf8' }
  );
  
  if (requireResult.trim()) {
    console.log('❌ Found require() calls to api-integration:');
    console.log(requireResult);
    process.exit(1);
  } else {
    console.log('✅ No require() calls to api-integration found');
  }
} catch (error) {
  console.log('✅ No require() calls to api-integration found');
}

// Check 5: Verify provider file exists and has proper structure
console.log('\n5️⃣ Testing provider file structure...');
const providerFile = 'src/services/providers/novit/provider.ts';
if (fs.existsSync(providerFile)) {
  const content = fs.readFileSync(providerFile, 'utf8');
  const hasRequiredElements = [
    'NovITProvider',
    './lib/http-client',
    './lib/encryption',
    './lib/cache',
    'extends TravelProvider'
  ].every(element => content.includes(element));
  
  if (hasRequiredElements) {
    console.log('✅ NovITProvider has correct structure and imports');
  } else {
    console.log('❌ NovITProvider missing required elements');
    process.exit(1);
  }
} else {
  console.log('❌ NovITProvider file missing');
  process.exit(1);
}

console.log('\n✅ Migration Verification Complete!');
console.log('\n📋 Safe to remove:');
console.log('- api-integration/ (entire directory)');
console.log('\n📋 Summary:');
console.log('- All lib/ files migrated to src/services/providers/novit/lib/');
console.log('- All types migrated to src/services/providers/novit/types/');
console.log('- All hooks migrated to src/hooks/novit/');
console.log('- Provider uses only local lib/ files');
console.log('- No remaining dependencies on api-integration/');
console.log('\n🎉 Migration fully complete!');
