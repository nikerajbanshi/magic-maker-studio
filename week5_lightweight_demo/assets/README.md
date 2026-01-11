# Assets Folder

This folder contains placeholder assets for the SoundSteps Flashcard demo.

## Required Assets

### Images (WebP format for optimization)
- `apple.webp` - Image of an apple for letter A
- `ball.webp` - Image of a ball for letter B

### Audio (MP3 format, compressed)
- `a-sound.mp3` - Phonetic sound for letter A ("ah" or "ay")
- `b-sound.mp3` - Phonetic sound for letter B ("buh")

## Replacing Placeholder Files

The current files are placeholders. To use real assets:

1. **Images**: Replace `.webp` files with actual WebP images (recommended size: 200x200px)
   - Use an online converter like [squoosh.app](https://squoosh.app) to convert images to WebP
   - Target file size: < 50KB per image

2. **Audio**: Replace `.mp3` files with actual audio recordings
   - Keep audio clips short (1-2 seconds)
   - Use compression to reduce file size (target: < 20KB per file)
   - Sample rate: 44.1kHz mono is sufficient

## Optimization Tips

- WebP provides 25-35% smaller file sizes compared to JPEG/PNG
- MP3 at 64-96kbps is sufficient for voice/phonics audio
- Use `loading="lazy"` on images (already implemented in HTML)
- Preload audio files for instant playback (already implemented)
