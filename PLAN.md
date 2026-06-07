# Cortex - Implementation Plan

## Goal
To build a native desktop application that acts as a "Visual Cortex" for local AI agents, allowing users to visually explore, edit, and prune the internal memories, context, and chat logs saved locally on their PC.

## Tech Stack
- **Framework:** Tauri v2
- **Frontend:** React + Vite + TypeScript
- **Styling:** TailwindCSS
- **Visuals:** React Flow (for node graphs)
- **Database Parsing:** Rust + SQLite/JSON

## Phases
1. **Phase 1: Project Setup** - Initialize directories, rules, workflows, and basic configuration files.
2. **Phase 2: App Initialization** - Setup Tauri and React boilerplate.
3. **Phase 3: Core Features** - Implement Memory Graph View and Timeline.
4. **Phase 4: Polish** - Add animations and final touches.
