pipeline {
    agent any
    
    environment {
        // You can change your name here if needed
        DOCKER_IMAGE_NAME = "bosco-capstone-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo 'Building Frontend and Backend Images...'
                sh 'docker compose build'
            }
        }
        
        stage('Deploy/Run Application') {
            steps {
                echo 'Deploying to Docker containers...'
                // Stop and remove old containers, then start new ones in detached mode
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }
}
