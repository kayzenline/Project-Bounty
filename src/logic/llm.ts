import request from 'sync-request';

export function llmchatRequestFormer(messageContent: string) : string {

    // TODO You must decide on an appopriate pre-prompt to set the stage for your astronaut assistant so that it will only talk about space missions and related topics.

    let prePrompt = ""
    const res = request(
        'POST',
        'https://openrouter.ai/api/v1/chat/completions',
        {
            headers: {
                "Authorization": "Bearer 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",
                "Content-Type": "application/json"
            },
            json: {
                "model": "google/gemma-3n-e2b-it:free",
                "messages": [
                {
                    "role": "assistant",
                    "content": prePrompt+messageContent
                }
                ]
            }
        },
    );

    let output = JSON.parse(res.getBody() as string)
    console.log(output)

    // TODO :: You must understand the structure output and retrieve the response
    return "Not implemented";
}

export function getMessage(mc: string) {
  const message = llmchatRequestFormer(mc)

}

llmchatRequestFormer("How far from the earth to the moon");
