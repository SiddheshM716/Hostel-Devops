pipeline {
    agent any
    
    environment {
        PATH = "/opt/homebrew/bin:/usr/local/bin:/Users/siddheshm/.docker/bin:${env.PATH}"
        DOCKER_REGISTRY = 'siddheshm716'
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
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    passwordVariable: 'DOCKER_PASS',
                    usernameVariable: 'DOCKER_USER'
                )]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"

                    script {
                        docker.build("${BACKEND_IMAGE}:${env.BUILD_ID}", "./backend").push()
                        docker.build("${BACKEND_IMAGE}:latest", "./backend").push()
                
                        docker.build("${FRONTEND_IMAGE}:${env.BUILD_ID}", ".").push()
                        docker.build("${FRONTEND_IMAGE}:latest", ".").push()
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'k8s-kubeconfig', variable: 'KUBECONFIG')]) {

                    sh 'kubectl apply -f k8s/config.yaml'
                    sh 'kubectl apply -f k8s/postgres.yaml'

                    sh "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${env.BUILD_ID}"
                    sh "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${env.BUILD_ID}"
                }
            }
        }
    }
}
