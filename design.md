# Design System & Visual Guidelines: Zeeshaan's Portfolio

This document serves as the **single source of truth** for the visual design system, aesthetic standards, component conventions, and interaction principles of this portfolio.

---

## 1. Overall Design Direction & Aesthetic

The portfolio embodies a **high-end, retro-futuristic Cyber-Terminal / CRT aesthetic** paired with **sleek, cinematic modern motion design**.

- **Atmosphere**: Deep, pitch-black void punctuated by vibrant terminal phosphor green (`#45f031`), subtle CRT curvature, scanline textures, and digital glitches.
- **Physicality & Tactility**: Elements do not just fade in; they feel physical (e.g., segmented vertical curtain panels lifting like a heavy mechanical shutter, carrying their painted typography with them).
- **Restraint & Precision**: Avoid clutter. Every element has purpose, high contrast, and pixel-perfect alignment.
- **Immersion**: Dynamic WebGL background reacts organically to cursor movement with fluid damping.

---

## 2. Color Palette

The color system is strictly curated around the retro-terminal CRT theme.

| Role | Color Value | Description & Usage |
| :--- | :--- | :--- |
| **Terminal Phosphor Green** (Primary) | `#45f031` | Primary brand accent, glowing typography, terminal CRT digits, interactive states. |
| **Void Black** (Background) | `#000000` | Pure solid black used for curtain panels, background canvases, and base layers. |
| **Phosphor Glow (Heavy)** | `rgba(69, 240, 49, 0.45)` | Heavy text shadow / bloom for primary headings. |
| **Phosphor Glow (Medium)** | `rgba(69, 240, 49, 0.35)` | Secondary glow for subheadings and borders. |
| **Phosphor Glow (Subtle)** | `rgba(69, 240, 49, 0.15)` | Ambient lighting, subtle highlights, active focus states. |
| **Muted Overlay / Glass** | `rgba(0, 0, 0, 0.3)` – `rgba(0, 0, 0, 0.7)` | Backdrop overlays to ensure readability over canvas elements. |
| **Subtle Border** | `rgba(255, 255, 255, 0.15)` – `rgba(255, 255, 255, 0.25)` | Clean, neutral boundary lines when needed. |

---

## 3. Typography & Fonts

### 3.1 Font Families

1. **Brand / Display Font**: `Cefagu` (`Cefagu.ttf`)
   - **Path**: `src/assets/fonts/Cefagu.ttf` and `public/fonts/Cefagu.ttf`
   - **Declaration**: Declared via `@font-face` with `font-display: swap`.
   - **Role**: Primary display typeface for brand marks, opening titles, section headlines, and prominent statements.
   - **Character**: Retro, tech-informed serif/display typeface that complements the CRT terminal ambiance.
2. **Fallback / Body System**: `system-ui, 'Segoe UI', Roboto, sans-serif`
3. **Monospace / Code**: `ui-monospace, Consolas, monospace`

### 3.2 Typography Hierarchy & Sizing Rules

- **Hero / Curtain Main Title**:
  - `font-family: 'Cefagu', sans-serif;`
  - `font-size: clamp(2rem, 5vw, 4.2rem);`
  - `line-height: 1.1;`
  - `letter-spacing: 0.03em;`
  - `color: #45f031;`
  - `text-shadow: 0 0 16px rgba(69, 240, 49, 0.45);`
  - `white-space: nowrap;`
- **Curtain Sub-Title / Category Label**:
  - `font-family: 'Cefagu', sans-serif;`
  - `font-size: clamp(1.1rem, 2.3vw, 1.9rem);`
  - `line-height: 1.1;`
  - `letter-spacing: 0.08em;`
  - `color: #45f031;`
  - `opacity: 0.9;`
  - `text-shadow: 0 0 10px rgba(69, 240, 49, 0.35);`
  - `white-space: nowrap;`

---

## 4. Spacing & Layout Conventions

- **Full-Screen Canvas**: The application shell fills `100vw` and `100vh` without default template constraints (`#root` has `width: 100%; min-height: 100vh; margin: 0;`).
- **5-Column Segmentation**: Opening curtain architecture uses 5 equal vertical panels (`flex: 0 0 20vw; width: 20vw; height: 100vh;`).
- **Tight Line Spacing**: Typography blocks use compact line-heights (`1.1`) and tight vertical gaps (`0.35rem`) to maintain dense, intentional visual weight.
- **Fluid Sizing**: Use `clamp()` for font sizes, padding, and spacing to guarantee seamless visual harmony from mobile screens up to 4K displays.

---

## 5. Animation & Interaction Principles

### 5.1 Opening Curtain Ceremony
- **User-Initiated**: Curtains remain fully closed on initial page load (`transform: translateY(0)`), concealing the terminal until the user triggers opening via **mouse click anywhere** or pressing the **`Enter` key**.
- **Single Trigger**: Only the first user interaction (click or `Enter` key) triggers opening; subsequent interactions are blocked.
- **Center $\rightarrow$ Outward Staggered Sequence**:
  - **Group 1** (`BAR 3` / Center): Starts at `0ms`.
  - **Group 2** (`BAR 2` + `BAR 4` / Inner): Starts at `150ms`.
  - **Group 3** (`BAR 1` + `BAR 5` / Outer): Starts at `300ms`.
- **Pure Vertical Motion**: Every bar moves strictly `translateY(0) -> translateY(-100%)`.
  - **No horizontal translation**
  - **No rotation**
  - **No scaling**
  - **No opacity fading**
- **Easing & Timing**: `cubic-bezier(0.76, 0, 0.24, 1)` with `700ms` duration per bar group.
- **Panel-Clipped Painted Typography**:
  - Text is physically segmented across the 5 panels via negative viewport offsets (`left: -20vw * index`).
  - When a panel lifts upward, its corresponding slice of the text travels upward directly with it.
  - While closed, all 5 slices align seamlessly into one continuous composition without visible seams.
- **Clean Completion**:
  - Once Group 3 finishes, `onComplete()` is called **exactly once**.
  - The entire `CurtainLoader` component unmounts from the DOM (`return null`), preventing any invisible overlay from blocking pointer events.

### 5.2 Accessibility (`prefers-reduced-motion`)
- When reduced motion is requested by the user:
  - Skip or drastically compress the curtain animation (`1ms`).
  - Complete immediately and reveal the underlying interface.
  - Still call `onComplete()` exactly once.

---

## 6. Background & Effect Guidelines (`FaultyTerminal`)

The interactive background uses a high-performance WebGL / OGL shader pipeline with standard locked parameters:

```jsx
<FaultyTerminal
  scale={1.7}
  gridMul={[2, 1]}
  digitSize={1.3}
  timeScale={1.1}
  pause={false}
  scanlineIntensity={0.9}
  glitchAmount={1}
  flickerAmount={1}
  noiseAmp={1}
  chromaticAberration={0}
  dither={0}
  curvature={0.11}
  tint="#45f031"
  mouseReact={true}
  mouseStrength={0.2}
  pageLoadAnimation={false}
  brightness={0.5}
/>
```

- **CRT Display Emulation**: Curvature set to `0.11`, scanline intensity `0.9`, providing retro television/monitor barrel distortion.
- **Mouse Reactivity**: Smooth damping factor `0.08` with `mouseStrength={0.2}` creating subtle ripple distortions around cursor coordinates.
- **Persistence**: The canvas remains mounted underneath the curtain from the start; it is never re-mounted or destroyed during curtain transitions.
- **Responsiveness**: Automatic resize handling via `ResizeObserver` recalculates `iResolution` without context loss.

---

---

## 7. Stacked Full-Screen 3-Page Architecture

The portfolio implements a **3-tier stacked full-screen page model** where pages exist as cinematic spatial planes layered in 3D depth rather than standard vertical web documents:

- **Page 1 (Base Layer: Terminal Landing)**:
  - Hosts the `FaultyTerminal` WebGL canvas and initial exploration cues.
  - When active: `transform: scale(1) translateY(0); filter: blur(0px) brightness(1); opacity: 1;`.
  - When Page 2 enters: smoothly scales slightly backward (`scale(0.92)`), shifts slightly upward (`translateY(-20px)`), blurs (`blur(8px)`), and dims (`brightness(0.65)` with `opacity: 0.75`).
  - When Page 3 enters: moves deeper into background (`scale(0.85)` `translateY(-35px)` with `blur(14px)` and `opacity: 0.5`).
  - **Critical Rule**: Page 1 **never unmounts**; it remains persistent and physically behind subsequent layers.

- **Page 2 (Middle Layer: About Me with LightTunnel & ProfileCard)**:
  - Enters vertically from the bottom of the viewport (`transform: translateY(100%) -> translateY(0)`).
  - Background surface: Full-viewport WebGL `LightTunnel` shader with 25 outward pulsing fiber cables in terminal green (`#72e13e`).
  - Layout:
    - **Header**: Brand mark (`Zeeshaan` `ABOUT // V1.0`) and dual navigation buttons (`▲ RETURN TO TERMINAL`, `WORKS [ENTER] ▼`).
    - **Left Column**: Prominent `"About Me"` heading in `Cefagu` display font (`#45f031`) with a clean container reserved for future biography/background text.
    - **Right Column**: React Bits `ProfileCard` component featuring:
      - Clean 3D mouse tilt and glare physics.
      - Original gradient styling (`linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)`) and behind glow.
      - **Untouched User Photo**: The photo is preserved in natural, original full color without shading, tinting, color grading, or overlays (`mix-blend-mode: normal`, `filter: none`). Strictly no radial vignette treatments.
      - **Phosphor Green `</>` Icon Pattern**: The repeating code tag pattern reflects the portfolio's retro terminal aesthetic using `#45f031` / `#72e13e` with subtle phosphor bloom.
    - **Bottom Cue**: Floating explore button (`CONTINUE TO WORKS [ENTER] ▼`).
  - When Page 3 enters: smoothly scales backward (`scale(0.92)` `translateY(-20px)`), blurs (`blur(8px)`), and dims (`opacity: 0.75`).

- **Page 3 (Top Foreground Layer: FlowingMenu Works)**:
  - Enters vertically from the bottom of the viewport over Page 2 (`transform: translateY(100%) -> translateY(0)`).
  - Hosts the full-screen interactive `FlowingMenu` (GSAP marquee) with 5 categories:
    1. `Languages and Skills`
    2. `Projects`
    3. `Certifications`
    4. `Timeline`
    5. `Fields of Study`
  - Header: `Zeeshaan` `WORKS // V1.0` with return button `▲ RETURN TO ABOUT [ENTER]`.

### 7.1 LightTunnel WebGL Specification
The About page background utilizes the React Bits `LightTunnel` WebGL shader running via `ogl`:
- **Core Palette**: `cableColor="#72e13e"`, `pulseColor="#72e13e"`, `tunnelColor="#72e13e"`.
- **Cable Dynamics**: 25 cables (`cableCount={25}`), thickness `0.44`, rim width `0.44`, speed `0.1` outward flow, pulse speed `1`.
- **Atmospheric Texture**: Subtle noise grain (`grain={true}`, `grainIntensity={0.17}`), glow `0.65`, opacity `0.41`.
- **Responsiveness**: Self-resizing via `ResizeObserver`, always filling 100% of the Page 2 viewport behind the content layer.

### 7.2 Transition Dynamics & Gesture Navigation
- Easing: `cubic-bezier(0.76, 0, 0.24, 1)` with `900ms` duration across all layers.
- **Forward Cycle (Page 1 → Page 2 → Page 3)**:
  1. Scroll down on trackpad/mouse wheel.
  2. Keyboard `ArrowDown` or `PageDown`.
  3. Mobile touch swipe up (deltaY > 50).
  4. Keyboard `Enter` key (cycles 1 → 2 → 3 → 1).
  5. Interactive explore buttons on Page 1 and Page 2.
- **Backward Cycle (Page 3 → Page 2 → Page 1)**:
  1. Scroll up on trackpad/mouse wheel.
  2. Keyboard `ArrowUp` or `PageUp`.
  3. Mobile touch swipe down (deltaY < -50).
  4. Keyboard `Shift+Enter`.
  5. Interactive return buttons on Page 3 and Page 2.
- A **920ms transition lock** prevents wheel stutter or jitter during animations.

### 7.3 ProfileCard Specifications (Page 2 About Me)
The React Bits `ProfileCard` component is hosted on the right column of Page 2:
- **Card Framing & Photo Fit**:
  - The photo occupies 100% of the card height and width (`object-fit: cover`, `object-position: center 10%`), completely eliminating empty voids.
  - The photo remains in its natural color without tinting, shading, color-grading, or gradient overlays (`mix-blend-mode: normal !important; filter: none !important;`).
- **Brightness & Visual Harmonization**:
  - The card brightness is slightly subdued (`filter: brightness(0.85);`, hover `brightness(0.92);`) to blend naturally with the moody dark-green LightTunnel environment rather than standing out harshly.
- **Pure Minimalist Portrait Card**:
  - The `</>` symbol overlay is completely removed.
  - The top name and tagline text are completely removed.
  - The bottom glass user info pill (`@zeeshaan`, `Online`, `Contact Me`) is completely removed.
  - The card presents a clean, full-bleed 3D photo portrait with subtle glare reflection and smooth tilt responsiveness.
- **Lighting & Sheen**:
  - Subtle holographic shine (`opacity: 0.08`, hover `0.14`) and glare reflection (`opacity: 0.35`) provide 3D tilt responsiveness without obstructing the portrait.

### 7.4 FlowingMenu Subpage Expansion System (Page 3 Works)
The 5 rows of `FlowingMenu` act as gateways to 5 dedicated full-screen subpages:
1. `Languages and Skills` → `LanguagesAndSkills.jsx`
2. `Projects` → `Projects.jsx`
3. `Certifications` → `Certifications.jsx`
4. `Timeline` → `Timeline.jsx`
5. `Fields of Study` → `FieldsOfStudy.jsx`

- **Physical Row Expansion Dynamics**:
  - Clicking any menu item freezes the menu interactions (`disabled={true}`).
  - Captures the exact `getBoundingClientRect()` of the selected row.
  - A fixed `#72e13e` green transition block is placed at the exact `top` and `height` of the clicked row across `100vw`.
  - Animates outward with GSAP (`top: 0`, `height: 100vh`, duration: `0.65s`, ease: `'power3.inOut'`).
  - Visually grows outward from the selected row, naturally occluding rows above and below.
  - Upon completely filling the viewport, mounts and reveals the destination subpage.
- **Physical Row Contraction (Return)**:
  - Triggered via the subpage header button (`▲ RETURN TO WORKS`), `Escape`, or `Enter` key.
  - Subpage unmounts, revealing the full-screen green envelope.
  - Green block contracts with GSAP from `top: 0, height: 100vh` back into the exact original `top` and `height` of the clicked row slot (`duration: 0.65s`, ease: `'power3.inOut'`).
  - Upon reaching the row bounds, the block is removed and FlowingMenu interaction is fully restored.
- **Subpage Shell Typography & Layout**:
  - Dark background `#120F17` with subtle retro scanline texture.
  - Centered hero title rendered in `Cefagu` font with glowing `#72e13e` / `#ffffff` ambient glow.
  - Category status tag (e.g. `WORKS // 01`) and return button with `[ESC]` badge.
- **Stacked Navigation Lock**:
  - While a subpage is open or transitioning, global wheel, touch, and page-stacking keys (Enter, Arrows, PageUp/Down) are locked so subpage interaction does not cycle main pages.
  - Returning to Page 3 restores all 3-page stacked navigation behaviors seamlessly.

---

## 8. Layering & Z-Index Hierarchy

| Layer Level | Z-Index | Component / Purpose |
| :--- | :--- | :--- |
| **Layer 0 (Base)** | `1` | Page 1 base wrapper (`FaultyTerminal` canvas + explore button). |
| **Layer 1 (Middle Stack)** | `20` | Page 2 stacked About Me layer (`LightTunnel` WebGL canvas + layout). |
| **Layer 2 (Top Stack)** | `40` | Page 3 stacked Works layer (`FlowingMenu` GSAP marquee). |
| **Layer 2.1 (Row Expansion)** | `55` | Fixed physical row expansion/contraction transition block (`#72e13e`). |
| **Layer 2.2 (Subpage Shell)** | `60` | Full-screen destination subpage shell (`Languages`, `Projects`, etc.). |
| **Layer 3 (Curtain Ceremony)**| `9999` | Initial `CurtainLoader` overlay (unmounts completely upon user opening). |

---

## 9. Anti-Patterns (Things to Avoid)

1. **DO NOT mix random color palettes**: Avoid standard browser primary colors (plain blue, saturated yellow, generic red). All highlights, accents, and glows must stem from `#45f031`.
2. **DO NOT use mismatched fonts**: All brand and display typography must use `Cefagu`. Avoid substituting browser default serifs or random sans-serifs for headings.
3. **DO NOT hide Page 1 completely**: Page 1 must stay mounted and visually present behind Page 2 with blur/scale depth.
4. **DO NOT snap or use abrupt transition curves**: Page transitions must strictly use `cubic-bezier(0.76, 0, 0.24, 1)` with ~`900ms` duration.
5. **DO NOT leave ghost/invisible overlay elements**: After animations complete, overlays must be removed from the DOM (`return null`) or explicitly set `pointer-events: none; display: none;`.
6. **DO NOT animate the curtain horizontally or add fades**: The opening curtain is strictly vertical `translateY(-100%)` with sliced text.
7. **DO NOT modify the FaultyTerminal WebGL implementation carelessly**: Its shaders and parameters are precisely tuned; keep it stable as the foundational canvas.
8. **DO NOT install redundant animation packages**: Vanilla CSS transitions/keyframes and React state suffice for performance and purity.

---

*This document is the source of truth for all future UI development on this project. Any updates to color, typography, animation curves, or component architectures must be reflected here first.*
