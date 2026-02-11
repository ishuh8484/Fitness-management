# Fitness Management - Backend Microservices

A Spring Boot microservices architecture for a fitness tracking application with AI-powered recommendations.

## Project Structure

- **Eureka** - Service Discovery (Port 8761)
- **Config Server** - Centralized Configuration (Port 8888)
- **Gateway** - API Gateway with OAuth2/JWT (Port 8080)
- **User Service** - User management service (Port 8081)
- **Activity Service** - Activity tracking service (Port 8082)
- **AI Service** - AI-powered recommendations service (Port 8083)

## Prerequisites

- Java 21
- Maven 3.9+
- MongoDB (running on localhost:27017)
- Kafka (running on localhost:9092)
- Keycloak (running on localhost:8181)
- Spring Boot 3.5.9
- Spring Cloud 2025.0.1

## Environment Setup

### 1. Install MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Install Kafka
```bash
# Download and extract Kafka
# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka Server (in another terminal)
bin/kafka-server-start.sh config/server.properties
```

### 3. Install Keycloak
```bash
# Using Docker
docker run -d -p 8181:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

Keycloak Setup:
- Create realm: `fitness-app`
- Create client: `oauth2-pkce-client` with PKCE enabled
- Create user with credentials for testing

## Building and Running

### Build All Services
```bash
# From Backend_Microservices directory
mvn clean install
```

### Run Services (in order)
```bash
# 1. Eureka Server
cd eureka
mvn spring-boot:run

# 2. Config Server (in another terminal)
cd ../configserver
mvn spring-boot:run

# 3. User Service (in another terminal)
cd ../userservice
mvn spring-boot:run

# 4. Activity Service (in another terminal)
cd ../activityservice
mvn spring-boot:run

# 5. AI Service (in another terminal)
cd ../aiservice
mvn spring-boot:run

# 6. Gateway (in another terminal)
cd ../gateway
mvn spring-boot:run
```

## Configuration

### Database Configuration
MongoDB connections are configured in each service's config file:
- `activity-service.yml`: `mongodb://localhost:27017/aiactivityfitness`
- `ai-service.yml`: `mongodb://localhost:27017/airecommendationfitness`

Update these in `configserver/src/main/resources/config/` files.

### Kafka Configuration
- Bootstrap servers: `localhost:9092`
- Topic: `activity-events`
- Group ID: `activity-processor-group`

### Gemini API Configuration
Set environment variables for AI recommendations:
```bash
export GEMINI_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
export GEMINI_KEY=your_gemini_api_key
```

## API Endpoints

### Gateway (Port 8080)
- Base URL: `http://localhost:8080/api`
- Routes traffic to appropriate microservices

### Activity Service (Port 8082)
- `POST /api/activities` - Create activity
- `GET /api/activities` - Get user activities

### AI Service (Port 8083)
- `GET /api/recommendations/user/{userId}` - Get all recommendations for user
- `GET /api/recommendations/activity/{activityId}` - Get recommendations for activity

### User Service (Port 8081)
- User management endpoints (configured in gateway routing)

## Key Features

- **Microservices Architecture**: Independent services for scalability
- **Service Discovery**: Eureka for dynamic service registration
- **Centralized Config**: Config Server for environment-specific settings
- **API Gateway**: Single entry point with CORS and security
- **Async Processing**: Kafka for async activity processing
- **AI Integration**: Gemini API for activity recommendations
- **OAuth2/JWT**: Token-based authentication via Keycloak

## Security

- Gateway enforces JWT token validation
- CORS enabled for frontend (localhost:5173)
- Custom headers for user context (X-User-ID)
- Authorization bearer tokens required for all API calls

## Common Issues

### Services not registering with Eureka
- Ensure Eureka server is running first
- Check network connectivity
- Review logs for connection errors

### MongoDB connection errors
- Verify MongoDB is running on port 27017
- Check database names in config files match

### Kafka message processing failures
- Ensure Kafka broker is running
- Check topic names in configuration
- Verify producer/consumer serialization settings

### Gateway routing issues
- Check load balancer (lb://) configuration
- Verify service names in Eureka match gateway routes
- Review CORS and security configurations

## Monitoring

Services expose health checks on:
- `http://localhost:PORT/actuator/health`

View available actuator endpoints:
- `http://localhost:PORT/actuator`

## Development Notes

- Services use Lombok for boilerplate reduction
- MongoDB with Spring Data MongoDB for persistence
- Spring Cloud Config for externalized configuration
- WebClient for async HTTP communication
- Kafka for event-driven architecture

## Dependencies

All projects share:
- Spring Boot 3.5.9
- Spring Cloud 2025.0.1
- Gradle or Maven for build
- MongoDB driver
- Spring Kafka
- Lombok
- Spring Security with OAuth2

## Next Steps

1. Start all services in the specified order
2. Configure Keycloak with realm and client
3. Obtain JWT tokens via OAuth2 flow
4. Test APIs using the frontend application
5. Monitor microservice interactions through logs
