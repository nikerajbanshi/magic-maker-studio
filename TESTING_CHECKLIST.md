# SoundSteps - Pre-Deployment Testing Checklist

**Version:** 2.0.0  
**Test Date:** ******\_******  
**Tester:** ******\_******  
**Environment:** [ ] Development [ ] Staging [ ] Production

---

## 🔐 Authentication & User Management

### User Registration

- [ ] Can access registration page
- [ ] Username field accepts 3-20 characters
- [ ] Username validation shows error for < 3 chars
- [ ] Username validation shows error for > 20 chars
- [ ] Email field validates format
- [ ] Invalid email shows error
- [ ] Password field requires min 8 characters
- [ ] Password < 8 chars shows error
- [ ] Confirm password field matches password
- [ ] Mismatched passwords show error
- [ ] Duplicate username shows appropriate error
- [ ] Duplicate email shows appropriate error
- [ ] Successful registration redirects to dashboard
- [ ] JWT token stored in localStorage
- [ ] User data persists in backend/data/users.json

### User Login

- [ ] Can access login page
- [ ] Login with username works
- [ ] Login with email works
- [ ] Incorrect password shows error
- [ ] Non-existent user shows error
- [ ] Successful login redirects to dashboard
- [ ] Welcome message shows user's name
- [ ] JWT token stored in localStorage
- [ ] Token includes correct user data

### Guest Access

- [ ] "Continue as Guest" button visible on login page
- [ ] Click creates guest session
- [ ] Guest ID follows format: guest_00001, guest_00002, etc.
- [ ] Guest counter increments correctly
- [ ] Multiple guests get unique IDs
- [ ] Guest can access all app features
- [ ] Guest badge displayed in UI (if implemented)
- [ ] Guest data persists in users.json

### Session Management

- [ ] Refresh page maintains authentication
- [ ] Token persists across browser restarts
- [ ] Invalid token redirects to login
- [ ] Expired token (7+ days) redirects to login
- [ ] Logout button visible when authenticated
- [ ] Logout clears localStorage
- [ ] Logout redirects to login page
- [ ] Cannot access app features after logout

---

## 📚 Flashcards Module

### Data & Display

- [ ] All 26 letters load correctly (A-Z)
- [ ] First card shows "A" on initial load
- [ ] Letter uppercase displays correctly
- [ ] Letter lowercase displays correctly
- [ ] Word label displays correctly
- [ ] Image loads for current letter
- [ ] Image has proper alt text
- [ ] Progress counter shows "1 / 26" initially
- [ ] Card count updates correctly on navigation

### Audio Functionality

- [ ] Phoneme sound button (top, near letters) visible and clickable
- [ ] Click phoneme button plays letter/phoneme sound
- [ ] Word sound button (bottom, near word) visible and clickable
- [ ] Click word button plays full word pronunciation
- [ ] Both audio buttons styled distinctly (blue for phoneme, purple for word)
- [ ] Audio plays to completion
- [ ] Can replay audio multiple times
- [ ] Audio doesn't overlap (stops previous before new)
- [ ] Audio for all 26 letters works
- [ ] Handles missing audio gracefully (if applicable)

### Navigation

- [ ] "Next" button advances to next card
- [ ] "Previous" button goes to previous card
- [ ] Previous disabled on first card (A)
- [ ] Next disabled on last card (Z)
- [ ] Keyboard arrow right navigates next
- [ ] Keyboard arrow left navigates previous
- [ ] Progress dot moves along bar
- [ ] Progress dot position accurate (percentage)
- [ ] Card transition animation smooth

### Edge Cases

- [ ] Rapid clicking doesn't break navigation
- [ ] Rapidly clicking sound button works correctly
- [ ] Works with images disabled
- [ ] Works with audio disabled
- [ ] No console errors during usage

---

## 🔊 Sound It Out Module

### Word Display

- [ ] Module loads with first word
- [ ] Word displays correctly
- [ ] Word image loads
- [ ] Phoneme breakdown displays (e.g., "c-a-t")
- [ ] All 22 words available
- [ ] Word counter shows current position (e.g., "1 / 22")

### Slider Functionality

- [ ] Slider visible and draggable
- [ ] Slider starts at segmented (left) position
- [ ] Dragging slider smooth
- [ ] Slider reaches both endpoints
- [ ] Visual feedback on slider position

### Audio Playback

- [ ] Segmented audio plays when slider at left
- [ ] Blended audio plays when slider at right
- [ ] Audio transitions match slider position
- [ ] Play button triggers audio
- [ ] Audio for all 22 words works
- [ ] Segmented audio clearly separates phonemes
- [ ] Blended audio pronounces whole word

### Enhanced Slider Features (v2.0)

- [ ] Slider labels ("Segmented" / "Blended") removed for cleaner UI
- [ ] Slider height increased (16px track)
- [ ] Slider thumb is larger and easier to grab (32px)
- [ ] Progressive color fill shows as slider moves
- [ ] Color fills from left to right with gradient
- [ ] Initial prompt "Sound out this word, then say it fast!" appears
- [ ] Prompt shows only on first visit
- [ ] Dismiss button closes prompt
- [ ] Prompt state saved in localStorage

### Navigation

- [ ] Previous button goes to previous word
- [ ] Next button advances to next word
- [ ] Previous disabled on first word
- [ ] Next disabled on last word
- [ ] Progress indicator updates

### Enhanced Features (If Implemented)

- [ ] Individual letters clickable
- [ ] Clicking letter plays phoneme sound
- [ ] Letter hover shows sound button
- [ ] Touch gestures work on mobile
- [ ] Keyboard navigation functional

---

## 👾 Hungry Monster Game

### Game Setup

- [ ] Game loads with first question
- [ ] Monster character displays
- [ ] Question text/visual prompt displays
- [ ] 3-4 option cards display
- [ ] Option images load correctly
- [ ] Score counter visible (starts at 0)
- [ ] Question counter visible (e.g., "1 / 3")

### Gameplay

- [ ] Clicking option selects answer
- [ ] Correct answer shows success feedback
- [ ] Incorrect answer shows try-again feedback
- [ ] Score increments on correct answer
- [ ] Score doesn't increment on wrong answer
- [ ] Auto-advances to next question after correct
- [ ] All 3 questions load

### Visual Feedback (If Implemented)

- [ ] Correct answer triggers celebration (confetti/animation)
- [ ] Incorrect answer shows gentle feedback
- [ ] Monster animation on correct answer
- [ ] Success sound plays
- [ ] Error sound plays (if implemented)

### Completion

- [ ] Game ends after last question
- [ ] Final score displays
- [ ] Return to dashboard button visible
- [ ] Clicking return goes to dashboard

### Visual Prompts (If Redesigned)

- [ ] Visual prompts replace text instructions
- [ ] Shape displays clearly (circle, square, etc.)
- [ ] Color swatch displays correctly
- [ ] Combined prompts (shape + color) clear

---

## 🎯 Minimal Pairs Module

### Setup

- [ ] Module loads with first sound pair
- [ ] Category header displays (e.g., "/p/ vs /b/")
- [ ] Two drop buckets display
- [ ] Bucket labels show correct sounds
- [ ] Word chips display in random order
- [ ] All words visible

### Dynamic Labels (If Implemented)

- [ ] Bucket labels extracted from header dynamically
- [ ] Labels update when switching pairs
- [ ] Click sound label plays phoneme audio
- [ ] Speaker icon visible on labels

### Tutorial Popup

- [ ] Tutorial appears on first visit to Minimal Pairs
- [ ] Tutorial shows 4 steps with clear instructions
- [ ] Step 1 explains clicking sound button
- [ ] Step 2 explains clicking words to hear pronunciation
- [ ] Step 3 explains drag and drop mechanic
- [ ] Step 4 provides encouragement
- [ ] Dot navigation allows jumping between steps
- [ ] Next button advances through steps
- [ ] Skip button closes tutorial
- [ ] "Don't show again" checkbox works
- [ ] Tutorial can be replayed via help button
- [ ] Tutorial is mobile responsive

### Drag & Drop

- [ ] Can drag word chips
- [ ] Drop zones highlight on drag over
- [ ] Dropping word places it in bucket
- [ ] Dragged word removed from source
- [ ] Multiple words can be dropped in same bucket
- [ ] All words must be sorted to check answer

### Answer Validation

- [ ] "Check Answer" button visible
- [ ] Button disabled until all words sorted
- [ ] Clicking check validates answers
- [ ] Correct sorting shows success message
- [ ] Incorrect sorting shows error with hints
- [ ] Can reset and try again

### Word Sound-Out (If Implemented)

- [ ] Hover over word shows speaker icon
- [ ] Clicking speaker plays word audio
- [ ] Sound doesn't interfere with drag

### Navigation

- [ ] Can move to next sound pair
- [ ] Can return to previous pair
- [ ] All pairs accessible

---

## � Mouth Moves Module (NEW v2.0)

### Setup & Display

- [ ] Module loads from dashboard
- [ ] Page title "Mouth Moves" displays
- [ ] Vowel type badge shows (e.g., "Long vs Short /i/")
- [ ] Description text explains the sound difference
- [ ] Two word cards display side by side
- [ ] Progress counter shows (e.g., "1 / 4")

### Word Cards

- [ ] Each card shows mouth emoji (😁 or 😐)
- [ ] Word title displays prominently
- [ ] Phoneme badge shows (e.g., "/iː/" or "/ɪ/")
- [ ] Mouth description explains position
- [ ] Tip provides pronunciation guidance
- [ ] Sound button plays word audio
- [ ] Cards have distinct border colors (blue for long, orange for short)
- [ ] Hover effect on cards works

### Audio Functionality

- [ ] Click sound button plays word pronunciation
- [ ] Falls back to TTS if audio file missing
- [ ] Visual feedback shows when card is active

### Navigation

- [ ] Previous button navigates to prior pair
- [ ] Next button advances to next pair
- [ ] Previous disabled on first pair
- [ ] Module completion shows celebration
- [ ] Returns to dashboard after completion

### Content Accuracy

- [ ] sheep/ship pair displays correctly
- [ ] beat/bit pair displays correctly
- [ ] feet/fit pair displays correctly
- [ ] leave/live pair displays correctly
- [ ] All mouth position descriptions accurate

---

## 🖼️ Homophone Quiz Module (NEW v2.0)

### Setup & Display

- [ ] Module loads from dashboard
- [ ] Page title "Homophone Quiz" displays
- [ ] Question prompt shows "Which word matches this picture?"
- [ ] Image displays clearly
- [ ] Two word option tiles display
- [ ] Progress counter shows (e.g., "Question 1 / 6")
- [ ] Score counter shows (starts at 0)

### Word Tiles

- [ ] Each tile shows word prominently
- [ ] Sound button visible on each tile
- [ ] Hover effect on tiles works
- [ ] Click sound button plays word pronunciation
- [ ] Audio falls back to TTS if needed

### Gameplay

- [ ] Clicking correct tile shows success animation
- [ ] Confetti celebration on correct answer
- [ ] Score increments (+10) on correct answer
- [ ] Success toast message appears
- [ ] Clicking wrong tile shows incorrect animation
- [ ] Wrong answer highlights correct tile in green
- [ ] Info message shows correct answer
- [ ] Auto-advances to next question after 2 seconds

### Completion

- [ ] Quiz ends after all questions
- [ ] Final celebration with confetti
- [ ] Achievement toast shows final score
- [ ] Returns to dashboard after completion

### Content

- [ ] sheep/ship question works
- [ ] feet/fit question works
- [ ] All 6 questions accessible
- [ ] Images match correct answers

---

## 📊 Progress Tracking (If Implemented)

### Data Persistence

- [ ] User progress saved after activity completion
- [ ] Flashcards completion tracked
- [ ] Sound It Out completion tracked
- [ ] Game scores saved
- [ ] Minimal Pairs completion tracked
- [ ] Mouth Moves completion tracked (NEW)
- [ ] Homophone Quiz completion tracked (NEW)
- [ ] Progress persists across sessions

### Progress Display

- [ ] Dashboard shows completion percentages
- [ ] Module cards show progress badges
- [ ] User profile shows total time spent
- [ ] Activity history accessible
- [ ] Current streak displays (if implemented)

---

## 🏠 Dashboard (v2.0 Updated)

### Module Grid Layout

- [ ] Dashboard displays 6 module cards
- [ ] Cards appear in correct order:
  1. Flashcards (pink gradient)
  2. Sound It Out (blue gradient)
  3. Minimal Pairs (purple gradient)
  4. Mouth Moves (orange gradient) - NEW
  5. Homophone Quiz (teal gradient) - NEW
  6. Hungry Monster (green gradient)
- [ ] 2 columns on mobile
- [ ] 3 columns on tablet/desktop (600px+)
- [ ] All cards have consistent styling
- [ ] Hover effects work on all cards

### New Module Cards

- [ ] Mouth Moves card shows 👄 icon
- [ ] Mouth Moves description: "Shape your sounds"
- [ ] Homophone Quiz card shows 🖼️ icon
- [ ] Homophone Quiz description: "Match words to pictures"

### Skill Badges (Updated)

- [ ] 8 skill badges display:
  - ABC Master (flashcards)
  - Sound Pro (soundout)
  - Pair Expert (minimal pairs)
  - Mouth Master (mouth moves) - NEW
  - Quiz Champ (homophone quiz) - NEW
  - Monster Tamer (hungry monster)
  - Streak Star (streak)
  - Points Pro (points)
- [ ] Unlocked badges have gold border
- [ ] Locked badges show progress bar
- [ ] Badge unlock celebration works

---

## 🏆 Leaderboard (If Implemented)

### Display

- [ ] Leaderboard accessible from dashboard
- [ ] Top 10 users displayed
- [ ] Current user highlighted
- [ ] User rank visible
- [ ] Scores formatted correctly

### Sorting

- [ ] Can sort by total score
- [ ] Can sort by mastery level
- [ ] Can sort by activities completed
- [ ] Sort persists selection

### Updates

- [ ] Leaderboard updates after completing activity
- [ ] Real-time or on-refresh updates work
- [ ] User position changes reflected

---

## 🎨 Visual Feedback & Animations (If Implemented)

### Success Animations

- [ ] Confetti displays on correct answers
- [ ] Trophy animation on activity completion
- [ ] Level-up animation triggers
- [ ] Achievement unlock displays

### Toast Notifications

- [ ] Success toasts appear and auto-dismiss
- [ ] Error toasts appear and auto-dismiss
- [ ] Info toasts display correctly
- [ ] Toasts stack properly (multiple at once)

### Sound Effects

- [ ] Success sound plays
- [ ] Error sound plays
- [ ] Achievement sound plays
- [ ] Level-up sound plays
- [ ] Sounds don't overlap awkwardly
- [ ] Volume appropriate (not too loud)

---

## 🖥️ Cross-Browser Testing

### Desktop Browsers

- [ ] Chrome (latest) - All features work
- [ ] Firefox (latest) - All features work
- [ ] Safari (latest) - All features work
- [ ] Edge (latest) - All features work

### Mobile Browsers

- [ ] Chrome Mobile (Android) - All features work
- [ ] Safari Mobile (iOS) - All features work
- [ ] Samsung Internet - All features work

### Browser Compatibility Issues

- [ ] No console errors in any browser
- [ ] CSS renders consistently
- [ ] Audio plays in all browsers
- [ ] localStorage works in all browsers
- [ ] Drag & drop works in all browsers

---

## 📱 Mobile Responsiveness

### Layout (Mobile < 768px)

- [ ] Login/register forms display correctly
- [ ] Navigation accessible
- [ ] Flashcards display full-width
- [ ] Sound It Out slider usable
- [ ] Game options stack vertically
- [ ] Minimal Pairs drag & drop works with touch
- [ ] Dashboard modules stack in grid

### Touch Interactions

- [ ] Buttons have adequate touch targets (44px min)
- [ ] Swipe gestures work (if implemented)
- [ ] Pinch zoom disabled on app (if desired)
- [ ] No accidental taps
- [ ] Hover states have touch alternatives

### Performance

- [ ] Images load quickly on mobile
- [ ] Audio preloads appropriately
- [ ] No lag when navigating
- [ ] Animations smooth (60fps)

---

## ⚡ Performance Testing

### Load Times

- [ ] Initial page load < 3 seconds
- [ ] Time to Interactive < 3 seconds
- [ ] Flashcards load < 1 second
- [ ] Sound It Out load < 1 second
- [ ] Games load < 1 second

### Resource Optimization

- [ ] Images compressed (WebP)
- [ ] Audio files optimized (128kbps MP3)
- [ ] CSS minified (production)
- [ ] JavaScript minified (production)
- [ ] Assets cached appropriately

### Memory Usage

- [ ] No memory leaks during long session
- [ ] Audio memory released after playback
- [ ] Images garbage collected properly
- [ ] localStorage doesn't grow unbounded

---

## ♿ Accessibility Testing

### Keyboard Navigation

- [ ] Tab key navigates through elements
- [ ] Enter key activates buttons
- [ ] Arrow keys work for navigation (where applicable)
- [ ] Escape key closes modals (if applicable)
- [ ] Focus indicators visible

### Screen Reader Support

- [ ] Images have alt text
- [ ] Buttons have aria-labels
- [ ] Form inputs have labels
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Navigation landmarks present

### Visual Accessibility

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Focus states clearly visible
- [ ] No information conveyed by color alone
- [ ] Text resizable to 200% without breaking layout
- [ ] UI elements distinguishable

---

## 🔒 Security Testing

### Authentication

- [ ] Cannot access protected routes without login
- [ ] Invalid tokens rejected
- [ ] Expired tokens rejected
- [ ] Password not visible in network requests
- [ ] JWT token not exposed in console

### Input Validation

- [ ] SQL injection attempts blocked (N/A for JSON)
- [ ] XSS attempts sanitized
- [ ] Long inputs handled gracefully
- [ ] Special characters don't break app

### HTTPS (Production Only)

- [ ] All requests over HTTPS
- [ ] Mixed content warnings absent
- [ ] SSL certificate valid
- [ ] Redirects HTTP to HTTPS

---

## 🐛 Error Handling

### Network Errors

- [ ] Offline mode shows appropriate message
- [ ] Failed API calls show error
- [ ] Retry mechanism works (if implemented)
- [ ] User informed of connection issues

### Missing Assets

- [ ] Missing images show placeholder
- [ ] Missing audio handled gracefully
- [ ] Missing data doesn't crash app
- [ ] User informed of missing content

### Invalid Data

- [ ] Malformed JSON handled
- [ ] Missing fields handled
- [ ] Unexpected data types handled
- [ ] Empty responses handled

---

## 🔄 Integration Testing

### End-to-End Flows

- [ ] New user journey: Register → Dashboard → Flashcards → Complete
- [ ] Returning user: Login → Dashboard → Resume progress
- [ ] Guest user: Guest login → Try features → Dashboard
- [ ] Complete module: Finish all flashcards → Progress saved
- [ ] Multi-module: Complete multiple modules in one session

---

## 🚀 Deployment Verification

### Server Health

- [ ] /health endpoint returns 200
- [ ] /docs endpoint accessible
- [ ] API endpoints respond
- [ ] Static files serve correctly

### Environment Configuration

- [ ] Correct environment loaded (dev/prod)
- [ ] SECRET_KEY different from default
- [ ] CORS origins configured correctly
- [ ] Database connection works (if applicable)

### Monitoring

- [ ] Logs generating correctly
- [ ] Error tracking functional (if implemented)
- [ ] Health checks running
- [ ] Backup scripts running (if configured)

---

## Test Summary

**Total Tests:** **\_** / 350  
**Passed:** **\_**  
**Failed:** **\_**  
**Blocked:** **\_**  
**Not Applicable:** **\_**

**Critical Issues Found:**

1. ***
2. ***
3. ***

**Sign-off:**

- [ ] All critical issues resolved
- [ ] All high-priority issues resolved or documented
- [ ] Performance meets requirements
- [ ] Security requirements met
- [ ] Accessibility standards met

**Approved for Deployment:** [ ] Yes [ ] No

**Tester Signature:** ******\_\_\_\_****** **Date:** **\_\_\_\_**  
**Manager Approval:** ******\_\_\_\_****** **Date:** **\_\_\_\_**

---

**Testing Checklist v1.0**  
**Last Updated:** January 17, 2026
