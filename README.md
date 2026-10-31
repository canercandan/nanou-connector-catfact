# nanou connector: Cat facts

A small test connector for [nanou](https://nanou.ai)'s Private connectors.
The family's owner pastes this repo's link on nanou.ai → Connectors →
Private connectors, reads what it may do, and installs it.

- `catfact fact`, `catfact facts --limit 5`: random facts from catfact.ninja
- `catfact favorites`: the facts you saved
- `catfact favorite --text "…"`: save one. It changes something, so nanou asks
  for a ✓ on a card first, and refuses it when the connector is installed read-only.

It reaches only `catfact.ninja`, needs no key, and keeps favorites in its own
folder. See the [connector guide](https://github.com/nanou-labs/connectors/blob/main/docs/build-a-connector.md).
