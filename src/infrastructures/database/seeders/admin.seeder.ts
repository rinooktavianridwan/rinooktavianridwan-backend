import { NestExpressApplication } from '@nestjs/platform-express';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export async function seedAdmin(app: NestExpressApplication): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const email = process.env.ADMIN_EMAIL;
  const name = process.env.ADMIN_NAME;

  if (!username || !password) {
    console.log(
      '⏭️  Admin seeder skipped: ADMIN_USERNAME or ADMIN_PASSWORD not set',
    );
    return;
  }

  const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

  const existingUser = await userRepository.findOne({ where: { username } });
  if (existingUser) {
    console.log(`⏭️  Admin seeder skipped: user "${username}" already exists`);
    return;
  }

  const admin = userRepository.create({
    username,
    email,
    name,
  });
  await admin.hashPassword(password);
  await userRepository.save(admin);

  console.log(`✅ Admin user "${username}" seeded successfully`);
}
