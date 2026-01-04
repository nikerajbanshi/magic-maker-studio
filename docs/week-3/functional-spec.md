# Functional Specification Document  
**Project:** SoundSteps: Magic Maker Studio v1.1  
**Team:** Team A  
**Authors:** Dikshya Rai, Binam Poudel, Nikesh Rajbanshi  
**Bootcamp Week:** Week 3  
**Repository:** https://github.com/nikerajbanshi/magic-maker-studio  
**Date:** 2025-12-27  

---

## 1. Overview

This document defines the functional specification for **SoundSteps:Magic Maker Studio v1.1**, a mobile-first, gamified phonics and pronunciation learning application.  
The specification is aligned with Week 3 learning outcomes, emphasizing:

- Scenario-based educational content planning  
- Mobile UI layout and design system thinking  
- Clear definition of system features, interactions, and priorities  

Prior to this week, the team successfully established a **working project skeleton**, including:
- Initial FastAPI backend with test endpoints
- Frontend project structure with basic routing and components
- Early integration testing between frontend and backend

This document serves as the foundation for future UI design, development iterations, and hackathon implementation.

---

## 2. Alignment with Week 3 Learning Materials

The system design and features are informed by the following Week 3 resources:

- **Scenario Writing & e-learning Scenarios:**  
  Features are defined using learner-centered scenarios that describe real interactions.
- **Generating Storyboards:**  
  Each feature explicitly identifies required screens, enabling direct translation into storyboards.
- **Mobile UI Design & CSS/Flexbox:**  
  All features assume responsive, mobile-first layouts suitable for Flexbox-based UI implementation.

---

## 3. Project Vision

The application Magic Maker Studio v1.1 aims to guide learners through four stages of competence:

1. Unconscious Incompetence  
2. Conscious Incompetence  
3. Conscious Competence  
4. Unconscious Competence  

The system progressively develops phonics awareness, listening accuracy, and contextual pronunciation through interactive, game-based modules.

---

## 4. Target Users

| User Group | Description |
|----------|-------------|
| Early Learners | Children learning foundational phonics |
| ESL Beginners | Non-native speakers developing pronunciation skills |
| Educators | Teachers seeking structured phonics tools |

---

## 5. Core System Features

### Feature Summary Table

| Feature | Phase | Priority |
|------|------|---------|
| Interactive Phonics Flashcards | Remember | Must-have |
| Sound It Out (Phonetic Blending) | Understand | Must-have |
| Hungry Monster Game | Apply | Must-have |
| Minimal Pair Sorter | Analyze | Must-have |
| Contextual Story Mode | Create | Nice-to-have |
| Competence Dashboard | Monitor | Must-have |
| User Authentication | System | Must-have |

---

### 5.1 Interactive Phonics Flashcards

| Element | Details |
|------|--------|
| Description | A–Z flashcards pairing phonemes with visual anchors |
| User Scenario | Learner taps a letter and hears the phoneme with animation |
| Inputs | Letter ID, tap gesture |
| Outputs | Phoneme audio, animated visual |
| Required Screens | Flashcard Deck Screen |
| Acceptance Criteria | Correct audio plays within 300ms for each letter |
| Success Metrics | ≥90% successful playback rate |
| Accessibility | Large tap targets, replay button |
| Privacy / Data Retention | No personal data stored |
| Priority | Must-have |

---

### 5.2 Sound It Out (Phonetic Blending Slider)

| Element | Details |
|------|--------|
| Description | Slider-controlled blending of phonemes into words |
| User Scenario | Learner drags slider to hear segmented vs blended sounds |
| Inputs | Drag position, gesture speed |
| Outputs | Variable-speed audio, visual blending cues |
| Required Screens | Sound It Out Practice Screen |
| Acceptance Criteria | Audio responds accurately to slider movement |
| Success Metrics | Reduced blending errors over time |
| Accessibility | Visual indicators for audio speed |
| Privacy / Data Retention | Session-level performance data only |
| Priority | Must-have |

**Pedagogical Note:** This feature teaches phonetic blending skills.
**System Module:** `sound_out`

---

### 5.3 Hungry Monster Game

| Element | Details |
|------|--------|
| Description | Gamified listening comprehension with feedback |
| User Scenario | Learner drags correct word to monster |
| Inputs | Drag-and-drop word selection |
| Outputs | Animations, sound effects, score update |
| Required Screens | Game Screen |
| Acceptance Criteria | Correct choices trigger positive feedback |
| Success Metrics | Accuracy improvement across levels |
| Accessibility | Non-color feedback icons |
| Privacy / Data Retention | Scores stored under anonymized user ID |
| Priority | Must-have |

---

### 5.4 Minimal Pair Sorter

| Element | Details |
|------|--------|
| Description | Tool for distinguishing similar phonemes |
| User Scenario | Learner sorts word into correct phoneme bucket |
| Inputs | Tap or drag selection |
| Outputs | Correct/incorrect indicators, explanations |
| Required Screens | Analysis Screen |
| Acceptance Criteria | Accurate phoneme classification |
| Success Metrics | Decrease in repeated misclassification |
| Accessibility | Audio + text explanations |
| Privacy / Data Retention | No audio recordings retained |
| Priority | Nice-to-have |

---

### 5.5 Contextual Story Mode

| Element | Details |
|------|--------|
| Description | Interactive story-based phoneme detection |
| User Scenario | Learner taps when hearing target sound |
| Inputs | Time-synced taps |
| Outputs | Highlighted text, counters |
| Required Screens | Story Reader Screen |
| Acceptance Criteria | Tap timing within tolerance window |
| Success Metrics | Detection accuracy per story |
| Accessibility | Subtitles, speed control |
| Privacy / Data Retention | Interaction data without identifiers |
| Priority | Nice-to-have |

---

### 5.6 Competence Dashboard

| Element | Details |
|------|--------|
| Description | Visualizes learner progress and mastery |
| User Scenario | Learner reviews progress and badges |
| Inputs | System performance data |
| Outputs | Progress bars, badges |
| Required Screens | Dashboard |
| Acceptance Criteria | Progress reflects latest session |
| Success Metrics | Weekly dashboard usage |
| Accessibility | Screen-reader-friendly summaries |
| Privacy / Data Retention | Aggregated learning data |
| Priority | Nice-to-have |

---

### 5.7 User Authentication

| Element | Details |
|------|--------|
| Description | Secure login and profile persistence |
| User Scenario | User registers and resumes progress |
| Inputs | Email/password or OAuth |
| Outputs | Auth token, session |
| Required Screens | Login / Signup |
| Acceptance Criteria | Encrypted credentials, valid sessions |
| Success Metrics | Authentication success rate |
| Accessibility | Keyboard navigation, clear errors |
| Privacy / Data Retention | COPPA-aligned minimal data storage |
| Priority | Must-have |

---

## 6. Non-Functional Requirements

| Category | Requirement |
|-------|-------------|
| Scalability | Modular FastAPI services |
| Security | Token-based auth, input validation |
| Accessibility | WCAG-aligned UI |
| Maintainability | Clear separation of concerns |

---

## 7. Conclusion

This functional specification reflects the long-term vision of the application and establishes a structured reference for UI design, development, and hackathon execution.
