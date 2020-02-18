"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
const session = require("express-session");
const connectRedis = require("connect-redis");
const cookieParser = require("cookie-parser");
const config_service_1 = require("./core/configure/config.service");
const swagger_1 = require("@nestjs/swagger");
const core_2 = require("./core/");
const validation_pipe_1 = require("./core/pipes/validation.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const secret = config_service_1.ConfigService.get('SYSTEM_SECRET');
    let RedisStore = connectRedis(session);
    app.use(cookieParser());
    app.useGlobalFilters(new core_2.HttpExceptionFilter());
    app.useGlobalGuards(new core_2.RolesGuard());
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
