import { OpenAI } from "@langchain/openai";
import { loadQAChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter, HTMLHeaderTextSplitter } from "langchain/text_splitter";

const secrets = require('../env.json');
const OPENAI_API_KEY = secrets.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const rubric = JSON.stringify({
    "Collection Transparency": {
      "1": "Company does not have a section on how they collect data. Company does not provide any information on the type of data they are collecting or the sources of their data.",
      "2": "If the company is collecting data, the company has a section on how they collect data but the policy is incomplete. The company tells users that they are collecting user data but does not provide any additional information.",
      "3": "If the company is collecting data, the company vaguely informs users of the ways they are collecting data. They broadly list the internal and external data sources they are using. They broadly list categories of information they are collecting.",
      "4": "If the company is collecting user data, company specifies the types of personal data they are collecting. The company does not justify why they are collecting certain pieces of data.",
      "5": "If the company is collecting user data, the company is extremely explicit in the types of personal data they are collecting. The company also provides justification for why they need to collect each piece of data."
    },
    "Usage Transparency": {
      "1": "Company does not have a section on how they are using data. Company does not provide any information on why they are collecting data and how they are using it.",
      "2": "If the company is collecting data, the company has a section on how they use data but the policy is incomplete. The company tells users that they are using user data but does not provide any additional information.",
      "3": "If the company is collecting data, the company vaguely informs users of the ways they are using data. If they mention third parties, service providers, or partners, the company informs users that they are sending user data to them. The company informs the user how they are using their data in their business but does not give specifics.",
      "4": "If the company is collecting user data, company specifies how the company is using the personal data they are collecting. If the company mentions using third parties, service providers, or partners, the company specifies what types of data it is sending to third parties.",
      "5": "If the company is collecting user data, the company is extremely transparent on how they are using data. The company lists how they are using user data internally across specific sectors of the company. If the company mentions using third parties, service providers, or partners, the company lists what data they are sending to third parties and which third parties they are using."
    },
    "User Autonomy": {
      "1": "Company does not have a section on how users can control their data. Company does not provide any information on how users can protect their data or delete their data.",
      "2": "If the company is collecting data, the company has a section on how users can protect their data but the policy is incomplete. The company does not supply users with any actions to protect their data.",
      "3": "If the company is collecting data, the company provides limited information on how the user can protect their data but does not supply any external links or resources for users to do so.",
      "4": "If the company is collecting data, the company provides full information on how the user can protect their data and provides some external links and resources. The process of updating and deleting user data is not completely frictionless and requires users to jump through external stages.",
      "5": "If the company is collecting data, the company provides full information on how the user can protect their data. Users can easily modify, delete, and access their data through the website or external resources."
    },
    "Data Minimization": {
      "1": "Company does not mention anything about how much data they are collecting from users. Company does not actively aim to minimize the amount of data collected from users.",
      "2": "Company states that they collect essential data and lists their intended purposes. Data collection purposes are specific but may include unnecessary contingencies.",
      "3": "Company states that they strictly collect only the data that is necessary and lists their intended purposes with the data. Data collection purposes are narrowly defined and very specific."
    },
    "Recency": {
      "1": "Company has not updated their privacy policy within the last year.",
      "2": "Company has updated their privacy between the last 6 months and 1 year.",
      "3": "Company has updated their privacy policy within the last 6 months."
    },
    "Data Retention and Security": {
      "1": "Company does not inform the user how it is retaining their data. Company does not inform the user of how it is storing and securing the user's data.",
      "2": "Company minimally informs the user how it is retaining their data but does not provide justification on why they are doing so. Company informs the user of how it is storing and securing the user's data.",
      "3": "Company informs user on how it is retaining their data and explicitly justifies why they need to retain it. Company informs the user of how it is storing and securing the user's data and informs the user that they regularly update and comply with legal requirements."
    },
    "Readability and Accessibility": {
      "1": "Company's privacy policy is incomprehensible. Company does not provide any additional resources at the company for users to reach out to.",
      "2": "Company's privacy policy is full of complicated legal language. Company provides minimal additional resources at the company for users to reach out to.",
      "3": "Company's privacy policy is easy to comprehend. Company provides additional resources at the company for users to reach out to."
    }
  });

// Naive summarization strategy
async function naiveRubric(text) {

  // Request payload
  const data = {
    model: "gpt-4o", //PRIN CHANGE BACK 
    messages: [
      { role: "system", content: "You are a helpful assistant that rates privacy policies on the rubric we give you." },
      {
        role: "user",
        content: `Here is a rubric: ${rubric}. We would like you to rate a privacy policy for 
        each item in our rubric. Please return the output as a JSON object with each rubric item as a key 
        and the rating as the value, and with no additional text. Here is the privacy policy: ${text}`,
      },
    ],
    temperature: 0.7,
  };

  alert("Sending request to OpenAI...");
  // throw new Error(`data: ${data.messages[1].content}`);

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
    // alert(completion)
    // alert(completion.choices[0].message.content)
    return {"status": 200, "ratings": completion.choices[0].message.content}
    
  } catch (error) {
    console.error("Error:", error);
    return  {"status": 400, "error_msg": "PLACEHOLDER"}

  }
}

// MapReduce (aka chunking) summarization strategy
async function mapReduceRubric(text) {
  // alert(text) //URL

  const model = new OpenAI({ 
    temperature: 0.7,
    apiKey: OPENAI_API_KEY,
  });
  const textSplitter = new RecursiveCharacterTextSplitter(
  {
    separators:[
      "\n\n",
      "\n",
      " ",
      ".",
      ",",
  ], 
    chunkSize: 1000,
  });
  try {
    const docs = await textSplitter.createDocuments([text]);
    // alert(JSON.stringify(docs[0]))
    // for (let doc in docs){
    // for (let i = 0; i < docs.length; i++) { 
      
    //   alert((JSON.stringify(docs[i]).length))
    //   alert(JSON.stringify(docs[i]))
    // }
      
    // throw new Error(`STOP ${docs}`);
    const chain = loadQAChain(model, { 
      type: "map_reduce",
      returnIntermediateSteps: true,
    });

    alert("Map reduce: Sending request to OpenAI...");

    const res = await chain.invoke({
      input_documents: docs,
      question: `Please rate the input document (which is a privacy policy) on each item in the rubric we give you. 
      Here is our rubric: ${rubric}. Please return the output as a JSON object with each rubric item as a key
      and the rating as an integer value, and with no additional text.`,
      // response_format:{ "type": "json_object" }, //check if this response format works
    });
    // alert({ res });
    // alert({res});
    // alert(JSON.stringify(res.text));
    // alert(res.text)

    return {"status": 200, "ratings": res.text}
  } catch (error) {
    console.error(error);
    return {"status": 400, "error_msg": "PLACEHOLDER"}
  }
}

export { naiveRubric, mapReduceRubric }