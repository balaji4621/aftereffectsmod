# Contributing to Antigravity AI Video Engine

Thank you for your interest in contributing to the Antigravity AI Video Engine! This document provides guidelines and instructions for contributing.

## How to Contribute

### 1. Fork the Repository
Click the "Fork" button on the GitHub repository page to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/aftereffectsmod.git
cd aftereffectsmod
```

### 3. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 4. Make Your Changes
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: describe your change"
```

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request
Open a pull request from your feature branch to the main repository.

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Adobe After Effects 2025 (optional, for AE backend)

### Installation
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Setup pre-commit hooks
pip install pre-commit
pre-commit install
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Running the Application
```bash
# Start the web dashboard
python server.py

# Run asset ingestion
npm run ingest

# Render with Remotion
npm run render:remotion
```

## Code Style

### TypeScript
- Use ESLint for code linting
- Follow Prettier formatting
- Use TypeScript strict mode
- Add type annotations for functions

### Python
- Follow PEP 8 style guidelines
- Use type hints for function signatures
- Write docstrings for all modules and functions
- Use logging instead of print statements

## Pull Request Guidelines

### Before Submitting
- [ ] All tests pass
- [ ] Code is linted and formatted
- [ ] Documentation is updated
- [ ] No breaking changes (unless necessary)

### PR Description
Include:
- What the PR does
- Why it's needed
- How to test it
- Any breaking changes

## Reporting Issues

When reporting issues, please include:
1. Clear description of the problem
2. Steps to reproduce
3. Expected vs actual behavior
4. Environment details (OS, Node.js version, Python version)
5. Relevant logs and error messages

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming, inclusive experience for everyone. Please see our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the project's license.