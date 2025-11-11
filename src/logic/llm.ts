import HTTPError from 'http-errors';
import request from 'sync-request';
import { getData, setData, missionLaunchState, DataStore, MessageLog } from '../dataStore';

export function llmchatRequestFormer(messageContent: string): string {
  // TODO You must decide on an appopriate pre-prompt to set the stage for your astronaut assistant so that it will only talk about space missions and related topics.

  const prePrompt = 'This chat is use for a space mission, you have to only answer the questions which releated to space mission';
  const res = request(
    'POST',
    'https://openrouter.ai/api/v1/chat/completions',
    {
      headers: {
        Authorization: 'Bearer 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',
        'Content-Type': 'application/json'
      },
      json: {
        model: 'google/gemma-3n-e2b-it:free',
        messages: [
          {
            role: 'assistant',
            content: prePrompt + messageContent
          }
        ]
      }
    }
  );

  const output = JSON.parse(res.getBody() as string);
  const content: unknown = output.choices?.[0]?.message?.content;

  if (typeof content === 'string' && content.trim().length > 0) {
    return content;
  }

  // Fallback in case API returns an unexpected structure
  throw new Error('LLM response malformed or empty');
}

function requireActiveLaunch(data: DataStore, astronautId: number) {
  if (!Number.isInteger(astronautId)) {
    throw HTTPError(400, 'astronautid is invalid');
  }

  const astronautExists = data.astronauts.some(a => a.astronautId === astronautId);
  if (!astronautExists) {
    throw HTTPError(400, 'astronautid is invalid');
  }

  const activeLaunch = data.launches.find(launch =>
    launch.allocatedAstronauts.includes(astronautId) &&
    launch.state !== missionLaunchState.ON_EARTH
  );

  if (!activeLaunch) {
    throw HTTPError(400, 'Astronaut is not currently in an active launch');
  }

  return activeLaunch;
}

function getChatHistoryEntry(data: DataStore, launchId: number, astronautId: number) {
  let history = data.chatHistory.find(entry =>
    entry.launchId === launchId && entry.astronautId === astronautId
  );

  if (!history) {
    history = {
      launchId,
      astronautId,
      messageLog: []
    };
    data.chatHistory.push(history);
  }

  return history;
}

function buildMessageLog(
  astronautId: number,
  messageId: number,
  chatbotResponse: boolean,
  messageContent: string,
  timeSent: number
): MessageLog {
  return {
    astronautId,
    messageId,
    chatbotResponse,
    messageContent,
    timeSent
  };
}

export function getMessage(astronautId: number, messageContent: string) {
  const trimmedMessage = messageContent.trim() ?? '';
  if (!trimmedMessage) {
    throw HTTPError(400, 'messageRequest must be a non-empty string');
  }

  const data = getData();
  const activeLaunch = requireActiveLaunch(data, astronautId);
  const history = getChatHistoryEntry(data, activeLaunch.launchId, astronautId);

  const userTimestamp = Math.floor(Date.now() / 1000);
  const llmResponse = llmchatRequestFormer(trimmedMessage);
  const responseTimestamp = Math.floor(Date.now() / 1000);

  const userMessageId = history.messageLog.length + 1;
  const responseMessageId = userMessageId + 1;

  history.messageLog.push(
    buildMessageLog(astronautId, userMessageId, false, trimmedMessage, userTimestamp),
    buildMessageLog(astronautId, responseMessageId, true, llmResponse, responseTimestamp)
  );

  setData(data);
  return { messageResponse: llmResponse };
}

export function chatHistory(astronautId: number) {
  const data = getData();
  const activeLaunch = requireActiveLaunch(data, astronautId);
  const history = data.chatHistory.find(entry =>
    entry.launchId === activeLaunch.launchId && entry.astronautId === astronautId
  );

  const messageLog = history.messageLog;

  return {
    chatHistory: [
      {
        launchId: activeLaunch.launchId,
        messageLog: [...messageLog]
      }
    ]
  };
}
