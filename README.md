# 🧮 Vue Calculator - Modern & Beautiful

A sleek, feature-rich calculator built with Vue 3, Nuxt, and Tailwind CSS. Experience elegant design with powerful functionality in a responsive, accessible interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/Vue-3-green.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-3-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## ✨ Features

- **🎨 Modern UI Design** - Glassmorphism effects with gradient buttons and smooth animations
- **🌓 Dark Mode Support** - Seamless switching between light and dark themes
- **⌨️ Full Keyboard Support** - Type numbers and operations directly from your keyboard
- **📋 Calculation History** - Keep track of all your calculations with a beautiful sidebar
- **💾 Memory Functions** - M+ button to store and accumulate values
- **📋 Copy to Clipboard** - Quick access to copy results
- **🔧 Advanced Operations** - Supports `+`, `−`, `×`, `÷`, `%`, and `^` (power)
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **♿ Accessible** - Full keyboard navigation and semantic HTML
- **⚡ Fast & Lightweight** - Built with Nuxt 3 for optimal performance
- **🎯 Precision** - Accurate calculations with proper error handling

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vue-calculator.git
cd vue-calculator

# Install dependencies
npm install
```

### Development

Start the development server on `http://localhost:5173`:

```bash
npm run dev
```

### Production Build

Build the application for production:

```bash
npm run build

# Preview production build
npm run preview
```

## 📖 Usage

### Basic Operations

1. Click or type numbers to enter values
2. Press an operation button (`+`, `−`, `×`, `÷`)
3. Enter the next number
4. Press `=` to calculate the result

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0-9` | Enter numbers |
| `+` `-` `*` `/` | Basic operations |
| `Enter` / `=` | Calculate |
| `Backspace` | Delete last digit |
| `Delete` / `C` | Clear everything |
| `.` | Decimal point |

### Advanced Features

- **History Panel** - Click the 📋 icon to view all calculations
- **Memory Function** - Click `M` to add current value to memory
- **Copy Result** - Click the copy icon to copy result to clipboard
- **Clear Operations** - Use AC button to reset the calculator

## 🏗️ Project Structure

```
vue-calculator/
├── app/
│   └── app.vue                 # Main app component
├── components/
│   ├── Calculator.vue          # Calculator component
│   └── HistoryPanel.vue        # History panel component
├── composables/
│   ├── useCalculatorHistory.ts # History logic
│   └── useKeyboardSupport.ts   # Keyboard handling
├── public/
│   └── robots.txt
├── nuxt.config.ts              # Nuxt configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json
```

## 💻 Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Nuxt 3** - Vue meta-framework for production
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling

## 🎯 Features in Detail

### 🎨 Beautiful Design

The calculator features:
- Gradient backgrounds and button effects
- Smooth transitions and hover animations
- Backdrop blur effects for history panel
- Color-coded operation buttons
- Responsive layout that adapts to all screen sizes

### 📋 History Management

- View all previous calculations
- Click any history item to reuse the result
- Delete individual history entries
- Clear all history at once
- Timestamps for each calculation

### ⌨️ Keyboard Integration

Fully keyboard-friendly:
- Complete number and operation input via keyboard
- All shortcuts work intuitively
- Screen reader support for accessibility
- Focus indicators for keyboard navigation

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📧 Contact

Have questions or suggestions? Feel free to reach out!

---

**Built with ❤️ using Vue 3 and Nuxt 3**
