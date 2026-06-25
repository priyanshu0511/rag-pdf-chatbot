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

    await parser.destroy();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([result.text]);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "gemini-embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);

    const results = await vectorStore.similaritySearch(
      "What is this document about?",
      4,
    );

    console.log(results);

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
    console.log("Vector Store:", vectorStore);
  try {
    const { question } = req.body;

    const docs = await vectorStore.similaritySearch(question, 4);

    const context = docs.map((doc) => doc.pageContent).join("\n\n");

    const prompt = `
Answer the question using ONLY the provided context.

Context:
${context}

Question:
${question}
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
