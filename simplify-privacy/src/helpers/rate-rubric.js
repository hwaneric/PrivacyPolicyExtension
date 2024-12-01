import { OpenAI } from "@langchain/openai";
import { loadQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const secrets = require('../env.json');
const OPENAI_API_KEY = secrets.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const rubric = "" //TODO: Design rubric

// TODO: Write how API should output ratings 

// Naive summarization strategy
async function naiveRubric(text) {

  // Request payload
  const data = {
    model: "gpt-4", 
    messages: [
      { role: "system", content: "You are a helpful assistant that rates privacy policies on the rubric we give you." },
      {
        role: "user",
        content: `Here is our rubric: ${rubric}. Please rate the following privacy policy for each item in our rubric: ${text}`,
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
    return {"status": 200, "ratings": completion.choices[0].message.content}
    
  } catch (error) {
    console.error("Error:", error);
    return  {"status": 400, "error_msg": "PLACEHOLDER"}

  }
}

// MapReduce (aka chunking) summarization strategy
async function mapReduceRubric(text) {
  const model = new OpenAI({ 
    temperature: 0.7,
    apiKey: OPENAI_API_KEY,
  });
  const textSplitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 1000,
  });
  try {
    const docs = await textSplitter.createDocuments([text]);
    const chain = loadQAChain(model, { 
      type: "map_reduce",
      returnIntermediateSteps: true,
    });

    const res = await chain.invoke({
      input_documents: docs,
      question: `Please rate the input document (which is a privacy policy) on the rubric we give you. Here is our rubric: ${rubric}.`,
    });

    return {"status": 200, "ratings": res.text}
  } catch (error) {
    console.error(error);
    return {"status": 400, "error_msg": "PLACEHOLDER"}
  }
}

export { naiveRubric, mapReduceRubric }