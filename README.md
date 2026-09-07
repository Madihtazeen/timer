# TimeFlow — Personal Time & Calendar Dashboard

TimeFlow is a modern, simple, and calm personal time, date, calendar, countdown timer, and stopwatch dashboard built with **React 19**, **TypeScript**, and **Vite**.

Designed with a clean **White + Lavender** aesthetic (`#FAF9FF`, `#FFFFFF`, `#A78BFA`, `#EDE9FE`, `#27233A`), subtle shadows, and modern typography.

---

## ✨ Features

- 🕒 **Live Hero Clock**: Real-time display of hours, minutes, and seconds. Supports 12-hour (with AM/PM) and 24-hour formats with smooth tabular digits to avoid jitter.
- 📅 **Interactive Calendar**: Monthly calendar with 7 weekday columns, leap year safety, today highlighting, and quick navigation.
- 📝 **Calendar Event Notes**: Add, view, and delete daily notes and events with browser `localStorage` persistence.
- ⏳ **Countdown Timer**: 25-minute Pomodoro focus preset, quick interval presets (5m, 15m, 25m, 45m, 60m), custom time inputs, and a gentle Web Audio API chime with a completion alert.
- ⏱️ **Drift-Free Stopwatch**: Centisecond precision (`MM:SS.cs`) using `performance.now()` delta tracking with lap split recording.
- 🌓 **Dark Mode**: Toggleable dark theme maintaining the soft lavender visual identity.
- 🔒 **100% Private**: All data is stored purely in browser local storage. No backend or login required.
- 📱 **Fully Responsive**: Mobile-first layout with touch-friendly targets.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Icons**: Lucide React
- **Sound**: Web Audio API Synthesizer
- **Styling**: Vanilla CSS Design Tokens

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Madihtazeen/timer.git

# Navigate into project directory
cd timer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Building for Production
```bash
npm run build
```
