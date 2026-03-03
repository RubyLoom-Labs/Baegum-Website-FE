# Baegum Website - React + Vite

A modern, fast, and responsive website built with React 18, Vite, and Tailwind CSS. This project demonstrates best practices for modern web development with a clean architecture and professional structure.

## 🚀 Features

- **React 18** - Latest React with hooks and efficient rendering
- **Vite** - Ultra-fast build tool with HMR (Hot Module Replacement)
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Declarative routing for single-page applications
- **ESLint** - Code linting and formatting
- **Responsive Design** - Mobile-first, fully responsive layout
- **Component Architecture** - Well-organized component structure
- **Custom Hooks** - Reusable React hooks for common functionality
- **Utility Functions** - Helpers and utilities for development

## 📁 Project Structure

```
src/
├── components/        # Reusable React components
│   ├── Header/
│   ├── Footer/
│   ├── HeroSection/
│   └── ...
├── pages/            # Page components
│   ├── Home.jsx
│   ├── About.jsx
│   └── NotFound.jsx
├── hooks/            # Custom React hooks
│   └── useScroll.js
├── utils/            # Utility functions
│   └── helpers.js
├── constants/        # Application constants
│   └── app.js
├── styles/           # Global styles
│   └── index.css
├── assets/          # Static assets
├── App.jsx          # Root component
└── main.jsx         # Application entry point
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically

## 🎨 Customization

### Tailwind Configuration
Edit `tailwind.config.js` to customize colors, fonts, and breakpoints:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
      },
    },
  },
}
```

### Component Structure
All components are organized in `src/components/` with subdirectories for each component:
- Each component has its own folder
- Includes the JSX file and any related styles

### adding New Pages
1. Create a new JSX file in `src/pages/`
2. Add a new route in `src/App.jsx`

Example:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

## 🚀 Performance Optimizations

- **Code Splitting** - Automatic with Vite
- **Tree Shaking** - Removes unused code
- **Lazy Loading** - With React Router
- **Image Optimization** - Use appropriate formats and sizes
- **CSS Optimization** - Tailwind purges unused styles

## 📱 Responsive Breakpoints

- `sm` - 640px
- `md` - 768px
- `lg` - 1024px
- `xl` - 1280px
- `2xl` - 1536px

## 🔧 Development Best Practices

1. **Component Composition** - Keep components small and reusable
2. **Props Validation** - Document props with comments
3. **State Management** - Use React hooks (useState, useContext, etc.)
4. **Performance** - Use React.memo for expensive components
5. **Accessibility** - Include proper ARIA labels and semantic HTML
6. **Type Safety** - Add JSDoc comments for better IDE support

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Routing

### Development
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `eslint` - Code linter
- `postcss` - CSS processing
- `autoprefixer` - CSS vendor prefixes

## 🎯 Next Steps

1. Customize the site content and branding
2. Add more pages and components
3. Implement backend API integration
4. Add authentication if needed
5. Deploy to your hosting platform

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Ruby Loom Labs

---

**Happy Coding! 🚀**
