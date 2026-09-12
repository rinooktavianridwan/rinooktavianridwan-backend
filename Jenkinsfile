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
                    # Install pnpm (corepack if available, else npm)
                    if command -v corepack >/dev/null 2>&1; then
                      corepack enable && corepack prepare pnpm@10.29.3 --activate
                    else
                      npm install -g pnpm@10.29.3
                    fi

                    # Verify lockfile exists
                    if [ ! -f pnpm-lock.yaml ]; then
                      echo "ERROR: pnpm-lock.yaml not found in workspace"
                      exit 1
                    fi

                    pnpm install --frozen-lockfile
                    pnpm run lint
                    pnpm run test
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
                withCredentials([file(credentialsId: 'prod-portfolio-env', variable: 'ENV_FILE')]) {
                    sh '''
                    echo "Menyiapkan file .env dari Jenkins Credentials..."
                    cp "$ENV_FILE" .env

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
