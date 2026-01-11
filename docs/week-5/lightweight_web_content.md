# Week 5 – Lightweight Web Content Demonstration

**Project:** SoundSteps
**Module Demonstrated:** Flashcard Screen (A–Z)  
**Scope:** Lightweight web content implementation and performance-focused test design  

---

## 1. Introduction

This document presents the **Week 5 Lightweight Web Content Demo** for the SoundSteps project. The selected module is the **Flashcard Screen**, implemented as a minimal standalone web page demonstrating interactive phonics learning for children.

The objective of this deliverable is to:

- Implement a functional UI component of the final product  
- Apply lightweight web design principles  
- Demonstrate performance-conscious development  
- Define manual test cases covering functionality and optimization goals  

The demo displays two flashcards (A and B) with corresponding images and phonetic audio playback.

---

## 2. UI Reference

The layout is based on the Week 4 Figma wireframe.

**Design Reference Screenshot:**  
`/docs/week-4/screenshots/flashcards.png`

### Implemented Screen Layout

- Full-screen soft gradient background  
- Header with Home icon and SoundSteps title  
- Flashcard title (“Flashcards”)  
- Centered flashcard container (rounded rectangle with shadow)  
- Inside the card:  
  - Capital and lowercase letter (e.g., A a)  
  - Illustration image  
  - Word label  
  - Circular sound playback button  
- Navigation controls:  
  - Previous / Next buttons  
  - Progress indicator (e.g., 1 / 2)  

The layout is responsive and mobile-first.

---

## 3. Lightweight Optimization Strategy

To ensure fast loading and minimal resource usage, the following techniques were applied.

### Image Optimization
- WebP image format for reduced file size  
- Images resized to actual display dimensions  
- Lazy loading enabled  

### Audio Optimization
- Short MP3 audio clips  
- Preloaded for instant playback  
- No background or auto-play audio  

### CSS Optimization
- Single external stylesheet  
- No CSS frameworks  
- Reusable CSS variables for colors and spacing  
- Minimal rule set  

### JavaScript Optimization
- Vanilla JavaScript only  
- Deferred script loading  
- Cached DOM references  
- No external libraries  

### HTML Optimization
- Semantic HTML5 structure  
- Minimal nesting depth  
- ARIA labels and alt attributes  
- Responsive viewport meta tag  

### General Performance Practices
- No external CDN dependencies  
- No build process required  
- Fully static content  
- Works offline after first load  

---

## 4. File Structure

week5_lightweight_demo/
├── index.html
├── styles.css
├── app.js
└── assets/
├── apple.webp
├── ball.webp
├── a-sound.mp3
└── b-sound.mp3

All resources are local to eliminate network overhead.

---

## 5. Functional & Lightweight Test Cases

| No | Test Item | Purpose | Key Checkpoints | Expected Result |
|----|-----------|---------|-----------------|-----------------|
| 1 | Page Load | Verify error-free loading | Open index.html; check console | Page loads without errors |
| 2 | Initial State | Verify first flashcard content | Letter A, apple image, “1 / 2” indicator | Correct initial card displayed |
| 3 | Sound Playback | Verify phonetic audio | Click sound button | Audio plays instantly |
| 4 | Next Navigation | Verify card switching | Click Next button | Displays B card and updates indicator |
| 5 | Circular Navigation | Verify loop behavior | Click Next on last card | Returns to first card |
| 6 | Keyboard Support | Verify accessibility | Use Arrow / Enter keys | Navigation and sound trigger correctly |
| 7 | Image Optimization | Verify optimized format | Inspect image sources | All images use WebP |
| 8 | Audio Optimization | Verify compressed format | Inspect audio sources | All sounds use MP3 |
| 9 | No External Requests | Verify lightweight loading | Check browser Network tab | Only local files loaded |
| 10 | External CSS | Verify separation of style | View source | CSS loaded via `<link>` |
| 11 | Deferred JavaScript | Verify non-blocking load | View script tag | `defer` attribute present |
| 12 | Responsive Layout | Verify mobile friendliness | Resize viewport | Layout adapts correctly |
| 13 | Accessibility | Verify assistive support | Inspect alt / ARIA labels | Present and descriptive |
| 14 | Page Weight | Verify performance target | DevTools → Network | Total load < 150 KB |
| 15 | Lighthouse Score | Verify optimization outcome | Run Lighthouse audit | Performance score ≥ 90 |

---

## 6. Browser Compatibility

Verified on:

- Chrome  
- Firefox  
- Safari  
- Edge  

All tests passed on modern desktop and mobile browsers.

---

## 7. Execution Instructions

1. Open the `week5_lightweight_demo` folder  
2. Double-click `index.html` in a browser  
3. Interact using buttons or keyboard controls  

No server or installation required.

---

## 8. Scope Notes

- Only two flashcards (A and B) implemented to meet assignment scope  
- Backend integration intentionally excluded  
- Database and authentication reserved for later development stages  

---

## 9. Conclusion

This lightweight implementation demonstrates how SoundSteps applies performance-oriented web design principles while preserving usability, responsiveness, and accessibility. The test cases validate both functional correctness and optimization effectiveness, fulfilling Week 5 deliverable requirements.

---

**Week 5 Deliverable – SoundSteps Flashcard Lightweight Web Demo**
