import { Controller, Get, HttpStatus } from '@nestjs/common';
import { IResponse } from '../../common/interfaces/response.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
}

interface DatabaseHealthStatus extends HealthStatus {
  database: {
    connected: boolean;
    type: string;
  };
}

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  check(): IResponse<HealthStatus> {
    const healthData: HealthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };

    return {
      status_code: HttpStatus.OK,
      message: 'Application is healthy',
      data: healthData,
      version: '1.0.0',
    };
  }

  @Get('db')
  async checkDatabase(): Promise<IResponse<DatabaseHealthStatus>> {
    let isConnected = false;
    let dbType = 'unknown';

    try {
      // Check if database is connected
      if (this.dataSource.isInitialized) {
        // Try a simple query
        await this.dataSource.query('SELECT 1');
        isConnected = true;
        dbType = this.dataSource.options.type;
      }
    } catch {
      isConnected = false;
    }

    const healthData: DatabaseHealthStatus = {
      status: isConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: isConnected,
        type: dbType,
      },
    };

    return {
      status_code: isConnected ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
      message: isConnected
        ? 'Database connection is healthy'
        : 'Database connection failed',
      data: healthData,
      version: '1.0.0',
    };
  }
}
