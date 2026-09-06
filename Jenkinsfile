pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps { checkout scm }
        }

        // Tahap CI: Selalu berjalan di semua branch dan PR
        stage('Test & Lint (CI)') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS26') {
                    sh '''
                    npm install
                    npm run lint
                    npm run test
                    '''
                }
            }
        }

        // Tahap CD: HANYA berjalan jika kode berhasil di-merge ke branch master
        stage('Deploy Production (CD)') {
            when {
                branch 'master'
            }
            steps {
                withCredentials([string(credentialsId: 'prod-portofolio-env', variable: 'ENV_CONTENT')]) {
                    sh '''
                    echo "Menyiapkan file .env dari Jenkins Credentials..."
                    printenv ENV_CONTENT > .env
                    
                    echo "Memulai deployment ke VPS..."
                    docker compose -f docker-compose.prod.yml build
                    docker compose -f docker-compose.prod.yml up -d
                    '''
                }
            }
        }
        
        stage('Clean Up') {
            when {
                branch 'master'
            }
            steps {
                sh '''
                docker image prune -f
                rm -f .env
                '''
            }
        }
    }
}
