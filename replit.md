# SprinkleX

## Overview

SprinkleX is a smart irrigation and plant care application with the tagline "Water Smart. Grow Smart." This is a React-based frontend application built with modern web technologies, designed to provide an intuitive user interface for managing smart watering systems and plant care solutions.

The application is built as a single-page application (SPA) using React 19 with Vite as the build tool, focusing on fast development and optimal performance. The project appears to be in early development stages, with a foundational setup ready for implementing smart irrigation features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with modern JSX support and the latest React features
- **Build Tool**: Vite for fast development server, hot module replacement (HMR), and optimized production builds
- **Styling**: Tailwind CSS 4.x for utility-first styling with custom color theme including 'sprinkle-green' (#22c55e) and 'sprinkle-dark' (#111111) reflecting the brand identity
- **Animation**: Framer Motion for smooth animations and interactions
- **Icons**: Lucide React for consistent and lightweight iconography

### Development Environment
- **Code Quality**: ESLint with React-specific rules, hooks validation, and fast refresh support
- **Module System**: ES modules throughout the application
- **Development Server**: Configured to run on host 0.0.0.0:5000 for accessibility across different environments

### UI/UX Design Patterns
- **Responsive Design**: Mobile-first approach using Tailwind's responsive utilities
- **Brand Consistency**: Custom color palette integrated into Tailwind configuration
- **Performance**: Optimized loading states and smooth scroll behavior implemented globally

### Development Workflow
- **Hot Reloading**: Vite's fast refresh for immediate feedback during development
- **Linting**: Automated code quality checks with modern ESLint configuration
- **Build Optimization**: Vite's rollup-based bundling for production deployments

## External Dependencies

### Core Libraries
- **React 19**: Latest React version with concurrent features and improved performance
- **React DOM 19**: For rendering React components to the DOM

### Development Tools
- **Vite**: Modern build tool providing fast development server and optimized builds
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **PostCSS**: CSS post-processor with Autoprefixer for cross-browser compatibility

### UI Enhancement
- **Framer Motion**: Animation library for creating smooth, performant animations
- **Lucide React**: Modern icon library providing consistent SVG icons

### Code Quality
- **ESLint**: Linting tool with React-specific plugins for code quality enforcement
- **TypeScript Types**: Type definitions for React development (development dependency)

### Build Process
- **Autoprefixer**: Automatic vendor prefix addition for CSS compatibility
- **PostCSS**: CSS processing pipeline for Tailwind and other transformations

The application is configured for deployment flexibility with host binding to 0.0.0.0, making it suitable for containerized environments or cloud deployments. The strict port configuration ensures consistent development and preview environments.