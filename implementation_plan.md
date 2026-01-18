# Font Standardization & Theme Expansion Plan

## Goal
1.  **Global Font Consistency**: Ensure the entire application uses a unified font stack by removing hardcoded font families and enforcing inheritance.
2.  **More Themes**: Add 5+ new premium themes to the settings.

## User Review Required
- None.

## Proposed Changes

### Styles
#### [MODIFY] [index.css](file:///Users/talawork/Documents/Workspace/alpha-monitor/src/index.css)
- Add global reset for `button`, `input`, `select`, `textarea` to use `font-family: inherit`.
- Ensure `--font-main` and `--font-mono` are robust.

#### [MODIFY] [Component CSS Files]
- **TickerStrip.css**: Replace hardcoded mono stack with `var(--font-mono)`.
- **Navbar.css**: Replace hardcoded mono stack with `var(--font-mono)`.
- **AIRacePanel.css**: Replace `'SF Mono', monospace` with `var(--font-mono)`.

### Configuration
#### [MODIFY] [themes.js](file:///Users/talawork/Documents/Workspace/alpha-monitor/src/config/themes.js)
- Add new themes:
  - **Nord** (Arctic Blue/Cold)
  - **Gruvbox** (Retro/Warm)
  - **Tokyo Night** (Vibrant Purple/Blue)
  - **Synthwave** (Neon Pink/Blue)
  - **One Dark** (Atom style)

## Verification Plan
### Manual Verification
- **Font Check**: Inspect elements in DevTools to ensure they are using the variable-defined fonts.
- **Theme Check**: Cycle through all new themes in Settings and verify color palette application.
