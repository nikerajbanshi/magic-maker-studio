#!/usr/bin/env python3
"""
===============================================================
SoundSteps Audio Generator
===============================================================
Generates MP3 audio files for:
- Individual letter phonemes (a-z)
- Word sounds (cat, dog, bat, etc.)
- Segmented word sounds (c-a-t)
- Blended word sounds

Requirements:
- macOS with 'say' command (built-in)
- ffmpeg (install via: brew install ffmpeg)

Usage:
    python3 scripts/generate_audio.py

Output:
    static/assets/audio/*.mp3
===============================================================
"""

import subprocess
import os
import sys
from pathlib import Path

# ============================================================
# Configuration
# ============================================================

# Base paths - script is in /scripts, audio goes to /static/assets/audio
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
AUDIO_DIR = PROJECT_ROOT / "static" / "assets" / "audio"

# Voice settings for macOS 'say' command
VOICE = "Samantha"  # Clear female voice, good for phonics

# Words used in the app
SOUNDOUT_WORDS = [
    "cat", "dog", "bat", "pen", "sun", "hat", "bed", "pig", "fox", "bus",
    "cup", "red", "net", "wet", "hop", "leg", "map", "top", "zip", "fun", 
    "run", "van", "big", "sit", "hot", "got", "mud", "rug", "jug", "hut"
]

# Minimal pairs words (p/b, t/d, k/g, f/v pairs)
MINIMAL_PAIRS_WORDS = [
    # p/b pairs
    "pat", "bat", "pen", "ben", "pie", "buy", "pan", "ban", "pea", "bee",
    # t/d pairs
    "tan", "dan", "ten", "den", "tip", "dip", "toe", "doe", "tie", "die",
    # k/g pairs
    "cap", "gap", "coat", "goat", "curl", "girl", "cold", "gold", "cot", "got",
    # f/v pairs
    "fan", "van", "face", "vase", "fine", "vine", "fast", "vast", "few", "view"
]

# Flashcard words (A-Z words)
FLASHCARD_WORDS = [
    "apple", "ball", "cat", "dog", "egg", "fish", "goat", "hat", "ice",
    "jet", "kite", "lion", "moon", "nest", "orange", "pig", "queen",
    "rain", "sun", "tree", "umbrella", "van", "water", "xray", "yak", "zebra"
]

# Phoneme pronunciations - how to say each letter sound
PHONEME_PRONUNCIATIONS = {
    'a': 'ah',      # short a as in "apple"
    'b': 'buh',     # b sound
    'c': 'kuh',     # hard c sound
    'd': 'duh',     # d sound
    'e': 'eh',      # short e as in "egg"
    'f': 'fuh',     # f sound
    'g': 'guh',     # hard g sound
    'h': 'huh',     # h sound
    'i': 'ih',      # short i as in "it"
    'j': 'juh',     # j sound
    'k': 'kuh',     # k sound
    'l': 'luh',     # l sound
    'm': 'muh',     # m sound
    'n': 'nuh',     # n sound
    'o': 'oh',      # short o as in "on"
    'p': 'puh',     # p sound
    'q': 'kwuh',    # q sound
    'r': 'ruh',     # r sound
    's': 'sss',     # s sound (hissing)
    't': 'tuh',     # t sound
    'u': 'uh',      # short u as in "up"
    'v': 'vuh',     # v sound
    'w': 'wuh',     # w sound
    'x': 'ks',      # x sound
    'y': 'yuh',     # y sound
    'z': 'zzz'      # z sound (buzzing)
}


# ============================================================
# Audio Generation Functions
# ============================================================

def check_dependencies():
    """Check if required tools are installed"""
    print("🔍 Checking dependencies...")
    
    # Check for 'say' command (macOS) - note: 'say' doesn't support --version
    try:
        # Just check if 'say' exists by running it with no args (will show usage)
        result = subprocess.run(['which', 'say'], capture_output=True)
        if result.returncode == 0:
            print("  ✅ macOS 'say' command available")
        else:
            raise FileNotFoundError("say not found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("  ❌ macOS 'say' command not found")
        print("     This script requires macOS")
        return False
    
    # Check for ffmpeg
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("  ✅ ffmpeg available")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("  ❌ ffmpeg not found")
        print("     Install with: brew install ffmpeg")
        return False
    
    return True


def generate_audio(text, output_path, rate=180):
    """
    Generate MP3 audio using macOS 'say' and ffmpeg
    
    Args:
        text: Text to speak
        output_path: Path for output MP3 file
        rate: Speech rate (words per minute)
    
    Returns:
        True if successful, False otherwise
    """
    aiff_path = str(output_path).replace('.mp3', '.aiff')
    
    try:
        # Step 1: Generate AIFF with 'say'
        subprocess.run([
            'say',
            '-v', VOICE,
            '-r', str(rate),
            '-o', aiff_path,
            text
        ], check=True, capture_output=True)
        
        # Step 2: Convert to MP3 with ffmpeg (low quality for smaller files)
        subprocess.run([
            'ffmpeg',
            '-y',                    # Overwrite output
            '-i', aiff_path,         # Input file
            '-acodec', 'libmp3lame', # MP3 codec
            '-ab', '64k',            # Bitrate: 64kbps (low quality, small file)
            '-ar', '22050',          # Sample rate: 22kHz
            '-ac', '1',              # Mono audio
            str(output_path)
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Clean up temp AIFF file
        if os.path.exists(aiff_path):
            os.remove(aiff_path)
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"    Error: {e}")
        # Clean up temp file on error
        if os.path.exists(aiff_path):
            os.remove(aiff_path)
        return False
    except Exception as e:
        print(f"    Unexpected error: {e}")
        return False


def generate_phoneme_sounds():
    """Generate individual letter/phoneme sounds"""
    print("\n" + "=" * 50)
    print("🔤 GENERATING PHONEME SOUNDS (a-z)")
    print("=" * 50)
    
    success = 0
    failed = 0
    
    for letter, pronunciation in PHONEME_PRONUNCIATIONS.items():
        output_path = AUDIO_DIR / f"{letter}-sound.mp3"
        print(f"  /{letter}/ → \"{pronunciation}\"...", end=" ")
        
        if generate_audio(pronunciation, output_path, rate=140):
            print("✅")
            success += 1
        else:
            print("❌")
            failed += 1
    
    print(f"\n  Summary: {success} succeeded, {failed} failed")
    return success, failed


def generate_word_sounds():
    """Generate complete word sounds"""
    print("\n" + "=" * 50)
    print("📚 GENERATING WORD SOUNDS")
    print("=" * 50)
    
    # Combine all unique words
    all_words = set(SOUNDOUT_WORDS + MINIMAL_PAIRS_WORDS + FLASHCARD_WORDS)
    
    success = 0
    failed = 0
    
    for word in sorted(all_words):
        output_path = AUDIO_DIR / f"{word}.mp3"
        print(f"  \"{word}\"...", end=" ")
        
        if generate_audio(word, output_path, rate=150):
            print("✅")
            success += 1
        else:
            print("❌")
            failed += 1
    
    print(f"\n  Summary: {success} succeeded, {failed} failed")
    return success, failed


def generate_segmented_sounds():
    """Generate segmented sounds (letter by letter with pauses)"""
    print("\n" + "=" * 50)
    print("🔊 GENERATING SEGMENTED SOUNDS")
    print("=" * 50)
    
    success = 0
    failed = 0
    
    for word in SOUNDOUT_WORDS:
        output_path = AUDIO_DIR / f"{word}-segmented.mp3"
        
        # Build segmented pronunciation: c...a...t with pauses
        # Using [[slnc X]] for silence in macOS say command
        phonemes = []
        for letter in word:
            phoneme = PHONEME_PRONUNCIATIONS.get(letter, letter)
            phonemes.append(phoneme)
        
        # Join with silence markers (300ms pause)
        segmented_text = " [[slnc 400]] ".join(phonemes)
        
        print(f"  \"{word}\" → {'-'.join(list(word))}...", end=" ")
        
        if generate_audio(segmented_text, output_path, rate=120):
            print("✅")
            success += 1
        else:
            print("❌")
            failed += 1
    
    print(f"\n  Summary: {success} succeeded, {failed} failed")
    return success, failed


def generate_blended_sounds():
    """Generate blended (normal speed) word sounds"""
    print("\n" + "=" * 50)
    print("🎵 GENERATING BLENDED SOUNDS")
    print("=" * 50)
    
    success = 0
    failed = 0
    
    for word in SOUNDOUT_WORDS:
        output_path = AUDIO_DIR / f"{word}-blended.mp3"
        print(f"  \"{word}\" (blended)...", end=" ")
        
        if generate_audio(word, output_path, rate=160):
            print("✅")
            success += 1
        else:
            print("❌")
            failed += 1
    
    print(f"\n  Summary: {success} succeeded, {failed} failed")
    return success, failed


def clean_old_files():
    """Remove old audio files"""
    print("\n🧹 Cleaning old audio files...")
    
    count = 0
    for pattern in ['*.mp3', '*.aiff', '*.m4a']:
        for f in AUDIO_DIR.glob(pattern):
            f.unlink()
            count += 1
    
    print(f"  Removed {count} old files")


def main():
    """Main entry point"""
    print("\n" + "=" * 60)
    print("🎤 SoundSteps Audio Generator")
    print("=" * 60)
    print(f"\nOutput directory: {AUDIO_DIR}")
    
    # Check dependencies
    if not check_dependencies():
        print("\n❌ Missing dependencies. Please install required tools.")
        sys.exit(1)
    
    # Create output directory
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    print(f"\n📁 Output directory ready: {AUDIO_DIR}")
    
    # Clean old files
    clean_old_files()
    
    # Generate all audio files
    total_success = 0
    total_failed = 0
    
    s, f = generate_phoneme_sounds()
    total_success += s
    total_failed += f
    
    s, f = generate_word_sounds()
    total_success += s
    total_failed += f
    
    s, f = generate_segmented_sounds()
    total_success += s
    total_failed += f
    
    s, f = generate_blended_sounds()
    total_success += s
    total_failed += f
    
    # Summary
    print("\n" + "=" * 60)
    print("✨ GENERATION COMPLETE!")
    print("=" * 60)
    print(f"\n  Total files generated: {total_success}")
    print(f"  Failed: {total_failed}")
    print(f"  Location: {AUDIO_DIR}")
    
    # List generated files
    mp3_files = list(AUDIO_DIR.glob("*.mp3"))
    print(f"\n  MP3 files created: {len(mp3_files)}")
    
    if mp3_files:
        print("\n  Sample files:")
        for f in sorted(mp3_files)[:10]:
            size_kb = f.stat().st_size / 1024
            print(f"    - {f.name} ({size_kb:.1f} KB)")
        if len(mp3_files) > 10:
            print(f"    ... and {len(mp3_files) - 10} more")
    
    print("\n🎉 Done! You can now use the audio files in the app.")
    print("   Refresh your browser to load the new audio files.\n")


if __name__ == "__main__":
    main()
