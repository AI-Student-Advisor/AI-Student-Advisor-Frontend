import express from "express";
import cors from "cors";
import { historyConversationMap, historyConversationMessageMap, responseWords } from "./data.mjs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/conversation", async (request, response) => {
    const data = request.body;
    console.log(data);

    let sessionId = crypto.randomUUID();

    if (data.message.id) {
        sessionId = data.message.id;
    }

    const responseControlPending = {
        status: "success",
        type: "control",
        id: sessionId,
        control: {
            signal: "generation-pending"
        }
    };

    const responseControlStart = {
        status: "success",
        type: "control",
        id: sessionId,
        control: {
            signal: "generation-started"
        }
    };

    const responseMessage = {
        status: "success",
        type: "message",
        id: sessionId,
        message: {
            id: crypto.randomUUID(),
            content: "",
            author: {
                role: "assistant"
            }
        }
    };
    const responseControlDone = {
        status: "success",
        type: "control",
        id: sessionId,
        control: {
            signal: "generation-done"
        }
    };

    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Connection", "keep-alive");
    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("X-Accel-Buffering", "no");

    response.write("event: message\n");
    response.write(`data: ${JSON.stringify(responseControlPending)}`);
    response.write("\n\n");

    await sleep(1000);

    response.write("event: message\n");
    response.write(`data: ${JSON.stringify(responseControlStart)}`);
    response.write("\n\n");

    let counter = 0;
    setInterval(() => {
        responseMessage.message.content += responseWords[counter++];

        response.write("event: message\n");
        response.write(`data: ${JSON.stringify(responseMessage)}\n`);
        response.write("\n\n");

        if (counter >= responseWords.length) {
            response.write("event: message\n");
            response.write(`data: ${JSON.stringify(responseControlDone)}\n`);
            response.write("\n\n");
            response.end();
        }
    }, 100);

    response.on("close", () => {
        response.end();
    });
});

app.get("/api/history-sessions", (request, response) => {
    const totalEntryCount = 300;
    const maxLimit = 50;

    // Since this is just a demo server, I skipped rigorous schema checks
    // Implement this properly in real backend
    const limit = parseInt(request.query.limit) > maxLimit ? maxLimit : parseInt(request.query.limit);
    const offset = parseInt(request.query.offset);

    response.write(JSON.stringify({
        status: "success",
        total: totalEntryCount,
        limit: limit,
        items: [...historyConversationMap.values()].slice(offset, offset + limit)
    }));

    response.end();
});

app.get("/api/history-session/:id", (request, response) => {
    const id = request.params.id;

    response.write(JSON.stringify({
        status: "success",
        messages: historyConversationMessageMap.get(id)
    }));
    response.end();
});

app.patch("/api/history-session/:id", (request, response) => {
    const id = request.params.id;
    const { name } = request.body;

    const entry = historyConversationMap.get(id);
    entry.title = name;

    response.write(JSON.stringify({
        status: "success"
    }));
    response.end();
});

app.delete("/api/history-session/:id", (request, response) => {
    const id = request.params.id;

    historyConversationMap.delete(id);
    historyConversationMessageMap.delete(id);

    response.write(JSON.stringify({
        status: "success"
    }));
    response.end();
});

app.listen(3001);
