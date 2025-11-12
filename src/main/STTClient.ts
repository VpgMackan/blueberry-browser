import { WebContents } from "electron";
import {
  experimental_transcribe as transcribe,
  type TranscriptionModel,
} from "ai";
import { groq } from "@ai-sdk/groq";
import * as dotenv from "dotenv";
import { join } from "path";
import type { Window } from "./Window";

dotenv.config({ path: join(__dirname, "../../.env") });

interface TranscribeRequest {
  audio: Buffer;
  transcriptionId: string;
}

interface TranscribeResponse {
  text: string;
}

type TranscriptionProvider = "groq";

const DEFAULT_MODELS: Record<TranscriptionProvider, string> = {
  groq: "whisper-large-v3",
};

export class TranscriptionClient {
  private readonly webContents: WebContents;
  private window: Window | null = null;
  private readonly provider: TranscriptionProvider;
  private readonly modelName: string;
  private readonly model: TranscriptionModel | null;

  constructor(webContents: WebContents) {
    this.webContents = webContents;
    this.provider = this.getProvider();
    this.modelName = this.getModelName();
    this.model = this.initializeModel();

    this.logInitializationStatus();
  }

  setWindow(window: Window): void {
    this.window = window;
  }

  private getProvider(): TranscriptionProvider {
    return "groq";
  }

  private getModelName(): string {
    return process.env.TRANSCRIPTION_MODEL || DEFAULT_MODELS[this.provider];
  }

  private initializeModel(): TranscriptionModel | null {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    switch (this.provider) {
      case "groq":
        return groq.transcription(this.modelName);
      default:
        return null;
    }
  }

  private getApiKey(): string | undefined {
    switch (this.provider) {
      case "groq":
        return process.env.GROQ_API_KEY;
      default:
        return undefined;
    }
  }

  private logInitializationStatus(): void {
    if (this.model) {
      console.log(
        `✅ LLM Client initialized with ${this.provider} provider using model: ${this.modelName}`
      );
    } else {
      const keyName = "GROQ_API_KEY";
      console.error(
        `❌ LLM Client initialization failed: ${keyName} not found in environment variables.\n` +
          `Please add your API key to the .env file in the project root.`
      );
    }
  }

  async sendTranscriptionRequest(request: TranscribeRequest): Promise<void> {
    try {
      if (!this.model) {
        this.sendErrorMessage(
          request.transcriptionId,
          "Transcription service is not configured. Please add your API key to the .env file."
        );
        return;
      }

      const result = await transcribe({
        model: this.model,
        audio: request.audio,
      });
      this.sendTranscriptionResponse(request.transcriptionId, {
        text: result.text,
      });
    } catch (error) {}
  }

  private sendErrorMessage(
    transcriptionId: string,
    errorMessage: string
  ): void {
    this.sendTranscriptionResponse(transcriptionId, {
      text: errorMessage,
    });
  }

  private sendTranscriptionResponse(
    transcriptionId: string,
    data: TranscribeResponse
  ): void {
    this.webContents.send("transcription-response", {
      transcriptionId,
      content: data.text,
    });
  }
}
