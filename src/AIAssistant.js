import OpenAI from 'openai';
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI();

const test = async function() {
    // Create a thread where the conversation will happen
    const thread = await openai.beta.threads.create();

    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: "Write an app which connect to AccuWeather API and print weather forecast for last 5 days"
        }
    );

    console.log('thread.id->', thread.id);

// We use the createAndStream SDK helper to create a run with
// streaming. The SDK provides helpful event listeners to handle
// the streamed response.

    const run = openai.beta.threads.runs.stream(thread.id, {
        assistant_id: 'asst_UOKfD0tM500cC6uCubmZKkg9'
    })
        .on('textCreated', (text) => process.stdout.write('\nassistant > '))
        .on('textDelta', (textDelta, snapshot) => process.stdout.write(textDelta.value))
        .on('toolCallCreated', (toolCall) => process.stdout.write(`\nassistant > ${toolCall.type}\n\n`))
        .on('toolCallDelta', (toolCallDelta, snapshot) => {
            if (toolCallDelta.type === 'code_interpreter') {
                if (toolCallDelta.code_interpreter.input) {
                    process.stdout.write(toolCallDelta.code_interpreter.input);
                }
                if (toolCallDelta.code_interpreter.outputs) {
                    process.stdout.write("\noutput >\n");
                    toolCallDelta.code_interpreter.outputs.forEach(output => {
                        if (output.type === "logs") {
                            process.stdout.write(`\n${output.logs}\n`);
                        }
                    });
                }
            }
        });
}

test();