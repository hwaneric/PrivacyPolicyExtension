import { ChatOpenAI } from "@langchain/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const secrets = require('../env.json');
const OPENAI_API_KEY = secrets.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";


// Naive summarization strategy
async function stuff(text) {

  // Request payload
  const data = {
    model: "gpt-4", 
    messages: [
      { role: "system", content: "You are a helpful assistant that summarizes privacy policies." },
      {
        role: "user",
        content: `Please concisely summarize the following privacy policy: ${text}`,
      },
    ],
    temperature: 0.7,
  };

  // Make the POST request
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const completion = await response.json();
    // console.log(completion);
    // console.log("Completion response:", completion.choices[0].message.content);
    return {"status": 200, "summary": completion.choices[0].message.content}
    
  } catch (error) {
    console.error("Error:", error);
    return  {"status": 400, "error_name": error.name, "error_msg": error.message}

  }
}

// MapReduce (aka chunking) summarization strategy
async function mapReduce(text) {
  // const model = new OpenAI({ 
  //   temperature: 0.7,
  //   apiKey: OPENAI_API_KEY,
  // });
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
    apiKey: OPENAI_API_KEY,
    verbose: true,
  });

  const textSplitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 1000,
    // chunkOverlap: 20,
  });

  try {
    const docs = await textSplitter.createDocuments([text]);
    const chain = loadSummarizationChain(model, { 
      type: "map_reduce",
      returnIntermediateSteps: true,
    });

    const res = await chain.invoke({
      input_documents: docs,
    });

    return {"status": 200, "summary": res.text}
  } catch (error) {
    console.error(error);
    return {"status": 400, "error_name": error.name, "error_msg": error.message}
  }
}

export { stuff, mapReduce }