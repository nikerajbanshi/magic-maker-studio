# Functional Specification Document  
**Project Name:** SoundSteps (Magic Maker Studio v(1.1))  
**Team:** Team A
**Authors:** Dikshya Rai, Binam Poudel, Nikesh Rajbanshi  
**Bootcamp Week:** Week 3  
**Repository:** https://github.com/nikerajbanshi/magic-maker-studio  

---

## 1. Introduction

This document defines the functional specification for **SoundSteps**, a gamified phonics and pronunciation learning application developed as part of the Bootcamp & Hackathon. The system is designed to support early-stage language learners by guiding them through structured phonics acquisition using interactive, scenario-based learning experiences.

The specification serves as a foundational reference for design, development, testing, and iteration throughout the remainder of the project lifecycle.

---

## 2. Project Vision

SoundSteps leverages the **Magic Maker learning engine** to transition learners through the four stages of competence:
- Unconscious Incompetence  
- Conscious Incompetence  
- Conscious Competence  
- Unconscious Competence  

The application integrates phonics instruction, auditory discrimination, and contextual practice through progressive, gamified modules.

---

## 3. Target Users

- Early language learners (children and beginner ESL learners)
- Educators seeking interactive phonics tools
- Self-guided learners requiring auditory reinforcement

---

## 4. Core System Features

### 4.1 Interactive Phonics Flashcards (Remember Phase)

**Description:**  
A digital A–Z phonics flashcard system presenting isolated phonemes paired with visual anchors to establish foundational sound recognition.

**User Scenario:**  
The learner selects a letter card (e.g., “A”) and hears its phoneme while viewing an animated visual representation.

**Inputs:**  
- User tap gesture  
- Selected letter identifier  

**Outputs:**  
- Audio playback of phoneme  
- Visual animation/highlight  

**Required Screens:**  
- Flashcard Deck Screen  

**Priority:**  
- Must-have  

---

### 4.2 Phonetic Blending Slider (Understand Phase)

**Description:**  
An interactive blending interface allowing users to control phoneme blending speed to understand sound-to-word formation.

**User Scenario:**  
The learner drags a slider across the word “fit” to hear segmented phonemes and then a fully blended pronunciation.

**Inputs:**  
- Drag/swipe gesture  
- Gesture speed  

**Outputs:**  
- Variable-speed audio playback  
- Visual blending indicators  

**Required Screens:**  
- Blending Practice Screen  

**Priority:**  
- Must-have  

---

### 4.3 Hungry Monster Game (Apply Phase)

**Description:**  
A game-based reinforcement activity providing immediate feedback on listening comprehension.

**User Scenario:**  
After hearing a word, the learner drags the correct option to the monster. Correct selections trigger positive animations.

**Inputs:**  
- Drag-and-drop gesture  
- Selected word object  

**Outputs:**  
- Animation feedback  
- Sound effects  
- Score updates  

**Required Screens:**  
- Game Screen  

**Priority:**  
- Must-have  

---

### 4.4 Minimal Pair Sorter (Analyze Phase)

**Description:**  
A comparative tool for distinguishing similar phonemes (e.g., long vs. short vowels).

**User Scenario:**  
The learner hears a word and sorts it into the correct phoneme category bucket.

**Inputs:**  
- Tap or drag selection  

**Outputs:**  
- Correct/incorrect visual indicators  
- Explanatory feedback  

**Required Screens:**  
- Analysis / Sorting Screen  

**Priority:**  
- Must-have  

---

### 4.5 Contextual Story Mode (Create Phase)

**Description:**  
An interactive storytelling environment where learners identify target sounds within continuous speech.

**User Scenario:**  
The learner taps the screen whenever a target phoneme occurs in a narrated story.

**Inputs:**  
- Time-synchronized user taps  

**Outputs:**  
- Highlighted text  
- Real-time scoring feedback  

**Required Screens:**  
- Story Reader Screen  

**Priority:**  
- Nice-to-have  

---

### 4.6 Competence Dashboard

**Description:**  
A progress visualization module showing learner advancement across phonics categories and competence levels.

**User Scenario:**  
The learner reviews progress and achievement badges after completing sessions.

**Inputs:**  
- System-generated performance data  

**Outputs:**  
- Progress bars  
- Competence level indicators  
- Achievement badges  

**Required Screens:**  
- User Dashboard  

**Priority:**  
- Must-have  

---

### 4.7 User Authentication

**Description:**  
A secure authentication mechanism enabling persistent user profiles and progress tracking.

**User Scenario:**  
A first-time user registers and later resumes learning from saved progress.

**Inputs:**  
- Email and password or OAuth token  

**Outputs:**  
- Authentication token  
- Persistent user session  

**Required Screens:**  
- Login / Registration Screens  

**Priority:**  
- Must-have  

---

## 5. Non-Functional Considerations

- **Scalability:** Backend APIs designed for modular expansion  
- **Security:** Token-based authentication and input validation  
- **Accessibility:** Visual and auditory feedback for diverse learners  
- **Maintainability:** Clear separation of concerns (API, services, UI)

---

## 6. Future Extensions

- Adaptive difficulty based on learner performance  
- Teacher analytics dashboard  
- Offline phonics practice mode  

---

## 7. Conclusion

This functional specification establishes the baseline requirements for SoundSteps and will guide iterative development throughout the Bootcamp & Hackathon. Subsequent design and implementation decisions will reference this document to ensure pedagogical alignment and technical consistency.
