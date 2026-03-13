import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './middlewares/error.middleware';
import productRoutes from './routes/product.routes';
import { swaggerSpec } from './config/swagger';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/products', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Advanced REST API' });
});

// Error handling
app.use(errorMiddleware);

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
  logger.info(`Docs are available at http://localhost:${port}/api-docs`);
});

export default app;
