# webcmd-plugin-bookmyshow

BookMyShow movie discovery commands for Webcmd.

This plugin packages the BookMyShow `movies` and `search` adapters from
[`Mr-Ashish/webcmd`](https://github.com/Mr-Ashish/webcmd/tree/main/clis/bookmyshow)
as an external Webcmd plugin.

## Install

```bash
# From local development directory
webcmd plugin install file:///path/to/book-my-show-plugin-webcmd

# From GitHub
webcmd plugin install github:rishabhraj36/book-my-show-plugin-webcmd
```

## Commands

| Command | Type | Description |
|---------|------|-------------|
| `bookmyshow/movies` | JavaScript | List currently showing movies for a city, optionally filtered by language |
| `bookmyshow/search` | JavaScript | Search currently showing movies for a city, optionally filtered by language |

## Examples

```bash
webcmd bookmyshow movies mumbai --language hindi --limit 10 -f json
webcmd bookmyshow search "spider" --city mumbai --language english --limit 10 -f json
```

## Development

```bash
# Install locally for development (symlinked, changes reflect immediately)
webcmd plugin install file:///path/to/book-my-show-plugin-webcmd

# Verify commands are registered
webcmd list | grep bookmyshow

# Run a command
webcmd bookmyshow movies mumbai --language hindi --limit 10
webcmd bookmyshow search "spider" --city mumbai --language english --limit 10
```

## Source And License

The adapter runtime files are copied from `Mr-Ashish/webcmd` commit
`8e592b2`, which is licensed under Apache-2.0. See [LICENSE](./LICENSE).
