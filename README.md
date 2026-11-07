# Movie_App_Sample 🎬

This is a modern Movie Application inspired by streaming platforms like Netflix, built using **React Native**, **Expo SDK 54**, and **Expo Router**.

**Author**: Shalini Wanasinghe  
**Email**: [2021ict75@stu.vau.ac.lk](mailto:2021ict75@stu.vau.ac.lk)

---

## ✨ Features

- **🎬 Movie Discovery**: Browse a curated list of popular movies with posters, cast details, release dates, and genres.
- **🔍 Real-Time Search**: Instant search filtering by both movie title and genre.
- **🌐 Trilingual Localization**: Live language switcher supporting English (`EN`), Tamil (`TA`), and Sinhala (`SI`).
- **🌓 Dark & Light Theme**: Toggle between elegant dark and clean light themes, respecting device system settings.
- **❤️ Favorites System**: Add or remove movies to/from favorites with real-time persistence in `AsyncStorage`.
- **⭐ 5-Star Rating System**: Rate any movie and persist your rating locally.
- **🕒 Recently Viewed Carousel**: Automatically tracks your viewing history.
- **👤 Profile Dashboard**: Displays user identity and dynamic metrics for Total Watched and Favorites.
- **📱 Responsive Navigation**: Persistent bottom navigation bar with active tab indicators and credits footer.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18 or newer) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the App

#### Web Browser
```bash
npm run web
# or: npx expo start --web
```

#### Expo Go (Android & iOS)
```bash
npx expo start
```
Scan the QR code with the **Expo Go** mobile app on your phone.

#### Android Emulator
```bash
npm run android
```

---

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 54](https://expo.dev/)
- **Core Library**: [React 19](https://react.dev/) / [React Native 0.81](https://reactnative.dev/)
- **Routing**: [Expo Router v6](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Language**: TypeScript 5.9

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
