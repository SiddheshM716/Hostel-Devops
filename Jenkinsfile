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
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"

                    sh "docker build -t ${BACKEND_IMAGE}:${env.BUILD_ID} -t ${BACKEND_IMAGE}:latest ./backend"
                    sh "docker push ${BACKEND_IMAGE}:${env.BUILD_ID}"
                    sh "docker push ${BACKEND_IMAGE}:latest"

                    sh "docker build -t ${FRONTEND_IMAGE}:${env.BUILD_ID} -t ${FRONTEND_IMAGE}:latest ."
                    sh "docker push ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'k8s-master-ssh',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ubuntu@98.130.121.75 '
                            kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${env.BUILD_ID} &&
                            kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${env.BUILD_ID} &&
                            kubectl rollout status deployment/backend &&
                            kubectl rollout status deployment/frontend
                        '
                    """
                }
            }
        }
    }
}
