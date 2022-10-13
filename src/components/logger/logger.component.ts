import {Component} from '@loopback/core';
import { LoggerController } from './logger.controller';

export class LoggerComponent implements Component {
  controllers = [LoggerController];
  constructor() {
  }
}