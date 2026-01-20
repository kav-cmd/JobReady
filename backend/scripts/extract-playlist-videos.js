/**
 * Helper script to extract video IDs from YouTube playlists
 * 
 * Usage:
 * 1. Install: npm install ytpl (or use YouTube Data API v3)
 * 2. Run: node scripts/extract-playlist-videos.js
 * 
 * Or manually:
 * 1. Visit the playlist page
 * 2. Open browser console (F12)
 * 3. Run: Array.from(document.querySelectorAll('a[href*="/watch?v="]')).map(a => a.href.match(/[?&]v=([^&]+)/)?.[1]).filter(Boolean)
 * 4. Copy the video IDs and update Learning.tsx
 */

const playlists = {
  englishSpeaking: {
    id: 'PLpuxPG4TUOR4aBqSJEE9EQHP3oyrItJly',
    url: 'https://youtube.com/playlist?list=PLpuxPG4TUOR4aBqSJEE9EQHP3oyrItJly',
    name: 'English Speaking'
  },
  customerService: {
    id: 'PLWPirh4EWFpEnY0b4Bc_YPWDb3seX4g2o',
    url: 'https://youtube.com/playlist?list=PLWPirh4EWFpEnY0b4Bc_YPWDb3seX4g2o',
    name: 'Customer Service Practices'
  }
};

console.log('YouTube Playlist Video Extractor');
console.log('================================\n');

console.log('To extract video IDs:');
console.log('1. Visit each playlist URL');
console.log('2. Open browser console (F12)');
console.log('3. Run this code:\n');
console.log(`
  // Extract video IDs from current page
  const videoIds = Array.from(document.querySelectorAll('a[href*="/watch?v="]'))
    .map(a => {
      const match = a.href.match(/[?&]v=([^&]+)/);
      return match ? match[1] : null;
    })
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
  
  console.log('Video IDs:', videoIds);
  console.log('Count:', videoIds.length);
`);

console.log('\nPlaylists to extract:');
Object.values(playlists).forEach(playlist => {
  console.log(`\n${playlist.name}:`);
  console.log(`  URL: ${playlist.url}`);
  console.log(`  ID: ${playlist.id}`);
});

console.log('\nAfter extracting, update frontend/src/pages/Learning.tsx with the video IDs.');
