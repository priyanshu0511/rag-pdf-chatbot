import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const upload = multer({
  dest: "src/uploads/",
});

let vectorStore = null;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY,
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: dataBuffer,
    });

    const result = await parser.getText();

    const cleanText = result.text
  .replace(/--\s*\d+\s*of\s*\d+\s*--/g, "")  // remove page markers
  .replace(/\n{3,}/g, "\n\n")                  // collapse excessive newlines
  .trim();

    await parser.destroy();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([cleanText]);


    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });



    vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

    // console.log(vectorStore.memoryVectors[20]);

    res.json({
      success: true,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/chat", async (req, res) => {
  // console.log("Vector Store:", vectorStore);
  try {
    const { question } = req.body;

    // console.log("Question:", question);

    const docs = await vectorStore.similaritySearch(question, 8);

    // console.log("Retrieved Docs:", docs);

    const context = docs.map((doc) => doc.pageContent).join("\n\n");

    // console.log("Context:", context);

    const prompt = `
        You are a helpful PDF assistant.

        Use ONLY the provided context to answer.

        If the answer cannot be found in the context, reply:

        "I could not find that information in the document."

        Context:
        ${context}

        Question:
        ${question}

        Answer:
        `;

    const response = await llm.invoke(prompt);

    res.json({
      answer: response.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
