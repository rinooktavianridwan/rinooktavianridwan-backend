pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                // Jenkins otomatis mengambil kode dari branch main sesuai konfigurasi tadi
                checkout scm
            }
        }

        stage('Deploy (Docker Compose)') {
            steps {
                // Mengeksekusi perintah build dan up menggunakan docker compose production Anda
                sh '''
                echo "Memulai proses build dan deployment..."
                docker compose -f docker-compose.prod.yml build
                docker compose -f docker-compose.prod.yml up -d
                '''
            }
        }
        
        stage('Clean Up') {
            steps {
                // Membersihkan image docker lama yang menumpuk agar VPS tidak penuh
                sh 'docker image prune -f'
            }
        }
    }
}