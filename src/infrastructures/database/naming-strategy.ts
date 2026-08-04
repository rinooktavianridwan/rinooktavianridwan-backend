import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

/**
 * Custom snake_case naming strategy for TypeORM.
 * Translates camelCase entity property names into snake_case database columns,
 * mirroring the behaviour of the strategy removed from the installed build.
 */
export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  private snakeCase(str: string): string {
    return str
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[-\s.]/g, '_')
      .toLowerCase();
  }

  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return userSpecifiedName ? userSpecifiedName : this.snakeCase(targetName);
  }

  columnName(
    propertyName: string,
    customName?: string,
    embeddedPrefixes: string[] = [],
  ): string {
    return this.snakeCase(
      embeddedPrefixes.concat(customName ? customName : propertyName).join('_'),
    );
  }

  relationName(propertyName: string): string {
    return this.snakeCase(propertyName);
  }

  joinColumnName(relationName: string, referencedColumnName: string): string {
    return this.snakeCase(relationName + '_' + referencedColumnName);
  }

  joinTableName(firstTableName: string, secondTableName: string): string {
    return this.snakeCase(firstTableName + '_' + secondTableName);
  }

  joinTableColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return this.snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  joinTableInverseColumnName(
    tableName: string,
    propertyName: string,
    columnName?: string,
  ): string {
    return this.snakeCase(
      tableName + '_' + (columnName ? columnName : propertyName),
    );
  }

  prefixTableName(prefix: string, tableName: string): string {
    return prefix + tableName;
  }

  nestedSetColumnNames = { left: 'nsleft', right: 'nsright' };

  materializedPathColumnName = 'mpath';
}
