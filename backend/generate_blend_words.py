from gtts import gTTS
import os

os.makedirs("static/audio/words", exist_ok=True)

words = ['fit', 'cat', 'sit', 'dog', 'hop', 'pig', 'bat', 'mat']

for word in words:
    tts = gTTS(text=word, lang='en', slow=False)
    tts.save(f"static/audio/words/{word}.mp3")
    print(f"✓ Generated word audio: {word}")
