# Form Builder – Project Notes

Type Support for `.vue` Imports in TS

## Overview

This app is a minimal Form Builder + Renderer built with Vue 3 + Vite. It lets you compose forms from a set of fields (Heading, Text, Number, Radio), preview the layout, and render the final user form for submission.

Screens show a three-column builder experience: a left sidebar with field types, a center editor for field configuration, and a right panel for a live preview.

## Live Demo

https://form-builder-fn3y.vercel.app

## Design Concepts

Real-time Preview: When a user updates a field’s label or type, reflect immediately on the preview.
Draggable Fields (Future Enhancement): Allow reordering with drag handles.
Validation Highlighting: In preview, highlight invalid fields with red borders + helper text look **Modern, calm dashboard aesthetic**.

## Key Technical Decisions

**State Management**

- A centralized Pinia store manages the list of form items, the selected field for editing, and temporary editing drafts or text states.

**Validation**

- Builder forms use `vee-validate` combined with `yup` for schema-based validation and controlled input handling through `defineField()`.
- The renderer dynamically generates a Yup schema from the list of items and applies validation rules.

**Form Preview and Builder UX**

- A live preview component displays the current form layout and supports drag-and-drop reordering via `vue-draggable-plus`.
- Each field type (text input, number input, radio button, and heading) has its own dedicated preview component to render field-specific UIs within the builder preview.

**TypeScript-First Approach**

- Field models and type definitions ensure strong typing across components and the store. All props, states, and icon maps are explicitly typed to minimize `any` usage.

**UI library (shadcn-vue)**

- Core UI primitives (Button, Card, Input) follow shadcn-vue patterns and live under `src/components/ui/`. Styling is Tailwind-first with variants built via class recipes and the `cn` helper. Components are local and easy to extend.

**Routing**

- The application is structured with two main routes — one for the Form Builder and one for the Form Renderer — handled through Vue Router.

## Project Structure (selected)

- `src/views/FormBuilder.vue` – 3-column builder layout. Left: field types. Middle: field editors. Right: live preview.
- `src/views/FormRender.vue` – Final user-facing form with validation and submit toast.
- `src/components/ui/*FormBuilder.vue` – Editors for each field type.
- `src/components/ui/*InputPreview.vue` – Builder-side preview entries.
- `src/stores/form_builder.ts` – Pinia store with items, selection, and edit actions.

## Run the Project

**Install**

```bash
npm install
```

**Dev server**

```bash
npm run dev
```

Visit the URL printed by Vite (typically http://localhost:5173).

**Build**

```bash
npm run build
```

## How to Use

**Build a form** on `/`:

- Choose a field type from the left sidebar (with icons).
- Configure its properties in the center panel (labels, placeholders, constraints, required, etc.).
- See the live result in the right panel; reorder fields by dragging.
- Use the primary action to add/update a field; toasts confirm actions.

**Render the form** on `/renderer`:

- The dynamic Yup schema validates inputs based on your builder configuration.
- Submit to see a success toast with JSON of the values.

## Tech Stack

- Vue 3, TypeScript, Vite
- Pinia
- Vue Router
- Vee-validate + Yup
- Shadcn-vue
- Tailwind CSS
- Lucide icons (`lucide-vue-next`)
- Vue Draggable Plus
