# Rick and Morty App

A React Native application built with TypeScript that fetches and displays character data from the Rick and Morty API.

## Showcase
[Showcase Video Link](https://drive.google.com/file/d/1LrxWgrV7ynbc4uVdIvBit4JwDCVhy1B-/view?usp=sharing)

## Features

- **Character List Screen**: Paginated list with infinite scroll
- **Expandable Cards**: Quick view with smooth animations
- **Character Details**: Complete character information
- **Scroll to Top**: Floating button for easy navigation
- **Pull to Refresh**: Refresh character data
- **Modern UI**: Clean, responsive design with status indicators

## Public API Used

This application uses the **Rick and Morty API**:
- **Base URL**: `https://rickandmortyapi.com/api`
- **Characters Endpoint**: `/character`
- **Documentation**: [Rick and Morty API Docs](https://rickandmortyapi.com/documentation)

## 🚀 Setup and Run Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm
- Expo CLI
- iOS Simulator (for iOS) or Android Studio (for Android)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohyware/RickandMorty
   cd RickandMorty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Available Scripts**

   ```bash
   npm run lint 
   npm run test       
   ```

## Architecture Decisions

### **State Management**
- **Redux Toolkit**: Chosen for predictable state management
- **Async Thunks**: For API calls and side effects

### **Data Fetching**
- **React Query**: For efficient data caching and synchronization
- **Automatic Background Refetching**: Keeps data fresh
- **Error Handling**: Comprehensive error states

### **Navigation**
- **Expo Router**: File-based routing system

### **Performance Optimizations**
- **FlashList**: High-performance list rendering
- **Image Optimization**: Expo Image with caching
- **Memoization**: useCallback for re-render prevention
- **Lazy Loading**: Infinite scroll with pagination

## App Structure

### **Screens**
1. **Character List**: Main screen with paginated character list
2. **Character Details**: Modal screen with complete character information

### **State Management Flow**
```
User Action -> Redux Action -> API Call -> State Update -> UI Re-render
```
