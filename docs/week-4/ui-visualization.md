# Week 4 – Screen to Database Field Mapping

**Project:** SoundSteps – Interactive English Pronunciation Learning Platform
**Scope:** UI visualization + data modeling (Week 4 only)
**Note:** Database fields are conceptual and non-binding at this stage.

---

## 1. Login Screen

**Purpose:** Authenticate returning users and resume learning progress.

| UI Element             | Description                      | Database Field | Data Type           |
| ---------------------- | -------------------------------- | -------------- | ------------------- |
| Username / Email input | User identification credential   | email          | VARCHAR             |
| Password input         | Secure authentication credential | password_hash  | TEXT                |
| Sign In button         | Triggers authentication process  | —              | —                   |
| Error message text     | Displays login failure reason    | auth_error     | VARCHAR (transient) |

**Related Entity:** `User`

---

## 2. Register Screen

**Purpose:** Create a new learner account in a child-safe environment.

| UI Element                 | Description                       | Database Field | Data Type |
| -------------------------- | --------------------------------- | -------------- | --------- |
| Username input             | Display name for learner          | username       | VARCHAR   |
| Email input                | Account recovery & login          | email          | VARCHAR   |
| Password input             | Initial authentication credential | password_hash  | TEXT      |
| Sign Up button             | Submits registration data         | —              | —         |
| Account creation timestamp | Auto-generated                    | created_at     | TIMESTAMP |

**Related Entity:** `User`

---

## 3. Dashboard Screen

**Purpose:** Provide a central navigation hub.

| UI Element               | Description                       | Database Field      | Data Type |
| ------------------------ | --------------------------------- | ------------------- | --------- |
| User avatar              | Visual learner identity           | avatar_url          | TEXT      |
| Learner name             | Display name                      | username            | VARCHAR   |
| Flashcards module card   | Access to A–Z phonics             | module_flashcards   | BOOLEAN   |
| Sound It Out module card | Access to sound blending activity | module_sound_it_out | BOOLEAN   |
| Story Game module card   | Access to listening game          | module_story_game   | BOOLEAN   |
| Mouth Moves module card  | Access to articulation visuals    | module_mouth_moves  | BOOLEAN   |

**Related Entities:** `User`

---

## 4️⃣ Flashcards Screen (A–Z)

**Purpose:** Reinforce phoneme–letter associations through audio-visual cues.

| UI Element                   | Description                | Database Field | Data Type |
| ---------------------------- | -------------------------- | -------------- | --------- |
| Alphabet letter (A–Z)        | Current phoneme target     | letter         | CHAR      |
| Illustration image           | Visual association         | image_url      | TEXT      |
| Sound play button            | Triggers phoneme audio     | audio_url      | TEXT      |
| Flashcard index (e.g., 1/26) | Learning sequence tracking | card_index     | INTEGER   |
| Completion state             | Indicates viewed card      | is_completed   | BOOLEAN   |

**Related Entities:** `Flashcard`, `UserFlashcardProgress`

---

## 📌 Week-4 Clarification Notes

* No database is implemented at this stage and field definitions represent **design intent**, not final schema.
* Relationships (e.g., User → Progress) will be finalized in Week 5.
* All mappings directly reflect the Figma wireframes updated as pngs in the screenshots directory of the repo for easier access.
