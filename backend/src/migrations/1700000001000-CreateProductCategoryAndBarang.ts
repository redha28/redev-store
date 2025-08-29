import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductCategoryAndProduct1700000001000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create product_categories table
    await queryRunner.query(`
      CREATE TABLE \`product_categories\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(100) NOT NULL,
        \`description\` text,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_product_category_name\` (\`name\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE \`products\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`code\` varchar(50) NOT NULL,
        \`category_id\` int NOT NULL,
        \`stock\` int NOT NULL DEFAULT '0',
        \`price\` decimal(15,2) NOT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_products_code\` (\`code\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE \`products\` 
      ADD CONSTRAINT \`FK_products_category\` 
      FOREIGN KEY (\`category_id\`) 
      REFERENCES \`product_categories\`(\`id\`) 
      ON DELETE RESTRICT ON UPDATE CASCADE
    `);

    // Insert default categories
    await queryRunner.query(`
      INSERT INTO \`product_categories\` (\`name\`, \`description\`) VALUES
      ('Electronics', 'Electronic devices and gadgets'),
      ('Fashion', 'Clothing, shoes, accessories, and fashion items for men and women'),
      ('Home & Living', 'Furniture, home decor, kitchen appliances, and household essentials')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP CONSTRAINT \`FK_products_category\``,
    );
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(`DROP TABLE \`product_categories\``);
  }
}
