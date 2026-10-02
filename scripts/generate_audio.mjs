import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI();
const audioDir = path.resolve('public/audio');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const steps = [
  { id: 'step_1', text: 'Langkah pertama... Mulai.' },
  {
    id: 'step_2',
    text: 'Langkah kedua... Siapkan alat dan bahan. Yaitu sebuah gelas atau cangkir, sendok pengaduk, bubuk kopi, gula pasir, dan air mineral.',
  },
  {
    id: 'step_3',
    text: 'Langkah ketiga... Panaskan air hingga mencapai suhu ideal, sembilan puluh sampai sembilan puluh lima derajat Celsius.',
  },
  {
    id: 'step_4',
    text: 'Langkah keempat... Masukkan bubuk kopi secukupnya ke dalam gelas.',
  },
  {
    id: 'step_5',
    text: 'Langkah kelima... Tuangkan air panas mendidih, secara perlahan ke dalam gelas.',
  },
  {
    id: 'step_6',
    text: 'Langkah keenam... Aduk seduhan kopi secara memutar hingga merata.',
  },
  {
    id: 'step_7_decision',
    text: 'Langkah ketujuh... Pilihan rasa. Apakah ingin menambahkan gula? Pilih Ya jika ingin manis, atau Tidak untuk kopi hitam murni.',
  },
  {
    id: 'step_7_ya',
    text: 'Langkah ketujuh... Kita tambahkan gula pasir untuk sensasi rasa manis yang pas.',
  },
  {
    id: 'step_7_tidak',
    text: 'Langkah ketujuh... Tanpa tambahan gula, kita nikmati aroma murni kopi hitam.',
  },
  {
    id: 'step_8',
    text: 'Langkah kedelapan... Masukkan gula pasir ke dalam cangkir kopi.',
  },
  {
    id: 'step_9',
    text: 'Langkah kesembilan... Aduk kembali secara perlahan hingga seluruh butiran gula larut sempurna.',
  },
  {
    id: 'step_10',
    text: 'Langkah kesepuluh... Kopi harum telah selesai diseduh, dan kini siap untuk diminum.',
  },
  {
    id: 'step_11',
    text: 'Langkah terakhir... Selesai. Selamat menikmati secangkir kopi hangat racikan Anda.',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithRetry(item, maxRetries = 5) {
  const filePath = path.join(audioDir, `${item.id}.wav`);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`Already exists: ${item.id}.wav`);
    return;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Attempt ${attempt}] Generating ${item.id}...`);
      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [{ role: 'user', parts: [{ text: item.text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } },
          },
        },
      });

      const audioData = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        fs.writeFileSync(filePath, Buffer.from(audioData, 'base64'));
        console.log(`SUCCESS: Saved ${item.id}.wav (${audioData.length} bytes)`);
        // Rate limit prevention: 21s between successful requests
        await sleep(21000);
        return;
      }
    } catch (err) {
      console.warn(`Retry needed for ${item.id}:`, err.message);
      // Wait 30s before retry on 429
      await sleep(30000);
    }
  }
}

async function run() {
  for (const item of steps) {
    await generateWithRetry(item);
  }
  console.log('ALL STEPS GENERATED!');
}

run();
