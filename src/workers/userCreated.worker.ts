import {startWorker} from '@shared/pg-boss';
import {createProducer, KafkaConfig} from '@shared/kafka';
import logger from "@shared/logger";
import {kafkaProducersConfig} from "../config/kafka.config";

export const pgBossKafkaEventPrefix = 'event.';

export async function init(kafkaConfig: KafkaConfig) {
  startWorker(kafkaConfig, kafkaProducersConfig.topicUserCreated);
}
export async function startUserCreatedWorker(kafkaConfig: KafkaConfig) {
  startWorker(kafkaConfig, kafkaProducersConfig.topicUserCreated);
}
