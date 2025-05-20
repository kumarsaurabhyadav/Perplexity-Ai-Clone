// import { supabase } from "@/services/supabase";
// import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );

// export const llmModel = inngest.createFunction(
//   { id: 'llm-model' },
//   { event: 'llm-model' },
//   async ({ event, step }) => {
//     try {
//       const aiResp = await step.ai.infer('generate-ai-llm-model-call', {
//         model: step.ai.models.gemini({
//           model: 'gemini-1.5-flash',
//           apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
//         }),
//         body: {
//           contents: [
//             {
//               role: 'system',
//               parts: [
//                 {
//                   text:
//                     'Depends on user input sources, Summerize and search about topic, Give me markdown text with proper formatting. User Input is:' +
//                     event.data.searchInput,
//                 },
//               ],
//             },
//             {
//               role: 'user',
//               parts: [{ text: JSON.stringify(event.data.searchResult) }],
//             },
//           ],
//         },
//       });

//       const { data, error } = await supabase
//         .from('Chats')
//         .update({ aiResp: aiResp?.candidates[0].content.parts[0].text })
//         .eq('id', event.data.recordId)
//         .select();

//       if (error) {
//         throw error;
//       }

//       return aiResp;
//     } catch (error) {
//       console.error('Error in llmModel function:', error);
//       throw error;
//     }
//   }
// );

// import { supabase } from "@/services/supabase";
// import { inngest } from "./client";

// export const helloWorld = inngest.createFunction(
//   { id: "hello-world" },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     await step.sleep("wait-a-moment", "1s");
//     return { message: `Hello ${event.data.email}!` };
//   },
// );
 

// export const llmModel = inngest.createFunction(
//   { id: 'llm-model' },
//   { event: 'llm-model' },
//   async ({ event, step }) => {
//     if (!event.data.searchInput || !event.data.searchResult) {
//       throw new Error("Missing searchInput or searchResult");
//     }
//     console.log("Running LLM with input:", event.data.searchInput);
//     const aiResp = await step.ai.infer('generate-ai-llm-model-call', {
//       model: step.ai.models.gemini({
//         model: 'gemini-1.5-flash',
//         apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
//       }),
//       body: {
//         contents: [
//           {
//             role: 'user',
//             parts: [
//               {
//                 text: `Summarize and search about the topic based on this user input: "${event.data.searchInput}".\n\nHere's the raw data:\n${JSON.stringify(event.data.searchResult, null, 2)}`
//               }
//             ]
//           }
//         ]
//       }
//     });
//     const saveToDB = await step.run('saveToDB', async () => {
//       const { data, error } = await supabase
//         .from('Chats')
//         .update({ aiResp: aiResp?.candidates[0].content.parts[0].text })
//         .eq('id', event.data.recordId)
//         .select()
//       return aiResp;
//     });
//   }
// )


import { supabase } from "@/services/supabase";
import { inngest } from "./client";

export const llmModel = inngest.createFunction(
  { id: 'llm-model' },
  { event: 'llm-model' },
  async ({ event, step }) => {
    if (!event.data.searchInput || !event.data.searchResult) {
      throw new Error("Missing searchInput or searchResult");
    }
    console.log("Running LLM with input:", event.data.searchInput);
    const aiResp = await step.ai.infer('generate-ai-llm-model-call', {
      model: step.ai.models.gemini({
        model: 'gemini-1.5-flash',
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
      }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Summarize and search about the topic based on this user input: "${event.data.searchInput}".\n\nHere's the raw data:\n${JSON.stringify(event.data.searchResult, null, 2)}`
              }
            ]
          }
        ]
      }
    });
    const saveToDB = await step.run('saveToDB', async () => {
      const { data, error } = await supabase
        .from('Chats')
        .update({ aiResp: aiResp?.candidates[0].content.parts[0].text })
        .eq('id', event.data.recordId)
        .select();
      if (error) {
        console.error('Error updating Chats:', error);
        throw error;
      }
      return aiResp;
    });
  }
);