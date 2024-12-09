import { ChatOpenAI } from "@langchain/openai";
import { listItemTextClasses } from "@mui/material";
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

  let textSplitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 5000,
    // chunkOverlap: 20,
  });
  let smallDoc = true;

  try {
    let docs = await textSplitter.createDocuments([text]);

    if (docs.length > 50) {
      // alert("large doc, previous size: " + docs.length);
      textSplitter = new RecursiveCharacterTextSplitter({ 
        chunkSize: 50000,
        // chunkOverlap: 20,
      });
      docs = await textSplitter.createDocuments([text]);
      smallDoc = false;
      
    }
    // alert(`docs length: ${docs.length}`);
    const chain = loadSummarizationChain(model, { 
      type: "map_reduce",
      returnIntermediateSteps: true,
    });

    const res = await chain.invoke({
      input_documents: docs,
    });

    return {"status": 200, "summary": res.text, "isSmall": smallDoc}
  } catch (error) {
    console.error(error);
    return {"status": 400, "error_name": error.name, "error_msg": error.message}
  }
}

export { stuff, mapReduce }