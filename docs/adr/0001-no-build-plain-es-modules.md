# No build step, plain ES modules

The app is plain HTML, CSS and JavaScript served as-is: no bundler, no
framework, no `node_modules`, no CI step. The editor form is generated from
the schema in `app/schema.js`, so the form, the sample defaults and the import
check all follow from one description and no framework is needed to keep them
in step. `git push` is the whole deployment.

The alternative was a Vite + React/Vue/Svelte build published to Pages by a
GitHub Action. That buys nicer ergonomics for a form-heavy UI, and costs a
toolchain, a lockfile and a class of broken deploys, for an app whose hardest
problem turned out to be pagination rather than UI state. Adopting a framework
later is a contained change: the template contract does not depend on it.
