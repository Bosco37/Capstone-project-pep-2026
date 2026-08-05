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
                // Install docker and docker-compose if missing inside jenkins container
                sh 'apt-get update && apt-get install -y docker.io docker-compose || true'
                sh 'docker-compose build'
            }
        }
        
        stage('Deploy/Run Application') {
            steps {
                echo 'Deploying to Docker containers...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }
    }
}
