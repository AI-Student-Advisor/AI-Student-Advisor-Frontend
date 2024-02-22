export const responseWords = "Hi, I'm the mock server. It's nice to meet you!"
    .split(" ")
    .flatMap((value, index, array) => {
        if (index === array.length - 1) {
            return value;
        }
        return [value, " "];
    });

export const historyConversationMap = new Map();
Array.from({ length: 500 }, (...[, index]) => ({
    id: crypto.randomUUID(),
    dateTime: new Date(new Date().getTime() - index * 1e7).toISOString(),
    title: `Test entry ${index}`
})).forEach((value) => historyConversationMap.set(value.id, value));

export const historyConversationMessageMap = new Map();
historyConversationMap.forEach((value) => {
    const messages = Array.from({ length: 20 }, (...[, index]) => ({
        id: crypto.randomUUID(),
        content: `Test message ${index}; Session ID = ${value.id}`,
        author: {
            role: index % 2 === 0 ? "user" : "assistant"
        }
    }));
    historyConversationMessageMap.set(value.id, messages);
});
