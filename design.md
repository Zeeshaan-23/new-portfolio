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

## 7. Stacked Full-Screen Page Transition Architecture

The portfolio implements a **stacked full-screen page model** where pages exist as cinematic spatial planes rather than standard continuous vertical web documents:

- **Page 1 (Base / Terminal Landing)**:
  - Hosts the `FaultyTerminal` WebGL canvas and initial interactive exploration prompts.
  - When active: `transform: scale(1) translateY(0); filter: blur(0px) brightness(1); opacity: 1;`.
  - When Page 2 enters: smoothly scales slightly backward (`scale(0.92)`), shifts slightly upward (`translateY(-20px)`), blurs (`blur(8px)`), and dims (`brightness(0.65)` with `opacity: 0.75`).
  - **Critical Rule**: Page 1 **never disappears** or unmounts; it remains visually active behind Page 2, subtly glowing through Page 2's frosted glass backdrop.
- **Page 2 (Stacked Foreground Surface)**:
  - Enters vertically from the bottom of the viewport (`transform: translateY(100%) -> translateY(0)`).
  - Background surface: Translucent deep void (`rgba(4, 5, 8, 0.88)`) with frosted backdrop blur (`backdrop-filter: blur(22px)`), illuminated by a top phosphor border (`border-top: 1px solid rgba(69, 240, 49, 0.35)`) and glow shadows (`box-shadow: 0 -15px 50px rgba(0, 0, 0, 0.95), 0 -2px 20px rgba(69, 240, 49, 0.2)`).
  - Becomes the active foreground page with independent inner scrolling when settled.
- **Transition Dynamics & Gesture Navigation**:
  - Easing: `cubic-bezier(0.76, 0, 0.24, 1)` with `900ms` duration for ultra-smooth mechanical luxury movement.
  - Navigation methods:
    1. Wheel/trackpad scroll (down on Page 1 to enter Page 2; up at top of Page 2 to return).
    2. Keyboard arrows (`ArrowDown`/`PageDown` to enter, `ArrowUp`/`PageUp` to return).
    3. Keyboard `Enter` key: Scrolls/cycles through each page (Page 1 -> Page 2 -> Page 1).
    4. Interactive triggers (Page 1 explore pill button and Page 2 return button).
    5. Touch swipes.
  - A transition lock (`~920ms`) prevents wheel stutter or jitter during animation.

### 7.1 Page 2 FlowingMenu Component
Page 2 hosts the interactive `FlowingMenu` (React Bits component driven by GSAP):
- **Categories (5 items in strict sequence)**:
  1. `Languages and Skills`
  2. `Projects`
  3. `Certifications`
  4. `Timeline`
  5. `Fields of Study`
- **Color Configuration**:
  - Item Text Color: `#72e13e`
  - Base Background: `#120F17`
  - Marquee Background (hover): `#72e13e`
  - Marquee Text Color: `#120F17`
  - Divider Borders: `#72e13e`
- **Behavior**:
  - Speed: `15`
  - Direction-aware hover: marquee rolls in from the closest edge (top or bottom) and loops seamlessly with associated imagery.
  - Responsive full-screen height distribution: each category occupies an equal flex fraction of the container.

---

## 8. Layering & Z-Index Hierarchy

| Layer Level | Z-Index | Purpose |
| :--- | :--- | :--- |
| **Layer 0** (Base) | Default / `1` | Page 1 base wrapper (`FaultyTerminal` canvas + interactive cues). |
| **Layer 1** (Foreground Stack) | `50` | Page 2 stacked full-screen surface (`PageTwo` modular container). |
| **Layer 2** (Curtain Ceremony) | `9999` | Initial `CurtainLoader` overlay (unmounts completely upon user opening). |

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
