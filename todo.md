# UX/UI Audit: Alpha Monitor

## Critical UX Gaps
- [ ] **Monitor Form**: The "Add Monitor" form is currently non-functional ("coming soon"). This prevents users from adding custom monitors.
- [ ] **Empty States**: "Coming soon" placeholders for several panels (War Watch, Good News, etc.) provide no value.
- [ ] **Loading States**: `NewsPanel` currently uses plain text "Loading news...". Implement skeleton loaders or a proper spinner for a premium feel.
- [ ] **Error Handling**: Error messages are unstyled text. They should be integrated component alerts with retry options.

## UI Polish & Aesthetics
- [ ] **Icons**: Replace text-based icons (▶, ▼, ✕, ⠿) with professional SVG icons (e.g., Lucide React, Heroicons) for the panel headers, drag handles, and modals.
- [ ] **Drag & Drop**: Improve visual feedback during dragging. Current implementation relies on basic HTML5 drag events which can be clunky. Consider adding a "ghost" effect or drop indicators.
- [ ] **Themes**: `NewsPanel` determines coloring based on string matching (`title.includes('politics')`). Refactor to pass explicit `theme` or `category` props to ensure consistent styling regardless of title changes.
- [ ] **Typography**: Ensure font consistency. `Inter` and `SF Mono` are defined but ensure fallback fonts match the OS properly.

## Accessibility (a11y)
- [ ] **Interactive Elements**: Panel headers and toggle buttons lack `role="button"` and `tabIndex`, making them inaccessible to keyboard users.
- [ ] **ARIA Labels**: Close buttons and icon-only buttons (like drag handles) need `aria-label` descriptions.
- [ ] **Color Contrast**: Verify that the text colors (especially `text-secondary` and dimmed colors) meet WCAG contrast ratios against the dark background.

## Code Quality & Maintainability
- [ ] **Local Storage**: `localStorage` reading logic lacks schema validation. If the saved structure changes, the app might crash (though there is a try-catch, it resets everything). Implement versioning or Zod schema validation.
- [ ] **Hardcoded Values**: `maxItems: 50` and refresh intervals are hardcoded in components. Move these to a config file.
