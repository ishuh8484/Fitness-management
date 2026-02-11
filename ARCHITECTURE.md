# Fitness Management System - Architecture & Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser                              │
│                  (React 19 + TypeScript)                         │
│                   http://localhost:5173                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS REST API
                            │ Bearer Token Auth
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Spring Cloud Gateway                           │
│                    (Port 8080)                                   │
│  - CORS Configuration                                            │
│  - JWT Token Validation                                          │
│  - Request Routing                                               │
│  - Rate Limiting (Optional)                                      │
└─────────┬─────────────────┬─────────────────┬───────────────────┘
          │                 │                 │
          ↓                 ↓                 ↓
    ┌──────────┐     ┌──────────┐     ┌─────────┐
    │  User    │     │ Activity │     │   AI    │
    │ Service  │     │ Service  │     │ Service │
    │(8081)    │     │(8082)    │     │(8083)   │
    └────┬─────┘     └────┬─────┘     └────┬────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ↓                 ↓                 ↓
    ┌────────┐        ┌────────┐      ┌─────────┐
    │ Eureka │        │ Config │      │ MongoDB │
    │ Server │        │ Server │      │ (27017) │
    │(8761)  │        │(8888)  │      └─────────┘
    └────────┘        └────────┘
                          │
                          ↓
                   ┌────────────────┐
                   │    Keycloak    │
                   │ (8181)         │
                   │ OAuth2/OIDC    │
                   └────────────────┘
```

## Microservices Description

### 1. **Eureka Service Registry** (Port 8761)
- **Purpose**: Service discovery and registration
- **Role**: Central registry for all microservices
- **Features**:
  - Automatic service registration
  - Health checks
  - Load balancing
  - Failover support
- **Configuration**: `eureka/src/main/resources/application.yml`

### 2. **Config Server** (Port 8888)
- **Purpose**: Centralized configuration management
- **Role**: Provides environment-specific configs to services
- **Features**:
  - Environment-specific profiles (dev, staging, prod)
  - Dynamic configuration updates
  - Credential management
- **Configuration Files**: `configserver/src/main/resources/config/`
- **Configs Provided**:
  - `activity-service.yml` - MonogoDB, Kafka, Eureka settings
  - `ai-service.yml` - Gemini API, database, Kafka
  - `gateway-service.yml` - Routes, CORS, security
  - `user-service.yml` - User management settings

### 3. **API Gateway** (Port 8080)
- **Purpose**: Single entry point for all client requests
- **Role**: Routing, authentication, CORS handling
- **Features**:
  - Request routing to microservices
  - OAuth2/JWT token validation
  - CORS configuration
  - Load balancing via Eureka
  - Request/Response filtering
- **Routes**:
  - `/api/users/**` → User Service
  - `/api/activities/**` → Activity Service
  - `/api/recommendations/**` → AI Service
- **Security**: 
  - JWT token validation
  - Custom header support (X-User-ID)
  - CORS for frontend (http://localhost:5173)

### 4. **User Service** (Port 8081)
- **Purpose**: User account and profile management
- **Role**: User registration, profile updates, user lookup
- **Database**: MongoDB (user-collection)
- **Key Endpoints**:
  - User registration
  - User profile retrieval
  - User deletions
- **Dependencies**: Shares Keycloak authentication

### 5. **Activity Service** (Port 8082)
- **Purpose**: Primary service for activity tracking
- **Role**: Store, retrieve, and manage user activities
- **Database**: MongoDB (activities collection)
- **Key Features**:
  - Activity creation and validation
  - Activity history retrieval
  - User validation via HTTP call to User Service
  - Publishes activity events to Kafka
- **Data Model**:
  ```
  Activity {
    id: ObjectId
    userId: String
    type: RUNNING|CYCLING|WALKING
    duration: Number (minutes)
    calories: Number
    startTime: DateTime
    additionalMetric: {key: value}
    createdAt: DateTime
    updatedAt: DateTime
  }
  ```
- **Kafka Integration**:
  - Publishes to topic: `activity-events`
  - Non-blocking: failures don't affect activity save

### 6. **AI Service** (Port 8083)
- **Purpose**: Generate AI-powered activity recommendations
- **Role**: Process activities and provide insights
- **Integration Points**:
  - Listens to Kafka topic: `activity-events`
  - Calls Gemini API for AI analysis
  - Stores recommendations in MongoDB
- **Key Features**:
  - Analyzes activity data
  - Generates health recommendations
  - Provides safety guidelines
  - Suggests improvements
- **Data Model**:
  ```
  Recommendation {
    id: ObjectId
    activityId: String
    userId: String
    recommendation: String
    improvements: [String]
    suggestions: [String]
    safety: [String]
    createdAt: DateTime
    updatedAt: DateTime
  }
  ```
- **External APIs**: Gemini API for content generation

## Frontend Architecture

```
┌─────────────────────────────────────────────────┐
│           React Application (SPA)               │
│         react-router, Material-UI               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐       ┌──────────────┐      │
│  │   App.tsx    │       │  Router      │      │
│  │  (Main)      │───→   │  (Navigation)│      │
│  └──────────────┘       └──────────────┘      │
│         │                                      │
│    ┌────┴─────────────────────────┐           │
│    │                              │            │
│    ↓                              ↓            │
│ ┌─────────────┐         ┌──────────────────┐ │
│ │ Activities  │         │ Activity Details │ │
│ │ Page        │         │ Page             │ │
│ │ - List      │         │ - Show details   │ │
│ │ - Add new   │         │ - AI recs        │ │
│ └─────────────┘         └──────────────────┘ │
│         │                       │             │
│    ┌────┴───────────────────────┴────┐       │
│    │                                  │       │
│    ↓                                  ↓       │
│ ┌────────────────────────────────────────┐  │
│ │         Redux State Management        │  │
│ │ (authSlice - token, user, userId)     │  │
│ └────────────────────────────────────────┘  │
│             │                                │
│             ↓                                │
│ ┌────────────────────────────────────────┐  │
│ │      API Service Layer (apiFetch)      │  │
│ │  - Axios instance                      │  │
│ │  - Request interceptors                │  │
│ │  - Authorization header injection      │  │
│ └────────────────────────────────────────┘  │
│                  │                           │
└──────────────────┼───────────────────────────┘
                   ↓ HTTP + Bearer Token
            (Backend Gateway)
```

## Data Flow Examples

### Add Activity Flow
```
1. User fills form (ActivityForm.tsx)
2. User clicks "Add Activity"
3. Frontend creates ActivityRequest
4. axios.post('/activities', data)
   ├─ Interceptor adds token
   ├─ Interceptor adds user ID header
   └─ Sends to gateway:8080
5. Gateway validates token
6. Gateway routes to Activity Service:8082
7. Activity Service validates user
8. Activity Service saves to MongoDB
9. Activity Service publishes to Kafka
10. Frontend updates UI
11. User sees success message
```

### View Recommendations Flow
```
1. User views activity details
2. Frontend calls /recommendations/activity/{id}
3. Gateway routes to AI Service:8083
4. AI Service queries MongoDB in recommendations
5. Returns previously generated recommendation
6. Frontend displays to user in ActivityDetails
```

### AI Recommendation Generation Flow
```
1. Activity Service publishes to Kafka
2. AI Service consumes from Kafka topic
3. AI Service calls Gemini API with activity data
4. Gemini returns structured recommendation
5. AI Service stores in MongoDB
6. Recommendation available for users to view
```

## Technology Decisions & Rationale

### Microservices Architecture
- **Why**: Scalability, independent deployment, team autonomy
- **Trade-off**: Added complexity, network latency

### Spring Boot & Spring Cloud
- **Why**: Robust framework, built-in cloud support, large ecosystem
- **Trade-off**: Java startup time, memory overhead

### MongoDB
- **Why**: Flexible schema for varied activity data
- **Trade-off**: No ACID transactions, eventual consistency

### Kafka
- **Why**: Async processing, decouples services
- **Trade-off**: Additional infrastructure, operational complexity

### React + TypeScript
- **Why**: Type safety, large ecosystem, developer experience
- **Trade-off**: Build step required, larger bundle size

### OAuth2 + Keycloak
- **Why**: Industry standard, decentralized auth, token handling
- **Trade-off**: Additional service to manage

## Security Considerations

### Authentication
- OAuth2 with PKCE flow (best practice for SPAs)
- JWT tokens with expiration
- Refresh token support for long sessions

### Authorization
- Token validation at gateway
- User ID verification per request
- Service-to-service trust (internal network assumed)

### Data Protection
- HTTPS in production
- Sensitive data in secure config (Gemini API key)
- Token storage in localStorage (with XSS awareness)

### API Security
- CORS configured for frontend only
- Bearer token requirement
- Rate limiting can be added
- Input validation at service level

## Scalability Considerations

### Horizontal Scaling
- Services can be replicated behind load balancer
- Eureka enables dynamic service discovery
- Stateless services (except auth tokens)

### Vertical Scaling
- Service isolation allows independent scaling
- Activity Service: database indexing on userId
- AI Service: processing queue for slow requests

### Database
- MongoDB sharding for large datasets
- Indexing strategy (userId, activityId)
- Archival strategy for old data

## Deployment Architecture

### Development (Current)
- All services on localhost
- Shared development databases
- Local Keycloak instance

### Production
```
┌──────────────────────────────────┐
│  Cloud Provider (AWS/Azure/GCP)  │
│                                  │
│  ┌────────────────────────────┐ │
│  │  Load Balancer             │ │
│  │  (HTTPS termination)       │ │
│  └────────────┬───────────────┘ │
│               │                 │
│   ┌───────────┼────────────────┐│
│   │           │                ││
│   ↓           ↓                ↓│
│  ┌──┐        ┌──┐            ┌──┐
│  │GW│        │MS│            │AU││
│  └──┘        └──┘            └──┘
│               │                │
│   ┌───────────┼────────────────┘
│   │           │
│   ↓           ↓
│  ┌──────────────────────┐
│  │  Managed Databases   │
│  │  - MongoDB           │
│  │  - Redis (cache)     │
│  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │  Message Queue       │
│  │  - Kafka/RabbitMQ    │
│  └──────────────────────┘
│
│  ┌──────────────────────┐
│  │  Auth Service        │
│  │  - Managed Keycloak  │
│  └──────────────────────┘
└──────────────────────────────────┘
```

## Monitoring & Observability

### Health Checks
- Spring Boot Actuator endpoints
- Eureka health status
- Service-specific health endpoints

### Logging
- Centralized logging recommended
- Each service logs to stdout
- Gateway logs all requests

### Metrics
- Request latency
- Error rates
- Database connection pools
- Kafka consumer lag

## Future Enhancements

1. **Caching Layer**: Redis for frequently accessed data
2. **API Documentation**: Swagger/OpenAPI
3. **Testing**: Integration and unit tests
4. **CI/CD Pipeline**: GitHub Actions/Jenkins
5. **Containerization**: Docker images and Kubernetes
6. **Advanced Analytics**: Dashboard for users
7. **Multi-Language Support**: Internationalization
8. **Push Notifications**: Real-time updates
9. **Social Features**: Friend tracking, leaderboards
10. **Advanced AI**: Personalized training plans

## Troubleshooting Guide

### Service-to-Service Communication Fails
- Check Eureka registration
- Verify network connectivity
- Check load balancer configuration
- Review gateway routing rules

### Database Connection Issues
- Verify MongoDB is running
- Check connection strings in config server
- Ensure proper authentication credentials
- Monitor connection pool

### Token Validation Failures
- Ensure Keycloak is running
- Verify token not expired
- Check JWT signing keys
- Review gateway security configuration

### Kafka Processing Delays
- Check broker health
- Monitor consumer group lag
- Verify topic partitions
- Review consumer thread pool

---

**This architecture is designed to be scalable, maintainable, and production-ready.**
