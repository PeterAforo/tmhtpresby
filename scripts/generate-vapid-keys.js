/**
 * VAPID Key Generation Script
 * Run: node scripts/generate-vapid-keys.js
 * 
 * This generates the VAPID keys needed for Web Push notifications.
 * Add the generated keys to your .env file.
 * 
 * IMPORTANT: Never commit the private key to version control!
 */

const webpush = require('web-push');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('\n=== VAPID Keys Generated ===\n');
console.log('Add these to your .env file:\n');
console.log('# Frontend (public)');
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log('\n# Backend (private - NEVER expose to client)');
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:admin@mhtpcaccra.org`);
console.log('\n⚠️  NEVER commit the private key to version control!');
console.log('Add VAPID_PRIVATE_KEY to your .gitignore if not already.\n');
