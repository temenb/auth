import server from './app';
import * as grpc from '@grpc/grpc-js';
import config from './config/config';
import { logger } from './utils/logger';

const PORT = config.port;

server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
    logger.log(`🚀 gRPC server running on port ${PORT}`);
});

// server.tryShutdown(() => {
//     logger.log('✅ gRPC server gracefully shut down');
// });