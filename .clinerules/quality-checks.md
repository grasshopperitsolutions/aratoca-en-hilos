## Brief overview

This rule defines the mandatory quality checks that must be run at the end of every task before marking it as complete. These checks ensure code correctness, type safety, and build integrity.

## Required quality checks

- At the end of each task, always run `npm run lint` and fix any lint errors before proceeding.
- After linting, run `npx tsc -b` and fix any TypeScript errors that are found.
- Finally, run `npm run build` to verify the project builds successfully without errors.
- Do not mark a task as complete until all three checks pass cleanly.