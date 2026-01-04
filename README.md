# ☁️ Cloud-Native Image Upload Platform

<div align="center">

![Architecture](https://img.shields.io/badge/Architecture-Cloud--Native-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-green)
![Docker](https://img.shields.io/badge/Container-Docker-blue)
![AWS](https://img.shields.io/badge/Cloud-AWS%20S3-orange)
![Node.js](https://img.shields.io/badge/Backend-Node.js-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-61dafb)

**A production-ready, full-stack image upload platform demonstrating modern Cloud, DevOps, and CI/CD best practices.**

[Features](#-features) • [Architecture](#️-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#️-architecture)
- [Tech Stack](#️-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Local Development](#-local-development)
- [Docker Usage](#-docker-usage)
- [CI/CD Pipeline](#-cicd-pipeline)
- [API Documentation](#-api-documentation)
- [Configuration](#️-configuration)
- [Security](#-security)
- [AWS Free Tier](#-aws-free-tier)
- [Troubleshooting](#-troubleshooting)
- [Production Deployment](#-production-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This platform enables users to upload images through a responsive web interface, store them securely in AWS S3, and view them in a dynamic gallery. The project showcases professional-grade cloud architecture and DevOps practices suitable for demonstrating skills to potential employers.

<img width="1414" height="887" alt="Screenshot 2026-01-05 at 3 31 21 AM" src="https://github.com/user-attachments/assets/c3b2dfea-e143-4d11-9b37-35cbc82b54d9" />

**Perfect for:**
- Cloud Engineering portfolios
- DevOps demonstrations
- Full-stack development showcases
- Learning modern deployment practices

---

## ✨ Features

### Core Functionality
- 📤 **Image Upload** - Drag-and-drop or click-to-upload interface
- 🖼️ **Gallery View** - Responsive grid display of uploaded images
- ☁️ **Cloud Storage** - Secure storage in AWS S3
- 🔄 **Real-time Updates** - Automatic gallery refresh after upload

### Technical Features
- 🐳 **Containerized** - Fully Dockerized microservices
- 🔄 **CI/CD** - Automated testing and deployment pipeline
- 🏥 **Health Checks** - Container and service monitoring
- 📊 **Logging** - Structured logging for debugging
- 🔒 **Security** - Input validation, file type checking, size limits
- 🚀 **Production-Ready** - Multi-stage builds, optimized images
- 📱 **Responsive** - Mobile-friendly user interface

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions CI/CD                     │
│  Build → Test → Security Scan → Integration → Deploy        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Docker Container Registry                 │
│            (GitHub Container Registry / Docker Hub)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────┐         ┌──────────────────┐         ┌───────────────┐
│   React SPA      │  REST   │   Node.js API    │  AWS    │   AWS S3      │
│   (Nginx)        │ ──────→ │   (Express)      │  SDK    │   Bucket      │
│   Port 80        │  HTTP   │   Port 5000      │ ──────→ │   Storage     │
└──────────────────┘         └──────────────────┘         └───────────────┘
        │                             │                            │
        └─────────────────────────────┴────────────────────────────┘
                    Docker Network (app-network)
```

### Component Details

#### **Frontend Container**
- **Framework**: React 18
- **Server**: Nginx (Alpine)
- **Build**: Multi-stage Docker build
- **Features**: Optimized static assets, gzip compression, routing support

#### **Backend Container**
- **Runtime**: Node.js 18 (Alpine)
- **Framework**: Express.js
- **Middleware**: Multer (file uploads), CORS, body-parser
- **Features**: Health checks, error handling, logging

#### **Cloud Infrastructure**
- **Storage**: AWS S3 bucket
- **Access**: IAM user with programmatic access
- **Configuration**: Environment-based credentials

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Axios | HTTP client |
| CSS3 | Styling with gradients and animations |
| Nginx | Production web server |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18 | JavaScript runtime |
| Express.js | Web application framework |
| Multer | Multipart/form-data handling |
| AWS SDK | S3 integration |
| UUID | Unique filename generation |

### DevOps & Cloud
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |
| GitHub Actions | CI/CD automation |
| AWS S3 | Object storage |
| AWS IAM | Access management |

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **[Node.js 18+](https://nodejs.org/)** - JavaScript runtime
- **[Docker 20+](https://www.docker.com/get-started)** - Containerization platform
- **[Docker Compose 2+](https://docs.docker.com/compose/install/)** - Multi-container tool
- **[Git](https://git-scm.com/)** - Version control
- **[AWS Account](https://aws.amazon.com/free/)** - Cloud services (Free Tier eligible)

**Optional but recommended:**
- **[AWS CLI](https://aws.amazon.com/cli/)** - AWS command line interface
- **[Postman](https://www.postman.com/)** - API testing tool

---

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/Cloud-DevOps-Image-Platform.git
cd Cloud-DevOps-Image-Platform
```

### Step 2: AWS S3 Configuration

#### Create S3 Bucket

**Using AWS Console:**
1. Go to [S3 Console](https://console.aws.amazon.com/s3/)
2. Click "Create bucket"
3. Enter unique bucket name (e.g., `my-image-platform-bucket-2026`)
4. Select region: `us-east-1`
5. Uncheck "Block all public access" (we need public read for images)
6. Click "Create bucket"

**Using AWS CLI:**
```bash
aws s3 mb s3://your-unique-bucket-name --region us-east-1
```

#### Configure Bucket Policy

Add this policy to allow public read access:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-unique-bucket-name/*"
    }
  ]
}
```

**Apply via Console:**
1. Go to bucket → Permissions → Bucket Policy
2. Paste the JSON above (replace bucket name)
3. Save changes

**Apply via AWS CLI:**
```bash
aws s3api put-bucket-policy --bucket your-unique-bucket-name --policy file://bucket-policy.json
```

#### Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Users → Add users
3. Username: `image-platform-uploader`
4. Access type: **Programmatic access**
5. Attach policy: `AmazonS3FullAccess` (or custom policy below)
6. Create user and **save credentials**

**Custom IAM Policy (Recommended):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-unique-bucket-name",
        "arn:aws:s3:::your-unique-bucket-name/*"
      ]
    }
  ]
}
```

### Step 3: Environment Configuration

Create `.env` file in the project root:
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

**.env file contents:**
```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-unique-bucket-name
```

⚠️ **Security Warning**: Never commit `.env` to Git!

### Step 4: Launch Application
```bash
# Build and start all services
docker-compose up -d --build

# View logs (optional)
docker-compose logs -f

# Check service status
docker-compose ps
```

### Step 5: Access Application

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/

**Health Checks:**
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health
```

---

## 💻 Local Development

If you prefer to run services without Docker:

### Backend Development
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your AWS credentials

# Run in development mode (with auto-reload)
npm run dev

# Or run in production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Development
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add: REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

---

## 🐳 Docker Usage

### Essential Commands
```bash
# Build all images
docker-compose build

# Start services in detached mode
docker-compose up -d

# Start services with logs
docker-compose up

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# List running containers
docker-compose ps

# Restart specific service
docker-compose restart backend

# Scale services (if configured)
docker-compose up -d --scale backend=3
```

### Individual Container Commands
```bash
# Build backend image
docker build -t image-platform-backend ./backend

# Build frontend image
docker build -t image-platform-frontend ./frontend

# Run backend container standalone
docker run -d -p 5000:5000 \
  -e AWS_ACCESS_KEY_ID=your_key \
  -e AWS_SECRET_ACCESS_KEY=your_secret \
  -e S3_BUCKET_NAME=your_bucket \
  image-platform-backend

# Run frontend container standalone
docker run -d -p 3000:80 image-platform-frontend
```

### Troubleshooting Commands
```bash
# View container resource usage
docker stats

# Inspect container
docker inspect image-platform-backend

# Check container health
docker inspect --format='{{.State.Health.Status}}' image-platform-backend

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Full cleanup (use with caution!)
docker system prune -a --volumes
```

---

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically runs on every push and pull request.

### Pipeline Stages
```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE FLOW                       │
└─────────────────────────────────────────────────────────────┘

1️⃣ BUILD & TEST (Parallel)
   ├── Backend Build & Test
   │   ├── Install dependencies
   │   ├── Run unit tests
   │   ├── Build Docker image
   │   └── Test Docker container
   │
   └── Frontend Build & Test
       ├── Install dependencies
       ├── Run unit tests
       ├── Build production bundle
       └── Test Docker container

2️⃣ SECURITY SCAN
   ├── Trivy vulnerability scan (Backend)
   ├── Trivy vulnerability scan (Frontend)
   └── Upload results to GitHub Security

3️⃣ CODE QUALITY
   ├── Dependency audit
   └── Code linting (if configured)

4️⃣ INTEGRATION TEST
   ├── Start all services with Docker Compose
   ├── Wait for health checks
   ├── Test API endpoints
   └── Validate frontend

5️⃣ PUBLISH (main branch only)
   ├── Build optimized images
   ├── Tag with commit SHA
   ├── Push to GitHub Container Registry
   └── Tag as 'latest'

6️⃣ DEPLOY (main branch only)
   ├── Prepare deployment configuration
   ├── Deploy to target environment
   └── Send notifications

7️⃣ NOTIFY
   └── Success/failure notifications
```

### Viewing Pipeline Results

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select a workflow run
4. View detailed logs for each job

### Pipeline Configuration

The pipeline is defined in `.github/workflows/ci-cd.yml` and includes:

- **Automated testing** on every commit
- **Security vulnerability scanning** with Trivy
- **Docker image building** and publishing
- **Integration testing** with Docker Compose
- **Deployment automation** (configurable)

### Enabling Real Deployment

To deploy to a real environment, add secrets to GitHub:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add required secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `EC2_HOST` (if deploying to EC2)
   - `EC2_SSH_KEY` (if deploying to EC2)

3. Uncomment deployment steps in `.github/workflows/ci-cd.yml`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-05T10:30:00.000Z",
  "service": "image-platform-backend"
}
```

#### 2. Root Information
```http
GET /
```

**Response:**
```json
{
  "message": "Cloud Image Platform API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "upload": "POST /api/upload",
    "images": "GET /api/images"
  }
}
```
#### 3. Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/image.jpg"
```

**Response (Success - 200):**
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/images/uuid-12345.jpg",
  "key": "images/uuid-12345.jpg",
  "bucket": "your-bucket-name"
}
```

**Response (Error - 400):**
```json
{
  "error": "No image file provided"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to upload to S3: [error details]"
}
```

**Constraints:**
- File size: Max 5MB
- File type: Images only (image/*)
- Field name: `image`

#### 4. List Images
```http
GET /api/images
```

**Response:**
```json
{
  "count": 3,
  "images": [
    {
      "key": "images/uuid-12345.jpg",
      "url": "https://your-bucket.s3.us-east-1.amazonaws.com/images/uuid-12345.jpg",
      "size": 245678,
      "lastModified": "2026-01-05T10:00:00.000Z"
    },
    {
      "key": "images/uuid-67890.png",
      "url": "https://your-bucket.s3.us-east-1.amazonaws.com/images/uuid-67890.png",
      "size": 189234,
      "lastModified": "2026-01-04T15:30:00.000Z"
    }
  ]
}
```

### Error Handling

All errors follow this format:
```json
{
  "error": "Error message description",
  "timestamp": "2026-01-05T10:30:00.000Z"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found
- `500` - Internal Server Error

---

## ⚙️ Configuration

### Environment Variables

#### Backend (`backend/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Backend server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes | - |
| `AWS_REGION` | AWS region | No | `us-east-1` |
| `S3_BUCKET_NAME` | S3 bucket name | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | `http://localhost:3000` |

#### Frontend (`frontend/.env`)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | Backend API URL | No | `http://localhost:5000` |

### Docker Compose Configuration

The `docker-compose.yml` supports environment variable substitution:
```yaml
environment:
  - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
  - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
```

Variables are loaded from `.env` file in the project root.

---

## 🔒 Security

### Implemented Security Measures

✅ **Environment Variables** - No hardcoded credentials  
✅ **File Validation** - Type and size checking  
✅ **CORS Configuration** - Restricted origins  
✅ **Input Sanitization** - Prevents injection attacks  
✅ **Unique Filenames** - UUID prevents collisions  
✅ **Security Headers** - X-Frame-Options, X-Content-Type-Options  
✅ **Container Isolation** - Separate networks and minimal privileges  
✅ **Health Checks** - Automated service monitoring  

### Production Security Recommendations

⚠️ **Additional measures for production:**

1. **Authentication & Authorization**
   - Implement JWT or OAuth2
   - Add user registration/login
   - Restrict upload endpoints

2. **AWS Security**
   - Use IAM roles instead of access keys
   - Enable S3 bucket versioning
   - Configure S3 lifecycle policies
   - Enable CloudTrail logging

3. **Application Security**
   - Add rate limiting (e.g., express-rate-limit)
   - Implement CSRF protection
   - Use HTTPS/TLS certificates
   - Add image malware scanning

4. **Infrastructure Security**
   - Run containers as non-root user
   - Scan images for vulnerabilities
   - Use secrets management (AWS Secrets Manager)
   - Implement network policies

5. **Monitoring & Logging**
   - Set up CloudWatch alarms
   - Implement structured logging
   - Add error tracking (Sentry, Rollbar)
   - Monitor resource usage

### Secure Deployment Checklist

- [ ] Environment variables properly configured
- [ ] `.env` file in `.gitignore`
- [ ] S3 bucket policy reviewed
- [ ] IAM user has minimum required permissions
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Container images scanned for vulnerabilities

---

## 💰 AWS Free Tier

This project is designed to stay within AWS Free Tier limits.

### S3 Free Tier Limits (First 12 Months)

| Resource | Free Tier Limit | Estimated Usage |
|----------|----------------|-----------------|
| Storage | 5 GB | ~1000 images (5MB each) |
| PUT Requests | 2,000 requests/month | ~2000 uploads/month |
| GET Requests | 20,000 requests/month | ~20000 views/month |
| Data Transfer Out | 15 GB/month | Sufficient for moderate use |

### Cost Optimization Tips

1. **Set Object Expiration**
```bash
   aws s3api put-bucket-lifecycle-configuration \
     --bucket your-bucket-name \
     --lifecycle-configuration file://lifecycle.json
```

   **lifecycle.json:**
```json
   {
     "Rules": [{
       "Id": "Delete old images",
       "Status": "Enabled",
       "Prefix": "images/",
       "Expiration": { "Days": 30 }
     }]
   }
```

2. **Monitor Usage**
   - Enable AWS Billing Alerts
   - Set up CloudWatch metrics
   - Review AWS Cost Explorer monthly

3. **Implement Compression**
   - Compress images before upload
   - Use WebP format for better compression

4. **Set Size Limits**
   - Current limit: 5MB per image
   - Adjust based on needs

### Avoiding Unexpected Charges

⚠️ **Important:**
- Delete S3 bucket when done testing
- Monitor billing dashboard regularly
- Set up budget alerts in AWS Console
- Stop all EC2 instances if used

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Can't Connect to S3

**Symptoms:**
Error: Failed to upload to S3: The security token included in the request is invalid


**Solutions:**
- ✅ Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env`
- ✅ Check IAM user has S3 permissions
- ✅ Ensure AWS region matches bucket region
- ✅ Verify bucket name is correct

**Test AWS credentials:**
```bash
aws s3 ls s3://your-bucket-name --region us-east-1
```

#### 2. Frontend Can't Reach Backend

**Symptoms:**
Network Error / CORS policy blocked


**Solutions:**
- ✅ Check `REACT_APP_API_URL` in `frontend/.env`
- ✅ Verify backend is running: `curl http://localhost:5000/health`
- ✅ Check CORS configuration in `backend/src/server.js`
- ✅ Ensure both containers are on same Docker network

**Debug:**
```bash
# Check if backend is accessible
curl http://localhost:5000/health

# Check Docker networks
docker network ls
docker network inspect image-platform-network
```

#### 3. Images Not Displaying

**Symptoms:**
- Images upload successfully but don't show in gallery
- 403 Forbidden errors in browser console

**Solutions:**
- ✅ Verify S3 bucket policy allows public read
- ✅ Check bucket CORS configuration
- ✅ Ensure image URLs are accessible in browser
- ✅ Verify S3 bucket name in environment variables

**Test image access:**
```bash
# Get image URL from upload response
curl -I https://your-bucket.s3.us-east-1.amazonaws.com/images/uuid-12345.jpg
```

#### 4. Docker Build Fails

**Symptoms:**
ERROR: failed to solve: process "/bin/sh -c npm ci" did not complete


**Solutions:**
- ✅ Clear Docker cache: `docker system prune -a`
- ✅ Check `package.json` syntax
- ✅ Verify Node.js version compatibility
- ✅ Ensure all dependencies are available

**Rebuild from scratch:**
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

#### 5. Health Checks Failing

**Symptoms:**
Container marked as unhealthy


**Solutions:**
- ✅ Check container logs: `docker-compose logs backend`
- ✅ Verify health check endpoint works
- ✅ Increase health check timeout in `docker-compose.yml`
- ✅ Ensure container has enough resources

**Debug health checks:**
```bash
# Test health endpoint directly
docker-compose exec backend curl http://localhost:5000/health

# View health check logs
docker inspect --format='{{json .State.Health}}' image-platform-backend | jq
```

#### 6. Port Already in Use

**Symptoms:**
Error: bind: address already in use


**Solutions:**
- ✅ Stop conflicting process
- ✅ Change port in `docker-compose.yml`
- ✅ Use different port mapping

**Find process using port:**
```bash
# On Linux/Mac
lsof -i :5000
lsof -i :3000

# On Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Getting Help

If you're still experiencing issues:

1. **Check Logs**
```bash
   docker-compose logs --tail=100
```

2. **Review GitHub Issues**
   - Search for similar problems
   - Open new issue with logs

3. **Test Individual Components**
   - Run backend standalone
   - Run frontend standalone
   - Test AWS connectivity

4. **Contact Support**
   - Email: your.email@example.com
   - GitHub: [@yourusername](https://github.com/yourusername)

---

## 🚀 Production Deployment

### Deployment Options

#### Option 1: AWS EC2 with Docker Compose

**Steps:**
1. Launch EC2 instance (t2.micro for Free Tier)
2. Install Docker and Docker Compose
3. Clone repository
4. Configure environment variables
5. Run `docker-compose up -d`

**Script:**
```bash
#!/bin/bash
# EC2 User Data Script

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and run
cd /home/ec2-user
git clone https://github.com/yourusername/Cloud-DevOps-Image-Platform.git
cd Cloud-DevOps-Image-Platform

# Set environment variables
cat > .env << EOF
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket
EOF

# Start services
docker-compose up -d
```

#### Option 2: AWS ECS (Elastic Container Service)

**Steps:**
1. Push images to ECR (Elastic Container Registry)
2. Create ECS cluster
3. Define task definitions
4. Create services
5. Configure load balancer

**Sample ECS Task Definition:**
```json
{
  "family": "image-platform",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.us-east-1.amazonaws.com/backend:latest",
      "portMappings": [{
        "containerPort": 5000,
        "protocol": "tcp"
      }],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "S3_BUCKET_NAME", "value": "your-bucket"}
      ],
      "secrets": [
        {"name": "AWS_ACCESS_KEY_ID", "valueFrom": "arn:aws:secretsmanager:..."},
        {"name": "AWS_SECRET_ACCESS_KEY", "valueFrom": "arn:aws:secretsmanager:..."}
      ]
    }
  ]
}
```

#### Option 3: Kubernetes (AWS EKS)

**Deployment Manifest:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: image-platform-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/backend:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        envFrom:
        - secretRef:
            name: aws-credentials
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 5000
  selector:
    app: backend
```

### Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] S3 bucket created and configured
- [ ] IAM roles/users set up
- [ ] Domain name registered (if applicable)
- [ ] SSL/TLS certificates obtained
- [ ] Security groups configured
- [ ] Monitoring and logging set up
- [ ] Backup strategy defined
- [ ] CI/CD pipeline tested
- [ ] Documentation updated

---

## 🧪 Testing

### Manual Testing

**1. Upload Test:**
```bash
# Upload an image
curl -X POST http://localhost:5000/api/upload \
  -F "image=@test-image.jpg"
```

**2. List Images Test:**
```bash
# Get all images
curl http://localhost:5000/api/images
```

**3. Health Check Test:**
```bash
# Backend health
curl http://localhost:5000/health

# Frontend health
curl http://localhost:3000/health
```

### Automated Testing

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

**Integration Tests:**
```bash
# Run full integration test
docker-compose up -d
./scripts/integration-test.sh
docker-compose down
```

### Load Testing

**Using Apache Bench:**
```bash
# Test upload endpoint
ab -n 100 -c 10 -p test-image.jpg -T multipart/form-data \
  http://localhost:5000/api/upload
```

**Using k6:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.get('http://localhost:5000/api/images');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
```bash
   git clone https://github.com/yourusername/Cloud-DevOps-Image-Platform.git
```
3. **Create a branch**
```bash
   git checkout -b feature/amazing-feature
```
4. **Make your changes**
5. **Test thoroughly**
```bash
   docker-compose up -d --build
   # Run tests
   # Verify functionality
```
6. **Commit your changes**
```bash
   git commit -m 'Add amazing feature'
```
7. **Push to your fork**
```bash
   git push origin feature/amazing-feature
```
8. **Open a Pull Request**

### Contribution Guidelines

- Write clear, descriptive commit messages
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Ensure all tests pass
- Keep pull requests focused on a single feature/fix

### Code Style

- **JavaScript**: Use ES6+ features
- **Indentation**: 2 spaces
- **Semicolons**: Optional but consistent
- **Comments**: Clear and descriptive

---

## 📄 License

This project is licensed under the **MIT License**.
MIT License

Copyright (c) 2026 [ALVEERA AHMAD]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

## 📞 Contact & Support

### Project Maintainer

**Your Name**
- GitHub: [@alveerraa](https://github.com/alveerraa)
- Email: alveerraaa@gmail.com

### Getting Help

- 📖 [Documentation](#-documentation)
- 🐛 [Report Issues](https://github.com/alveerraa/Cloud-DevOps-Image-Platform/issues)
- 💬 [Discussions](https://github.com/alveerraa/Cloud-DevOps-Image-Platform/discussions)
- ⭐ [Star this repo](https://github.com/alveerraa/Cloud-DevOps-Image-Platform)

---

## 🙏 Acknowledgments

- **AWS** - Cloud infrastructure
- **Docker** - Containerization platform
- **React** - Frontend framework
- **Node.js** - Backend runtime
- **GitHub Actions** - CI/CD automation
- **Open Source Community** - Inspiration and tools

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/alveerraa/Cloud-DevOps-Image-Platform?style=social)
![GitHub Forks](https://img.shields.io/github/forks/alveerraa/Cloud-DevOps-Image-Platform?style=social)
![GitHub Issues](https://img.shields.io/github/issues/alveerraa/Cloud-DevOps-Image-Platform)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/alveerraa/Cloud-DevOps-Image-Platform)

---

<p align="center">
  <strong>Made with ☁️ and ❤️ for Cloud & DevOps enthusiasts</strong>
  <br>
  <sub>Built to demonstrate production-ready cloud architecture</sub>
</p>

<p align="center">
  <a href="#-overview">Back to Top ↑</a>
</p>
