/**
 * PWA Icon Generation Script
 * Run: node scripts/generate-icons.js
 * 
 * Generates all required PWA icon sizes from a source image.
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_ICON = path.join(__dirname, '../public/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');
const BACKGROUND_COLOR = '#FFFFFF';

// Icon sizes to generate
const STANDARD_SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];
const SHORTCUT_ICONS = ['sermons', 'events', 'give', 'live'];

async function generateIcons() {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Check if source icon exists
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error(`❌ Source icon not found: ${SOURCE_ICON}`);
    console.log('Please place a high-resolution logo.png (at least 512x512) in the public folder.');
    process.exit(1);
  }

  console.log('🎨 Generating PWA icons...\n');

  // Generate standard icons
  for (const size of STANDARD_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(SOURCE_ICON)
      .resize(size, size, { fit: 'contain', background: BACKGROUND_COLOR })
      .png()
      .toFile(outputPath);
    console.log(`✅ Generated icon-${size}x${size}.png`);
  }

  // Generate maskable icons (with 20% safe zone padding)
  for (const size of MASKABLE_SIZES) {
    const padding = Math.floor(size * 0.1); // 10% padding on each side = 20% total safe zone
    const innerSize = size - (padding * 2);
    
    const outputPath = path.join(OUTPUT_DIR, `icon-maskable-${size}x${size}.png`);
    
    // Create a background canvas and composite the resized logo
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BACKGROUND_COLOR
      }
    })
      .composite([{
        input: await sharp(SOURCE_ICON)
          .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .toBuffer(),
        gravity: 'center'
      }])
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Generated icon-maskable-${size}x${size}.png`);
  }

  // Generate shortcut icons
  for (const name of SHORTCUT_ICONS) {
    const outputPath = path.join(OUTPUT_DIR, `shortcut-${name}.png`);
    await sharp(SOURCE_ICON)
      .resize(96, 96, { fit: 'contain', background: BACKGROUND_COLOR })
      .png()
      .toFile(outputPath);
    console.log(`✅ Generated shortcut-${name}.png`);
  }

  // Generate Apple touch icon
  const appleTouchPath = path.join(OUTPUT_DIR, 'apple-touch-icon.png');
  await sharp(SOURCE_ICON)
    .resize(180, 180, { fit: 'contain', background: BACKGROUND_COLOR })
    .png()
    .toFile(appleTouchPath);
  console.log('✅ Generated apple-touch-icon.png');

  // Generate favicon
  const faviconPath = path.join(__dirname, '../public/favicon.ico');
  await sharp(SOURCE_ICON)
    .resize(32, 32, { fit: 'contain', background: BACKGROUND_COLOR })
    .png()
    .toFile(faviconPath.replace('.ico', '.png'));
  console.log('✅ Generated favicon.png');

  console.log('\n🎉 All icons generated successfully!');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
}

generateIcons().catch((error) => {
  console.error('❌ Error generating icons:', error);
  process.exit(1);
});
