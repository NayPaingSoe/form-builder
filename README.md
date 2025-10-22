# vite-project2

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS


# Form Builder – Project Notes

## Overview
This app is a minimal Form Builder + Renderer built with Vue 3 + Vite. It lets you compose forms from a set of fields (Heading, Text, Number, Radio), preview the layout, and render the final user form for submission.

Screens show a three-column builder experience: a left sidebar with field types, a center editor for field configuration, and a right panel for a live preview.

## Design Concepts
- **Modern, calm dashboard aesthetic**: Subtle borders, soft shadows, and rounded corners using Tailwind classes like `border-slate-200/70`, `bg-white/70`, `shadow-sm`, `rounded-xl`, and `backdrop-blur`.
- **Neutral slate palette**: Uses Slate grays for balance and hierarchy. Labels use `text-xs text-slate-600`; inputs are `bg-white/80` with neutral placeholders.
- **Consistent input rhythm**: Inputs are `h-9`, with compact labels and `space-y-*` for vertical rhythm. Errors use `text-rose-600` for a softer red.
- **Clear primary action**: Dark, accessible primary button `bg-slate-900 hover:bg-slate-800` with light ring for focus.
- **Card-based layout**: Every surface (builder panels, preview, renderer) is a card with a light divider and a restrained header.
- **Iconography**: Field buttons include Lucide icons for quick scanning (e.g., `Heading1`, `Type`, `Calculator`, `CircleDot`).
- **Responsiveness & readability**: Content is constrained with `max-w-2xl` in editors and preview to keep line length readable.

## Key Technical Decisions
- **State management**: A centralized Pinia store `useFormBuilderStore` in `src/stores/form_builder.ts` maintains the list of form items and edit state (`selectedField`, `isEditingText`, editing draft, etc.).
- **Validation**:
  - Builder forms (e.g., `TextFormBuilder.vue`, `NumberFormBuilder.vue`, `RadioFormBuilder.vue`, `HeadingFormBuilder.vue`) use `vee-validate` + `yup` for schema validation and controlled inputs via `defineField()`.
  - The renderer (`src/views/FormRender.vue`) dynamically builds a Yup schema based on the items list and field rules (e.g., `required`, numeric min/max, integer constraint via `allow_decimal`). Numbers transform empty input to `undefined` for clean optionality.
- **Form preview + builder UX**:
  - `src/components/ui/PreviewForm.vue` shows a live preview and supports drag-and-drop ordering with `vue-draggable-plus`.
  - Dedicated preview components (`TextInputPreview.vue`, `NumberInputPreview.vue`, `RadioInputPreview.vue`, `HeadingInputPreview.vue`) render each field in the builder preview.
- **TypeScript-first**: Field models live in `src/lib/types.ts`. Components and stores use typed props/values to reduce `any` usage. Icon map typing avoids implicit any.
- **UI primitives**: Inputs, buttons, and cards live under `src/components/ui/` for consistency. Toaster notifications use `vue-sonner`.
- **Routing**: Two routes via Vue Router (`/` Form Builder, `/renderer` Form Renderer) in `src/router/index.ts`.

## Project Structure (selected)
- `src/views/FormBuilder.vue` – 3-column builder layout. Left: field types. Middle: field editors. Right: live preview.
- `src/views/FormRender.vue` – Final user-facing form with validation and submit toast.
- `src/components/ui/*FormBuilder.vue` – Editors for each field type.
- `src/components/ui/*InputPreview.vue` – Builder-side preview entries.
- `src/stores/form_builder.ts` – Pinia store with items, selection, and edit actions.
- `src/components/ui/input/Input.vue` – Controlled input primitive used across the app.

## Run the Project
- **Install**
```bash
npm install
```

- **Dev server**
```bash
npm run dev
```
Visit the URL printed by Vite (typically http://localhost:5173).

- **Build**
```bash
npm run build
```

- **Preview production build**
```bash
npm run preview
```

No environment variables are required.

## How to Use
- **Build a form** on `/`:
  - Choose a field type from the left sidebar (with icons).
  - Configure its properties in the center panel (labels, placeholders, constraints, required, etc.).
  - See the live result in the right panel; reorder fields by dragging.
  - Use the primary action to add/update a field; toasts confirm actions.
- **Render the form** on `/renderer`:
  - The dynamic Yup schema validates inputs based on your builder configuration.
  - Submit to see a success toast with JSON of the values.

## Extending the App
- Add a new field type by:
  - Extending the field union/types in `src/lib/types.ts` and the Pinia store shape.
  - Creating `XFormBuilder.vue` (editor) and `XInputPreview.vue` (builder preview).
  - Updating `FormBuilder.vue` (sidebar list + optional icon mapping) and `FormRender.vue` (schema + renderer block).

## Tech Stack
- Vue 3, TypeScript, Vite
- Pinia
- Vue Router
- Vee-validate + Yup
- Tailwind CSS
- Lucide icons (`lucide-vue-next`)
- Vue Draggable Plus
- Vue Sonner (toasts)

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
