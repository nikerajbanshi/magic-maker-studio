# API Routers Overview (Week 3)

This directory contains FastAPI router modules organized by learning domain
and aligned with the Week 3 Functional Specification for **Magic Maker Studio v1.1**.

At this stage of the bootcamp, routers define **API intent and boundaries only**.
Business logic, database integration, and authentication enforcement will be
implemented in later weeks.

---

## Router Structure

### `/health`
**Purpose:**  
System-level health and availability checks.

**Status:**  
Implemented and active.

**Use Case:**  
- Verifies backend is running
- Used for early frontend–backend integration testing

---

### `/phonics/flashcards`
**Mapped Feature:**  
Interactive Phonics Flashcards (Remember Phase)

**Planned Responsibilities:**
- Serve phoneme metadata (letters, symbols)
- Trigger phoneme audio playback references
- Support flashcard sequencing

**Week-3 Scope:**  
- Placeholder endpoints returning static or mock data

---

### `/phonics/blending`
**Mapped Feature:**  
Phonetic Blending Slider (Understand Phase)

**Planned Responsibilities:**
- Accept blend control input (e.g., slider position)
- Respond with phoneme timing metadata

**Week-3 Scope:**  
- Structural endpoints only (no audio logic)

---

### `/phonics/games`
**Mapped Features:**  
- Hungry Monster Game  
- Minimal Pair Sorter

**Planned Responsibilities:**
- Accept learner selections
- Return correctness feedback and scoring signals

**Week-3 Scope:**  
- Mock response schemas demonstrating interaction flow

---

### `/phonics/progress`
**Mapped Feature:**  
Competence Dashboard

**Planned Responsibilities:**
- Return learner progress summaries
- Aggregate phonics performance data

**Week-3 Scope:**  
- Static progress payloads (no persistence yet)

---

## Notes

- All routers are included in `main.py` to ensure visibility in OpenAPI docs.
- Route prefixes reflect feature ownership, not implementation completeness.
- This structure directly mirrors the Functional Specification Document
  located at `docs/week-3/functional-spec.md`.

