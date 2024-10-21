import supabase from "./supabase"
import { GoogleGenerativeAI } from "@google/generative-ai";

export const sendCode = async ({code, address, amount, chainName, time }:{code: string, address: string, amount: string, chainName: string, time: string}) => {
    const {data} = await supabase.from('battle').insert({
            invite_code: code,
            eth_amount: amount,
            player1: address,
            started_by: address,
            chain: chainName,
            typing_time: time
        })

    if(data){
        console.log('Invite code sent successfully:', data)
    }
}

export const checkInviteCode = async (code: string, player2_address: string) => {
    const { data, error } = await supabase
      .from('battle')
      .select('*')
      .eq('invite_code', code)
  
    if (error) {
      console.error('Error checking invite code:', error);
      return null;
    }
  
    if (data) {
      console.log(player2_address, 'inserting this in place of player2')

      return data;
    }
  
    console.error('No matching invite code found.');
    return null;
  };
  

  export const player2Join = async (code: string, player2_address: string) => {
    const { data, error } = await supabase
    .from('battle')
    .update({ player2: player2_address })
    .eq('invite_code', code)
    .select();

    if (error) {
      console.error('Error updating player2:', error);
      return null;
    }
    
    return data;
  }

  export const getData = async (inviteCode: string) => {
    const { data, error } = await supabase
      .from('battle')
      .select("*")
      .eq('invite_code', inviteCode)

      if (error) {
        console.error('Error updating player2:', error);
        return null;
      }
      
      return data;
  }


export const markReady = async (battleId: string) => {
    await supabase.from('battle').update({ ready_status: true }).eq('invite_code', battleId).select('*');
  };


  export const setStatus = async (Status: string, battleId: string) => {
    await supabase.from('battle').update({ status: Status }).eq('invite_code', battleId).select('*');
  }

  export const gen = async () => {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const finalPrompt = 'Give me an array of 100 good words from stories. The result should start with [ and end with ].';
      const result = await model.generateContent(finalPrompt);

      return result.response.text();
    } catch (error) {
      console.error('Error generating content:', error);
      return 'An error occurred while generating content.';
    }
  };