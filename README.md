# Automation Management API

Design an API that allows users to manage automations with associated name, environment id, critical ratio, criticality. The API should
provide endpoints for adding, deleting, updating automations, and getting all automations. The API should also include access to some kind
of storage.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development

### Prerequisites

What things you need to install the software and how to install them:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Setting Up Environment

Before running the application, you need to set up the environment variables:

1. Create a `.env` file in the root directory of the project.
2. Add the necessary environment variables to the `.env` file. For example:

```
DB_HOST=localhost
DB_PORT=27017
DB_USER=username
DB_PASS=password
```

### Running with Docker

To run the database with Docker:

```bash
docker-compose up
```

This command starts the services defined in your docker-compose.yml file. Make sure Docker is running on your machine before executing this command.

### Running the Application

To start the project in different environments:

Development:

```bash
pnpm run start
```

Watch Mode:

For development, you can run the application in watch mode. In this mode, the application will reload automatically if you make any changes to the code.

```bash
pnpm run start:dev
```

### API Documentation

To view the API documentation, navigate to the Swagger UI after starting the application:

http://localhost:3000/api/docs

This interface provides a comprehensive overview of all the API endpoints, their expected payloads, and responses.
