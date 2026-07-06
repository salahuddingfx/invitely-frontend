# Contributing to Invitely

Thank you for your interest in contributing to Invitely! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Branch Naming](#branch-naming)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [License](#license)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/invitely-frontend.git
   ```
3. Set up the upstream remote:
   ```bash
   git remote add upstream https://github.com/salahuddingfx/invitely-frontend.git
   ```

## How to Contribute

### Reporting Bugs

- Check existing issues to avoid duplicates
- Create a new issue with a clear title and description
- Include steps to reproduce the bug
- Provide screenshots if applicable
- Mention your environment (OS, browser, Node version)

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would be valuable

### Submitting Code

- Pick an issue or create one first
- Comment on the issue to claim it
- Follow the development setup below
- Create a pull request when ready

## Development Setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/invitely-frontend.git
cd invitely-frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## Branch Naming

Use descriptive branch names:

- `feature/invitation-templates` - New features
- `bugfix/countdown-timer` - Bug fixes
- `docs/api-documentation` - Documentation updates
- `refactor/store-logic` - Code refactoring
- `test/invitation-component` - Adding tests

## Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(invitation): add countdown timer component
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test thoroughly

3. **Commit your changes** with a clear message

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub:
   - Use a descriptive title
   - Reference the related issue (e.g., `Closes #42`)
   - Describe what changes were made and why
   - Add screenshots for UI changes

6. **Wait for review** - Address any feedback

## Coding Standards

### TypeScript/React

- Use TypeScript for all new components
- Define proper types and interfaces
- Use functional components with hooks
- Follow existing component structure
- Use Zustand for state management
- Use React Hook Form + Zod for forms

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design
- Test on multiple screen sizes

### General

- Write clean, readable code
- Add comments for complex logic
- Follow existing naming conventions
- Keep components small and focused
- Avoid unnecessary dependencies

## Questions?

If you have questions, feel free to open an issue or reach out to **Salah Uddin Kader**.

Thank you for contributing to Invitely!
