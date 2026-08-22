# Command Center

The command center is a web productivity layer rather than a separate data API.

## Shortcuts

- `Ctrl/Cmd + K`: command palette
- `N`: quick-create menu (ignored while typing in form controls)
- `Escape`: close overlays
- `Arrow Up/Down`: navigate palette
- `Enter`: execute selection

## Routes

- `/command` — command-center workspace
- Existing module routes receive `?create=1` as the standardized quick-create intent.

Entity lookup remains on `GET /api/v1/search` and is intentionally separate from command filtering so operational commands stay instant and deterministic.
