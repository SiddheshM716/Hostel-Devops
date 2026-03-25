pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/hostelmate-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/hostelmate-frontend"
        KUBECONFIG = credentials('k8s-kubeconfig')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Unit Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                            sh 'npm test'
                        }
                    }
                }
                stage('Frontend E2E Tests') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run e2e' // Runs Cypress
                    }
                }
            }
        }
        
        stage('Build & Push Docker Images') {
            steps {
                script {
                    docker.build("${BACKEND_IMAGE}:${env.BUILD_ID}", "./backend").push()
                    docker.build("${BACKEND_IMAGE}:latest", "./backend").push()
                    
                    docker.build("${FRONTEND_IMAGE}:${env.BUILD_ID}", ".").push()
                    docker.build("${FRONTEND_IMAGE}:latest", ".").push()
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                // Apply configurations and stateful components first
                sh 'kubectl apply -f k8s/config.yaml'
                sh 'kubectl apply -f k8s/postgres.yaml'
                
                // Inject the dynamic build tags into the deployments natively
                sh "sed -i 's|your-registry/hostelmate-backend:latest|${BACKEND_IMAGE}:${env.BUILD_ID}|g' k8s/backend.yaml"
                sh "sed -i 's|your-registry/hostelmate-frontend:latest|${FRONTEND_IMAGE}:${env.BUILD_ID}|g' k8s/frontend.yaml"
                
                sh 'kubectl apply -f k8s/backend.yaml'
                sh 'kubectl apply -f k8s/frontend.yaml'
            }
        }
    }
}
