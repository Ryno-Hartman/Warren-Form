# Design System

## Direction

A mobile-first consultation form inspired by a quiet evening conversation: the visitor is at home, likely on a phone, looking for clarity without sales pressure. A dark introductory field establishes privacy and focus; a bright form surface makes the task feel straightforward.

## Color

Use a committed palette with one deep rose brand color, supported by neutral black and white and a small mint signal color. All authored colors use OKLCH.

- Background: `oklch(0.08 0 0)`
- Elevated dark surface: `oklch(0.14 0.008 330)`
- Form surface: `oklch(1 0 0)`
- Soft form surface: `oklch(0.975 0.004 330)`
- Primary rose: `oklch(0.45 0.15 330)`
- Primary hover: `oklch(0.39 0.145 330)`
- Mint accent: `oklch(0.82 0.11 165)`
- Main ink: `oklch(0.16 0.01 330)`
- Muted ink: `oklch(0.42 0.012 330)`
- Error: `oklch(0.48 0.19 25)`
- Success: `oklch(0.48 0.12 160)`

## Typography

Use Public Sans where web fonts are available, with Aptos, Segoe UI, and system sans-serif fallbacks. Headings use strong 700–800 weights and a fluid scale. Form controls and labels stay at 16px or larger to avoid mobile zoom; secondary hints and metadata use a consistent 14px step.

## Layout

On mobile, stack the dark introduction above the white form. On wide screens, use an asymmetric 39/61 split with a sticky, full-height introduction. Use a 4px-based spacing scale and vary tight field grouping against generous section separation.

## Components

- Inputs and selects: 52–56px minimum height, 8px radius, full-perimeter border, visible focus ring.
- Choice controls: native checkbox and radio inputs enlarged for touch, with the entire label as the hit target.
- Primary action: full-width rectangular rose button with white text and a clear loading label.
- Notices: full-border tinted surfaces; never side-stripe callouts.
- Status: inline field errors plus a focusable error summary; a dedicated success state replaces the form after submission.

## Motion

Use one restrained page-load sequence and short interaction transitions. All essential content remains visible without animation, and reduced-motion preferences disable movement.
