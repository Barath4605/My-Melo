---
##  Refactoring Plan: AtMyMelo Frontend JavaScript

## Author: Barath4605

## Last Updated: 30 June 2025
---

### Objective

The current frontend logic is functional but **MONOLITHIC**, **REDUNDANT**, and hard to scale. This refactor aims to:

- Modularize feature logic (rating, favorite, queue, review)
- Centralize album state and localStorage interaction
- Improve code readability and maintainability
- Follow GHOC (Good Habit of Coding) standards

---

## Current Pain Points

- Logic for state update, DOM manipulation, and UI changes are scattered
- Too many global variables; coupling between unrelated features
- Repetitive class toggling and hardcoded DOM access
- Difficult to debug or expand feature logic (e.g. when adding playlists or multi-review support)

---

## Refactor Goals

| Aspect          | Goal Description                                             |
| --------------- | ------------------------------------------------------------ |
| State Mgmt      | One single source of truth using a `state.js` module         |
| Feature Logic   | Each feature (Rating, Fav, Queue, Review) in its own JS file |
| UI Handling     | Separate UI updates from state updates                       |
| Code Structure  | Follow modular design with reusability                       |
| Maintainability | Clear, readable, and documented                              |

---

## New File Structure (Proposed)

```
📂 js/
│
├── main.js              # Entry point; initializes modules
├── state.js             # Album state + localStorage handling
├── rating.js            # Star rating logic + UI
├── favorite.js          # Favorite album logic + UI
├── queue.js             # Queue toggle logic + UI
├── review.js            # Review submission + UI toggle
├── albumModal.js        # Album cover fullview popup
└── utils.js             # Helper utilities (class toggler, etc)
```

---

                    ##  Module Breakdown

### 1. `state.js`

**Purpose**: Handle loading and saving album data from localStorage.

```js
export const AlbumState = {
  id: null,
  cover: null,
  rating: 0,
  isFav: false,
  inQueue: false,
  review: null,

  load(id) { ... },
  save() { ... }
};
```

> Used by every feature module to sync and persist data.

---

### 2. `rating.js`

**Purpose**: Manage rating interaction + display.

- Initializes star listeners
- Updates UI on hover/click
- Saves rating to state

```js
export function initRating() {
  // setup event listeners
}
```

---

### 3. `favorite.js`

**Purpose**: Toggle favorite status and update UI.

- Handles toggle on click
- Updates state and persists
- Handles UI class toggles

---

### 4. `queue.js`

**Purpose**: Add/remove album from queue.

- Toggle state
- Update UI classes (green highlight, icons)
- Sync with localStorage

---

### 5. `review.js`

**Purpose**: Handle review section UI and submission.

- Toggle form open/close
- Validate input
- Save review data to `AlbumState`

---

### 6. `albumModal.js`

**Purpose**: Show full album image with dynamic shadow

- Attach listener to album cover
- Use `ColorThief` to extract color
- Apply drop-shadow
- Hide on background click

---

### 7. `main.js`

**Purpose**: Glue all the modules together.

```js
import { AlbumState } from "./state.js";
import { initRating } from "./rating.js";
import { initFavorite } from "./favorite.js";
import { initQueue } from "./queue.js";
import { initReview } from "./review.js";
import { initAlbumModal } from "./albumModal.js";

document.addEventListener("DOMContentLoaded", () => {
  // assume album is loaded from backend
  AlbumState.load(albumId);
  initRating();
  initFavorite();
  initQueue();
  initReview();
  initAlbumModal();
});
```

---

## Utility Helpers (`utils.js`)

Create reusable helpers for toggling visibility or classes.

```js
export function toggle(el, show, className) {
  el.classList.toggle(className, show);
}
```

---

## Migration Plan

| Step | Task                                                    |
| ---- | ------------------------------------------------------- |
| 1    | Create `state.js` and move all localStorage logic there |
| 2    | Break rating logic into `rating.js`                     |
| 3    | Split favorite & queue logic                            |
| 4    | Review + Modal into own modules                         |
| 5    | Rewrite `main.js` as orchestrator                       |
| 6    | Clean up HTML file script tags (load modularly)         |

---

## Testing Checklist

- [ ] Ratings are saved and restored properly
- [ ] Favorite toggling works and persists
- [ ] Queue UI updates reflect state correctly
- [ ] Review logging clears form + shows feedback
- [ ] Album modal displays with correct shadow color

---

## Outcome Expected

By the end of this refactor, the project will:

- Be cleanly split by concerns
- Follow single-responsibility principle
- Be ready for multi-album views, filters, and list pages
- Be easier to debug and maintain going forward

---
