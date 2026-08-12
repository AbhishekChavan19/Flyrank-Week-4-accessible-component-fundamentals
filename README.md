# FE-05 — Accessible Component Fundamentals

React + TypeScript accessibility component playground built as part of the **Frontend AI Engineering** internship at **Flyrank.ai**.

## Overview

This project demonstrates the implementation of three interactive accessible components built from scratch without using component libraries:

- **Modal Dialog**
- **Tabs**
- **Disclosure / Accordion**

The goal of this assignment was to understand the accessibility fundamentals behind interactive UI components, including ARIA semantics, keyboard interaction, focus management, and focus restoration.

The project also includes generated **shadcn/ui** Dialog and Tabs components for source-code comparison and accessibility analysis.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Radix UI primitives
- Lucide React

---

## Project Structure

```text
src/
├── playground/
│   └── components/
│       └── custom/
│           ├── Modal.tsx
│           ├── Tabs.tsx
│           └── Disclosure.tsx
│
├── components/
│   └── ui/
│       ├── dialog.tsx
│       └── tabs.tsx
│
└── ...

NOTES.md
README.md
package.json
tsconfig.json
