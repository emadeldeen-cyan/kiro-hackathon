# Book Management App - Frontend

This is the Angular frontend for the Book Management System.

## Project Setup

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

### Technologies
- Angular 21
- TypeScript
- Angular Material
- SCSS for styling
- HttpClient for API communication

### Project Structure
```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── api.service.ts    # Base API service for backend communication
│   ├── app.config.ts              # Application configuration with providers
│   └── app.routes.ts              # Application routing configuration
├── environments/
│   ├── environment.ts             # Development environment config
│   └── environment.prod.ts        # Production environment config
└── proxy.conf.json                # Proxy configuration for development
```

## Development server

To start a local development server with proxy configuration, run:

```bash
npm start
```

Or using Angular CLI:

```bash
ng serve
```

The application will be available at `http://localhost:4200/`. The proxy is configured to forward `/api` requests to `http://localhost:3000`.

## Environment Configuration

The application uses environment files to configure the backend API URL:

- **Development**: `environment.ts` - Points to `http://localhost:3000/api`
- **Production**: `environment.prod.ts` - Points to `/api` (relative path)

## Proxy Configuration

The `proxy.conf.json` file is configured to proxy API requests during development:
- All requests to `/api` are forwarded to `http://localhost:3000`
- This avoids CORS issues during local development

## Building

To build the project for production:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Running unit tests

To execute unit tests:

```bash
ng test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
