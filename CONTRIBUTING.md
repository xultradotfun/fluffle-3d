# Contributing to Fluffle Tools

Thank you for your interest in contributing to Fluffle Tools! This document provides guidelines and instructions for contributing.

## Development Process

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make your changes
4. Submit a pull request

## Setting Up the Development Environment

1. Ensure you have Node.js 18+ and npm 9+ installed
2. Fork and clone the repository
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update any relevant documentation
3. Ensure your code follows the existing style
4. Make sure all tests pass
5. Your PR will be reviewed by maintainers

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for new functions
- Use meaningful variable and function names
- Keep components small and focused
- Use proper TypeScript types instead of `any`

## Commit Messages

Follow conventional commits format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:

```
feat: add dark mode support for PFP generator
```

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test in both light and dark modes
- Test responsive layouts
- Test with different NFT IDs

## Documentation

- Update component documentation
- Add inline comments for complex logic
- Update README if adding new features
- Document any new environment variables

## Need Help?

- Check existing issues and pull requests
- Create a new issue for discussions
- Tag maintainers for urgent matters

## License and Usage Rights

By contributing to this project, you agree that your contributions will be licensed under our custom license terms. This means:

1. Your contributions can be used as part of the original Fluffle Tools project
2. You retain the right to use your contributions for private purposes
3. You may not redistribute the entire project or substantial portions of it
4. You may not create derivative works for public distribution
5. Commercial use of the code is not permitted without explicit permission

Please read the full [LICENSE](LICENSE) file before contributing.
