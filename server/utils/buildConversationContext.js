export const buildConversationContext = (summary, recentMessages) => {

  const context = [];

  if (summary && typeof summary === "string" && summary.trim()) {

    context.push({
      role: "user",
      content: `Conversation summary so far:\n${summary}`
    });

  }

  recentMessages
    .filter(msg => !msg.isImage && typeof msg.content === "string" && msg.messageType === "normal")
    .forEach(msg => {

      context.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      });
      
    });

  return context;

};
