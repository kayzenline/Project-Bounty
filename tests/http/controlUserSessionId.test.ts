import request from 'sync-request-curl';
import config from '../../src/config.json';
import { adminMissionTransferRequest} from './requestHelpers';
// also need the following request helpers:
//  - adminAuthRegister
//  - adminMissionCreate
//  - adminMissionList
//  - clear

const port = config.port;
const url = config.url;

const SERVER_URL = `${url}:${port}`;
