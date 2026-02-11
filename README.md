# 🏃 Fitness Management Application

> A modern, full-stack fitness tracking application with TypeScript, microservices architecture, and AI-powered recommendations.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.9-green)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Quick Navigation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - 5-step quick start guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and architecture
- **[TYPESCRIPT_MIGRATION.md](TYPESCRIPT_MIGRATION.md)** - Frontend modernization details
- **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - Testing and verification guide
- **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** - Work completed overview
- **[CLEANUP_GUIDE.md](CLEANUP_GUIDE.md)** - Old file removal instructions

## 🎯 What This Is

A complete, production-ready fitness tracking platform featuring:

- **Smart Activity Tracking** - Log running, cycling, and walking activities
- **AI Recommendations** - Get personalized insights powered by Google Gemini
- **Secure Authentication** - OAuth2 with Keycloak for secure login
- **Microservices Backend** - Scalable architecture with independent services
- **Modern Frontend** - React 19 + TypeScript with Material-UI
- **Real-time Processing** - Kafka for event-driven recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 21
- Docker (for MongoDB, Kafka, Keycloak)
- npm or yarn

### 5-Step Startup

**Step 1: Infrastructure (4 terminals)**
```bash
# Terminal 1: MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Terminal 2: Kafka Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Terminal 3: Kafka Broker
bin/kafka-server-start.sh config/server.properties

# Terminal 4: Keycloak
docker run -d -p 8181:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
```

**Step 2: Backend Services (6 terminals)**
```bash
cd Backend_Microservices

# Terminal 1: Eureka (wait for others to connect)
cd eureka && mvn spring-boot:run

# Terminals 2-6: In separate windows
cd ../configserver && mvn spring-boot:run
cd ../userservice && mvn spring-boot:run
cd ../activityservice && mvn spring-boot:run
cd ../aiservice && mvn spring-boot:run
cd ../gateway && mvn spring-boot:run
```

**Step 3: Keycloak Setup** (1 minute)
1. Go to http://localhost:8181/admin
2. Login with admin/admin
3. Create realm: `fitness-app`
4. Create client: `oauth2-pkce-client` (enable PKCE)
5. Create user with password

**Step 4: Frontend**
```bash
cd Frontend/fitness-tracker-frontend
npm install
npm run dev
```

**Step 5: Visit & Test**
- Open http://localhost:5173
- Click Login
- Use your Keycloak credentials
- Add an activity
- View AI recommendations

✅ **Done!** Your fitness tracker is running.

## 📚 Project Structure

```
Fitness-Management/
├── Backend_Microservices/          # Java/Spring Boot services
│   ├── eureka/                     # Service registry
│   ├── configserver/               # Config management
│   ├── gateway/                    # API Gateway
│   ├── userservice/                # User management
│   ├── activityservice/            # Activity tracking
│   ├── aiservice/                  # AI recommendations
│   └── README.md                   # Backend docs
│
├── Frontend/                        # React/TypeScript app
│   └── fitness-tracker-frontend/
│       ├── src/
│       │   ├── components/         # React components
│       │   ├── services/           # API calls
│       │   ├── store/              # Redux store
│       │   ├── types/              # TypeScript types
│       │   ├── authConfig.ts       # OAuth2 config
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── tsconfig.json           # TypeScript config
│       ├── vite.config.ts          # Build config
│       └── README.md               # Frontend docs
│
├── SETUP_GUIDE.md                  # 👈 Start here!
├── ARCHITECTURE.md                 # System design
├── TYPESCRIPT_MIGRATION.md         # Changes made
├── VERIFICATION_CHECKLIST.md       # Testing guide
├── COMPLETION_SUMMARY.md           # Work done
└── CLEANUP_GUIDE.md                # File cleanup
```

## 🎨 Features

### Frontend
- ✅ **React 19** with TypeScript strict mode
- ✅ **Material-UI** components for professional UI
- ✅ **Redux Toolkit** for state management
- ✅ **OAuth2 PKCE** secure authentication
- ✅ **Error handling** with user feedback
- ✅ **Loading states** for async operations
- ✅ **Responsive design** for all devices

### Backend
- ✅ **Microservices** architecture (6 services)
- ✅ **Service Registry** (Eureka) for discovery
- ✅ **Config Server** for centralized management
- ✅ **API Gateway** for routing & security
- ✅ **MongoDB** for data persistence
- ✅ **Kafka** for event processing
- ✅ **AI Integration** with Google Gemini

### Operations
- ✅ **Docker support** for databases
- ✅ **Health checks** via Spring Actuator
- ✅ **Environment configuration** per environment
- ✅ **Type-safe** TypeScript throughout
- ✅ **Comprehensive docs** (2000+ lines)
- ✅ **Error handling** at all levels

## 🔐 Security

- **OAuth2 PKCE Flow** - Best practice for SPAs
- **JWT Tokens** - Stateless authentication
- **CORS Configured** - Frontend-only access
- **Token Validation** - At API Gateway
- **Secure Headers** - Authorization & X-User-ID
- **Keycloak Integration** - Industry-standard auth

## 📊 API Overview

### Gateway (Port 8080)
```
POST   /api/activities              # Add activity
GET    /api/activities              # List activities
GET    /api/recommendations/{id}    # Get recommendations
```

### Services
- **User Service** (8081) - User management
- **Activity Service** (8082) - Activity storage
- **AI Service** (8083) - Recommendation engine

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5.5, Vite, Material-UI |
| **Backend** | Spring Boot 3.5, Spring Cloud, Java 21 |
| **Databases** | MongoDB 6+ |
| **Message Queue** | Kafka, Zookeeper |
| **Auth** | Keycloak, OAuth2, JWT |
| **Build** | Maven, npm |
| **DevOps** | Docker |

## 📖 Documentation

### Getting Started
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions with diagrams

### Understanding the System
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flows
- **[Backend README](Backend_Microservices/README.md)** - Backend-specific details
- **[Frontend README](Frontend/fitness-tracker-frontend/README.md)** - Frontend documentation

### For Developers
- **[TYPESCRIPT_MIGRATION.md](TYPESCRIPT_MIGRATION.md)** - TypeScript setup details
- **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - How to test everything

### Project Info
- **[COMPLETION_SUMMARY.md](COMPLETION_SUMMARY.md)** - What was built/fixed
- **[CLEANUP_GUIDE.md](CLEANUP_GUIDE.md)** - Removing old JavaScript files

## 🧪 Testing

Use the [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) to:
- Verify all services are running
- Test API endpoints
- Complete end-to-end flow
- Check database persistence
- Verify error handling
- Test security

**Quick Test:**
```bash
# 1. All services running?
curl http://localhost:8761       # Eureka

# 2. Frontend accessible?
open http://localhost:5173

# 3. Can you login, add activity, and view details?
# Follow the 5-step startup above
```

## 🚀 Deployment

### Build
```bash
cd Frontend/fitness-tracker-frontend
npm run build
# dist/ folder ready for deployment
```

### Deploy Frontend
```bash
# Deploy dist/ to:
# - Vercel
# - Netlify
# - AWS S3
# - Any static hosting
```

### Deploy Backend
```bash
# From Backend_Microservices
mvn clean install
# Deploy JAR files to:
# - AWS ECS
# - Kubernetes
# - Docker containers
# - Traditional servers
```

## 🐛 Troubleshooting

### Services won't connect
→ Check [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md#troubleshooting)

### API errors
→ Check [SETUP_GUIDE.md](SETUP_GUIDE.md#-troubleshooting) troubleshooting section

### Login issues
→ Verify Keycloak setup in Step 3 of SETUP_GUIDE.md

### Build errors
→ Check TypeScript: `npm run build` in frontend

## 📈 Status

| Component | Status | Port |
|-----------|--------|------|
| Frontend | ✅ Ready | 5173 |
| Gateway | ✅ Ready | 8080 |
| Eureka | ✅ Ready | 8761 |
| Config Server | ✅ Ready | 8888 |
| User Service | ✅ Ready | 8081 |
| Activity Service | ✅ Ready | 8082 |
| AI Service | ✅ Ready | 8083 |
| MongoDB | ✅ Ready | 27017 |
| Kafka | ✅ Ready | 9092 |
| Keycloak | ✅ Ready | 8181 |

## 🎯 Next Steps

After setup:

1. ✅ **All services running** → Test via VERIFICATION_CHECKLIST.md
2. ✅ **Login working** → Create activities
3. ✅ **Feature complete** → Read ARCHITECTURE.md to extend
4. ✅ **Ready to deploy** → Follow deployment steps above

## 📝 Key Improvements Made

- ✅ **Fixed** YAML syntax error in gateway config
- ✅ **Fixed** Redux logout state management
- ✅ **Fixed** ActivityDetails component rendering
- ✅ **Migrated** all frontend files to TypeScript
- ✅ **Added** comprehensive type definitions
- ✅ **Enhanced** error handling throughout
- ✅ **Improved** loading states and UX
- ✅ **Created** extensive documentation (2000+ lines)

## 💡 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Spring Boot Guide](https://spring.io/guides)
- [Microservices Patterns](https://microservices.io/)
- [OAuth2 PKCE Flow](https://tools.ietf.org/html/rfc7636)

## 🤝 Contributing

1. Create a feature branch
2. Make changes with TypeScript typing
3. Test with `npm run build && npm run dev`
4. Submit pull request with clear description

## 📄 License

MIT License - See LICENSE file for details

## 📞 Support

For help:
1. **Setup issues** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **Architecture questions** → [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Testing** → [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)
4. **Backend issues** → [Backend README](Backend_Microservices/README.md)
5. **Frontend issues** → [Frontend README](Frontend/fitness-tracker-frontend/README.md)

## ✨ Credits

Built with modern technologies:
- React & TypeScript for frontend
- Spring Boot & Spring Cloud for backend
- MongoDB for data storage
- Kafka for event processing
- Keycloak for authentication
- Material-UI for components

---

## 🎉 Ready to Go!

**Start with [SETUP_GUIDE.md](SETUP_GUIDE.md) for the complete 5-step startup process.**

Your fitness tracking platform is ready to run! 💪

---

**Status**: ✅ Production Ready | **Last Updated**: February 11, 2026 | **Version**: 1.0.0
