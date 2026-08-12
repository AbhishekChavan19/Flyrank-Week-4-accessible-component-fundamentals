# Accessibility Component Fundamentals

## Assignment
FE-05 — Accessible Component Fundamentals  
Track: Frontend AI Engineering  

---

## 1. What I Implemented

In `src/playground/components/custom/`, I built three interactive components from scratch in React + TypeScript without component libraries:

1. **Modal Dialog (`Modal.tsx`)**:
   - Rendered at `document.body` level using `ReactDOM.createPortal`.
   - Uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and optional `aria-describedby` with dynamic React IDs generated via `useId()`.
   - Features dynamic focus trapping, body scroll locking, `Escape` key dismiss, and focus restoration to the trigger element on close.

2. **Tabs (`Tabs.tsx`)**:
   - Compound sub-components: `CustomTabs`, `CustomTabList`, `CustomTab`, `CustomTabPanel`.
   - Uses `role="tablist"`, `role="tab"`, and `role="tabpanel"` with roving `tabIndex` (`0` for selected tab, `-1` for inactive/disabled tabs).
   - Supports both `automatic` activation (moving focus activates tab) and `manual` activation (arrow keys move focus; `Enter`/`Space` activates focused tab).
   - Handles horizontal (`ArrowRight`/`ArrowLeft`) and vertical (`ArrowDown`/`ArrowUp`) arrow keys, `Home`/`End`, and automatically skips disabled tabs.

3. **Disclosure & Accordion (`Disclosure.tsx`)**:
   - Built around a native HTML `<button>` trigger element with `aria-expanded` and `aria-controls`.
   - Content panel uses `role="region"` with `aria-labelledby` referencing the trigger ID.
   - Leverages native browser button activation for `Enter` and `Space` keys without artificial key listeners.
   - Includes an optional `CustomAccordion` container supporting single and multiple item expansion with arrow key navigation between enabled triggers.

---

## 2. Accessibility Decisions

### Modal
- **ARIA Labeling**: Connected `aria-labelledby` directly to the `<h2>` title ID (`modal-title-${useId()}`) and conditionally attached `aria-describedby` when a description string/node is provided.
- **Focus Entering**: When opened, the modal captures `previousActiveElement.current = document.activeElement`. Focus is placed on an explicit `initialFocusRef` if supplied, or falls back to the first visible tabbable element inside the modal, or the modal container (`tabIndex={-1}`) if no focusable children exist.
- **Focus Trapping**: Dynamically queries visible, non-disabled focusable DOM elements on every `Tab` / `Shift+Tab` keydown event. If focus is on the last focusable element, `Tab` wraps to the first; if on the first element, `Shift+Tab` wraps to the last.
- **Escape Dismissal**: Intercepts `Escape` key events, preventing default browser behavior and stopping event propagation to avoid accidentally closing parent containers.
- **Focus Restoration**: On unmount/close, restores focus back to `previousActiveElement.current` after safely checking `document.body.contains(el)` to avoid errors if the trigger button was removed from the DOM.

### Tabs
- **Roles & ARIA**: `role="tablist"` on container (`aria-orientation`), `role="tab"` on buttons (`aria-selected="true/false"`, `aria-controls="panel-id"`), and `role="tabpanel"` on content panels (`aria-labelledby="tab-id"`).
- **Roving TabIndex**: Only the currently selected active tab receives `tabIndex={0}`. Inactive and disabled tabs receive `tabIndex={-1}`. When tabbing into the page tablist, focus lands directly on the active tab.
- **Automatic vs. Manual Activation**:
  - In *Automatic* mode: Arrow navigation updates the selected active tab immediately upon focus movement.
  - In *Manual* mode: Arrow keys move the focus ring across tab buttons without selecting them; pressing `Enter` or `Space` on a focused tab triggers `setActiveTab`.
- **Arrow Navigation & Orientation**: Horizontal tabs use `ArrowRight` (next) and `ArrowLeft` (previous); vertical tabs use `ArrowDown` (next) and `ArrowUp` (previous).
- **Home / End Keys**: `Home` moves focus to the first enabled tab; `End` moves focus to the last enabled tab. Disabled tabs (`disabled={true}`) are filtered out of the query selector list during keyboard traversal.

### Disclosure
- **Native Button**: Uses native HTML `<button type="button">`. Native buttons automatically respond to mouse clicks, `Enter` key presses, and `Space` key presses natively.
- **ARIA Attributes**: `aria-expanded="true"` when panel is visible and `aria-expanded="false"` when collapsed; `aria-controls` points directly to the panel DOM ID.
- **Content Visibility**: Panel content is only mounted/visible when expanded, preventing hidden panel inputs from receiving tab focus unexpectedly.

---

## 3. Handmade Implementation vs. shadcn/ui

Inspecting the generated source code in `src/components/ui/dialog.tsx` and `src/components/ui/tabs.tsx` reveals two concrete differences:

### Difference 1: Data-State Attribute Styling vs. React State Props
1. **My Handmade Implementation (`Modal.tsx` & `Tabs.tsx`)**:
   Passes boolean props (`isOpen`, `isSelected`) and computes conditional Tailwind CSS strings in JSX (e.g. `isSelected ? "bg-blue-600/20 text-blue-400" : "text-slate-400"`).
2. **Generated shadcn/ui Source (`dialog.tsx` & `tabs.tsx`)**:
   Delegates state to HTML `data-*` attributes managed by Radix primitives (`data-[state=open]`, `data-[state=closed]`, `data-[state=active]`). For example, `TabsTrigger` uses `data-[state=active]:bg-blue-600` and `DialogOverlay` uses `data-[state=open]:animate-in data-[state=closed]:fade-out-0`.
3. **Why it matters**:
   Targeting `data-state` attributes allows pure CSS transitions and keyframes to handle entry and exit animations (such as fade-out on close) cleanly without needing complex React presence state wrappers or conditional unmounting delays.

### Difference 2: Sub-Component Composition Architecture vs. Single-Wrapper Component
1. **My Handmade Implementation (`Modal.tsx`)**:
   Uses a top-level wrapper component receiving `title`, `description`, and `children` props (`React.FC<ModalProps>`), rendering fixed internal `<h2>` and `<p>` nodes.
2. **Generated shadcn/ui Source (`dialog.tsx`)**:
   Decomposes the dialog into composable sub-components (`Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogClose`).
3. **Why it matters**:
   Radix uses Context under the hood to automatically link `DialogTitle` and `DialogDescription` IDs to `DialogContent`'s `aria-labelledby` and `aria-describedby` attributes regardless of how deeply nested they are in the JSX tree, allowing developers full layout freedom.

---

## 4. What I Learned

1. **AI Assistants Often Omit Edge Cases**:  
   AI models generate visual layouts quickly, but frequently miss accessibility details like returning focus safely on close, skipping disabled tabs during keyboard navigation, or separating focused tab state from selected tab state in manual mode.
2. **Accessibility Is About Keyboard & Screen Reader Predictability**:  
   Keyboard users rely on consistent patterns (Roving `tabIndex`, `Tab` focus trapping in modals, `Escape` key dismiss, and `Enter`/`Space` activation). Hand-crafting these components builds an understanding of why ARIA specifications exist.
3. **Component Libraries Provide Hardened Primitives**:  
   Examining `shadcn/ui` and Radix UI source code shows how production component libraries handle screen reader fallbacks, presence animations, and compositional context cleanly.

---

## 5. Keyboard Testing Checklist

The following test matrix was manually verified in Google Chrome:

### Modal Dialog
- [x] **Tab**: Navigates forward between focusable controls inside the open modal.
- [x] **Shift + Tab**: Navigates backward, wrapping from the first focusable element to the Close button.
- [x] **Escape**: Dismisses the modal dialog.
- [x] **Focus Entering**: Focus automatically shifts inside the modal (or onto `initialFocusRef`) when opened.
- [x] **Focus Returning**: Focus returns directly to the button that opened the modal upon close.

### Tabs
- [x] **Tab**: Moves focus directly onto the active tab (`tabIndex={0}`).
- [x] **ArrowRight**: Moves focus to the next enabled tab in horizontal orientation.
- [x] **ArrowLeft**: Moves focus to the previous enabled tab in horizontal orientation.
- [x] **Home**: Jumps focus directly to the first enabled tab.
- [x] **End**: Jumps focus directly to the last enabled tab.
- [x] **Manual Activation (`Enter` / `Space`)**: Arrow keys move the focus ring without selecting tabs; pressing `Enter` or `Space` activates the focused tab.
- [x] **Automatic Activation**: Moving focus with arrow keys immediately selects and displays the tabpanel.
- [x] **Disabled Tabs**: Disabled tab ("Disabled Tab") is skipped during arrow key navigation and cannot be focused or clicked.
- [x] **Vertical Orientation**: `ArrowDown` and `ArrowUp` navigate tabs when vertical orientation is toggled.

### Disclosure & Accordion
- [x] **Tab**: Moves focus onto disclosure trigger button.
- [x] **Enter**: Toggles disclosure panel expand/collapse.
- [x] **Space**: Toggles disclosure panel expand/collapse.
- [x] **aria-expanded**: Updates dynamically between `"true"` and `"false"`.
