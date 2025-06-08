// ormconfig.ts
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: ['query', 'error'],
  entities: [
    // __dirname + '/src/user/entities/user.entity{.ts,.js}',
    // __dirname + '/src/contact/entities/contact.entity{.ts,.js}',
    // __dirname + '/src/portfolio/entities/project.entity{.ts,.js}',
    // __dirname + '/src/portfolio/entities/project-image.entity{.ts,.js}',
  ],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  subscribers: [],
});

export default AppDataSource;
