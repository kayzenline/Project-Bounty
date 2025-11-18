import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { port, url } from './config.json';
import { clear, addUser, editMessage, getMessages, sendMessage } from './brooms';

const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();

app.use(cors());
app.use(json());
app.use(morgan('dev'));

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED BELOW THIS DIVIDER
// ========================================================================= //
app.delete('/clear', (req: Request, res: Response) => {
  res.json(clear());
});

// TODO: Implement all the remaining routes given in swagger.yaml

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED ABOVE THIS DIVIDER
// ========================================================================= //

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "404 not found" });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${PORT}'`);
});

server.on('error', (err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
