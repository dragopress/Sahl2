# AI Assistant Acceptance Tests

- A user cannot access AI endpoints without `ai:read`.
- A user cannot dismiss insights without `ai:write`.
- Tenant A never receives insight context from tenant B.
- Re-running insight generation within 24 hours does not create duplicate active insights for the same user/title.
- Dismissed insights are excluded from the active UI list.
- Cash questions use live tenant cash calculations.
- Receivable questions use live invoice status/amounts.
- Stock questions use live product stock/minimum-stock values.
- Task questions use live task status/due dates.
- Unsupported questions return a bounded explanation rather than inventing facts.
- No external AI provider is contacted in rules mode.
