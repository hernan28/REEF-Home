# Project Setup Guide

## Prerequisites
- Docker
- Docker Compose
- Git

## Getting Started

### Clone the Repository
```bash
git clone <repository-url>
cd <project-directory>
```

## Running with Docker

### Build and Start Containers
```bash
# Build and start all services in detached mode
docker-compose up -d
```

### Stop Containers
```bash
docker-compose down
```

### Rebuild Containers
If you make changes to the Dockerfile or need to rebuild:
```bash
docker-compose up -d --build
```

## Development Commands

### Access Container Shell
```bash
docker-compose exec app sh
```