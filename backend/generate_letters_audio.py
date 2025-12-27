from gtts import gTTS
import os

os.makedirs("static/audio/letters", exist_ok=True)

letters = [chr(c) for c in range(ord('a'), ord('z') + 1)]

for letter in letters:
    tts = gTTS(text=letter, lang='en', slow=False)
    tts.save(f"static/audio/letters/{letter}.mp3")
    print(f"✓ Generated: {letter}")
