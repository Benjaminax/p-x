# Project X - UI & Motion Prototype Spec

This document outlines the visual and motion prototype for the white-with-black-accent hospital UI, glassmorphism, GSAP-driven motion, and accessibility considerations.

## Color & Tokens
- Background: #FFFFFF
- Accent: #000000
- Surface: #FAFAFA
- Glass bg: rgba(255,255,255,0.65)
- Border: 1px solid rgba(255,255,255,0.8)

## Typography
- Inter for body, Outfit for headings
- Base: 16px; headings 20-24px for clinical headings

## Components to prototype
- GlassCard (patient snapshot)
- AnimatedButton (primary actions with micro-interaction)
- AI Assistant Panel (right-side glass overlay)
- PatientRow (dense list with keyboard focus)

## Motion Guidelines
- Library: GSAP for micro-interactions and timeline sequences
- Entrance animation: y: 8 → 0, opacity 0 → 1 (0.35 - 0.5s)
- Button hover: scale to 1.03 (0.12 - 0.18s)
- Respect `prefers-reduced-motion` and provide non-animated fallbacks

## Flow Storyboards (high-level)
1. Doctor dashboard opens → patient queue populates (staggered entrances)
2. Selecting a patient opens a right-side AI panel with entrance timeline
3. Running an analysis shows progress micro-animations and final actionable cards

## Assets & Figma Instructions
- Create a Figma file named `Project X - UI Motion` with pages:
  - Token System
  - Components
  - Motion Sequences (use Smart Animate or figma-to-ga plugin for prototyping)
- Provide Lottie animations for onboarding and subtle status illustrations for analysis states

## Accessibility Checklist
- Keyboard accessible components
- ARIA attributes for live regions (AI updates)
- Contrast >= WCAG AA for text & important UI elements
- Motion reduction available via OS preference detection

---

Next steps:
- Export component screens from Figma, then link or include in `/DESIGN/assets` folder.
- If you'd like, I can generate a Figma-ready spec (JSON) or produce a clickable prototype using a Figma plugin. Let me know which option you prefer.
