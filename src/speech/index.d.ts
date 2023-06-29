export interface IaraInference {
  transcript: string;
  richTranscript: string;
  richTranscriptModifiers?: string[];
  rid?: string;
  isFinal: boolean;
  isFirst: boolean;
}
