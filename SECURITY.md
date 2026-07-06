# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Invitely, please send an email to Salah Uddin Kader at **salahuddingfx@gmail.com**. All security vulnerabilities will be promptly addressed.

**Please do NOT report security vulnerabilities through public GitHub issues.**

### What to include

When reporting a vulnerability, please include:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 1 week
- **Fix deployed**: Depends on severity

## Security Best Practices

When contributing to this project, please follow these guidelines:

- Never commit `.env` files or secrets to the repository
- Use environment variables for all sensitive configuration
- Validate and sanitize all user inputs
- Use HTTPS for all API communications
- Implement proper CORS policies
- Use secure HTTP headers
- Follow OWASP guidelines for web application security

## Authentication & Authorization

- Passwords are hashed using bcrypt with salt rounds
- JWT tokens are used for session management
- Role-based access control (RBAC) is enforced on all admin routes
- Token expiration is enforced

## Data Protection

- User passwords are never stored in plain text
- API keys and secrets are stored in environment variables
- Sensitive data is excluded from version control via `.gitignore`
- File uploads are validated and restricted by type and size

## Contact

For any security concerns, please contact:
- **Salah Uddin Kader** - salahuddingfx@gmail.com
