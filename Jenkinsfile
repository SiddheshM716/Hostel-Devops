pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'siddheshm716'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/hostelmate-backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/hostelmate-frontend"
    }
    
    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm test -- --maxWorkers=2'
                }
            }
        }

        stage('Frontend Tests (LIGHT)') {
            steps {
                sh 'npm ci'
                sh 'npx cypress run --headless --browser chrome'
            }
        }

        stage('Build Docker (Sequential)') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    passwordVariable: 'DOCKER_PASS',
                    usernameVariable: 'DOCKER_USER'
                )]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"

                    sh "docker build -t ${BACKEND_IMAGE}:latest ./backend"
                    sh "docker push ${BACKEND_IMAGE}:latest"

                    sh "docker build -t ${FRONTEND_IMAGE}:latest ."
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['k8s-master-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@98.130.121.75 "
                            kubectl rollout restart deployment/backend &&
                            kubectl rollout restart deployment/frontend
                        "
                    """
                }
            }
        }
    }
}
