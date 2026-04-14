/// <reference lib="webworker" />
import { pipeline, env } from '@huggingface/transformers';

// Usar la CDN de HuggingFace, no modelos locales
env.allowLocalModels = false;

let classifier: any = null;

addEventListener('message', async ({ data }) => {
    try {
        // El modelo se carga la primera vez y se cachea en IndexedDB automáticamente
        if (!classifier) {
            classifier = await pipeline(
                'zero-shot-classification',
                'Xenova/distilbart-mnli-12-1'
            );
        }

        const result = await classifier(data.sequence, data.candidateLabels, {
            multi_label: false,
        });

        postMessage({ success: true, result });
    } catch (error: any) {
        postMessage({ success: false, error: error?.message ?? 'Worker error' });
    }
});
