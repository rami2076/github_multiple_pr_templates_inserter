# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that inserts predefined PR templates into GitHub Pull Request descriptions. It allows users to configure up to 2 templates with placeholder support and domain restrictions.

## Architecture

The extension consists of three main components:

- **Content Script** (`content.js`): Injects a "テンプレート挿入" button into GitHub PR pages and handles placeholder modal UI
- **Options Page** (`options.html`/`options.js`): Settings interface for managing templates and allowed domains
- **Manifest** (`manifest.json`): Chrome extension configuration with required permissions

## Key Features

- **Template System**: Stores templates in Chrome storage with keys `github_pr_template_1` and `github_pr_template_2`
- **Placeholder Support**: Handles `{{placeholder}}` syntax with modal input forms using regex `/\{\{\s*([\p{L}\p{N}\p{Pc}\p{Pd}]+)\s*\}\}/gu`
- **Domain Filtering**: Only activates on configured domains (default: `github.com`)
- **Path Detection**: Only runs on GitHub PR pages matching pattern `/^\/[^/]+\/[^/]+\/pull\/\d+\/?$/`

## Build and Package

```bash
# Create extension package
./toZip.sh
```

This script creates a ZIP file in `output/output.zip` with all necessary extension files.

## File Structure

- `content.js`: Main content script with template insertion logic
- `options.js`: Settings management (templates, domains, selection)
- `manifest.json`: Extension manifest (v3)
- `toZip.sh`: Build script for packaging
- `icons/`: Extension icons in multiple sizes
- `output/`: Build output directory

## Storage Keys

- `github_pr_template_1`: First template content
- `github_pr_template_2`: Second template content  
- `github_pr_selected_template`: Currently selected template ("1" or "2")
- `github_pr_allowed_domains`: Array of allowed domains

## Development Notes

The extension uses Chrome Extension Manifest V3 with storage and scripting permissions. It runs on all URLs but only activates on configured domains and GitHub PR pages.