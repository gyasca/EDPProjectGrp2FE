import OpenAI from "openai";
import fs from "fs";

// Read the API key from the file
const key = fs.readFileSync('openaikey.txt', 'utf-8').trim();
const openai = new OpenAI({apiKey: key});

async function main() {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "How are you?" }],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
}

main();