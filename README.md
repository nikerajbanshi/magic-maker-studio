# Magic Maker Studio  
**Creative Learning Sandbox**

Magic Maker Studio is a creative learning sandbox designed to support interactive, child-friendly educational experiences. The platform emphasizes guided creativity, literacy development, and safe content sharing within a structured digital environment.

This repository establishes a **scalable full-stack foundation** using a decoupled architecture, prioritizing clean project organization, collaborative workflows, and future extensibility.

---

## Project Context

This repository represents the **Week 4** of a 6-week bootcamp and hackathon.

**Primary focus this week:**
- Git & GitHub project management
- Python backend development
- API fundamentals
- Frontend scaffolding
- Clear documentation and structure

Feature completeness is intentionally deferred in favor of architectural clarity and long-term feasibility.

---

## Technical Architecture

- **Backend:** Python 3.13, FastAPI  
- **Frontend:** React with Vite  
- **API Design:** RESTful endpoints with automatic OpenAPI documentation  
- **Workflow:** Feature-based branching with incremental commits  

The backend and frontend are fully decoupled to support independent development and future scaling.

---

## Repository Structure
```text
magic-maker-studio/
├── backend/              # FastAPI backend application
├── frontend/             # React frontend (Vite)
├── docs/                 # Technical notes and planning documents 
├── initial_scope.md      # Early feature and scope definition
├── CONTRIBUTING.md       # Contribution and setup guidelines
├── .gitignore            # Environment and dependency exclusions
└── README.md             # Project overview

## Week 3 Status

- Functional Specification finalized and documented for SoundSteps : Magic Maker Studio v1.1
- Backend routers scaffolded to match learning phases
- Frontend screen skeletons prepared (mobile-first)
- Ready for UI wireframing and API integration

## Week 4 Status

This week's deliverable successfully establishes the link between the SoundSteps user experience and its underlying data requirements.
By visualizing the core screens and mapping them to specific database fields, the team has created a clear blueprint for development.
As we proceed towards the final two weeks of development, we are diligently focused on creating a cohesive system with all the learnings from the bootcamp.

## Week 5 Status

This week marks the successful transition from design to functional code with the delivery of the Lightweight Web Content Demonstration. By implementing the core Flashcard module using performance-first principles, the team has validated the technical feasibility of a lightweight, accessible educational tool.

Functional Implementation: Developed the standalone Flashcard Screen (A–Z) using semantic HTML and vanilla JavaScript.

Optimization Strategy: Achieved sub-150KB page weight through WebP image conversion, audio compression, and deferred loading.

Testing & Verification: Executed a comprehensive 15-point test plan covering cross-browser compatibility, mobile responsiveness, and Lighthouse performance metrics.

Deliverable: Finalized the standalone demo package ready for functional review, proving the concept works offline and on low-bandwidth connections.

