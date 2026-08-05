pipeline {
    agent any

    stages {
        stage('Setup Docker CLI') {
            steps {
                echo 'Installing lightweight Docker CLI...'
                sh '''
                if ! command -v docker &> /dev/null; then
                    curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-24.0.9.tgz
                    tar xzvf docker-24.0.9.tgz
                    mv docker/docker /usr/bin/
                    rm -rf docker docker-24.0.9.tgz
                fi
                '''
            }
        }
        
        stage('Build and Deploy') {
            steps {
                echo 'Building and Deploying Containers...'
                sh 'docker rm -f bosco-backend bosco-frontend || true'
                
                // Build Backend
                sh 'docker build -t bosco-backend ./backend'
                sh 'docker run -d --name bosco-backend -p 5000:5000 bosco-backend'
                
                // Build Frontend
                sh 'docker build -t bosco-frontend ./frontend'
                sh 'docker run -d --name bosco-frontend -p 3000:3000 bosco-frontend'
            }
        }
    }
}
