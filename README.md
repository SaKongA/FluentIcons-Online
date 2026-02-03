# Fluent Icons Online

A lightweight, web-based viewer for Microsoft [Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons). This tool allows you to browse, search, and download icons directly from your browser.

**Live Demo:** [https://blog.lostzone.cn/FluentIcons-Online/](https://blog.lostzone.cn/FluentIcons-Online/)

## Features

- **Search & Browse**: Quickly find icons by name or keywords.
- **Style Filtering**: Toggle between Regular, Filled, or view all styles.
- **Smart Preview**: View icons in various standard sizes (16px, 20px, 24px, etc.).
- **Download**: Export icons as SVG, PNG, or PDF.
- **Auto-Sync**: The icon library is automatically updated daily via GitHub Actions to match the official Microsoft repository.
- **Multi-language**: Supports English and Simplified Chinese.

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/SaKongA/FluentIcons-Online.git
   cd FluentIcons-Online
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

## Data Update Script

The project uses a Python script (`build-icons-data.py`) to generate the icon index (`src/data/icons-index.json`) and copy assets.

To run this locally, you need the official `fluentui-system-icons` repository located nearby, or update the path in the command:

```bash
# Example: assuming external/fluentui-icons contains the official repo
python build-icons-data.py path/to/fluentui-system-icons/assets
```

## Credits

- Icons provided by [Microsoft Fluent UI System Icons](https://github.com/microsoft/fluentui-system-icons).
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [Fluent UI React Components](https://react.fluentui.dev/).

## License

This project code is licensed under the MIT License. Use of the icons is subject to Microsoft's license.
