import { parseEther } from "viem"
import supabase from "./supabase"
import { useSendTransaction } from "wagmi"

export const sendCode = async ({code, address, amount, chainName, time }:{code: string, address: string, amount: string, chainName: string, time: string}) => {
    const {data, error} = await supabase.from('battle').insert({
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
    const {data, error} = await supabase.from('battle').select('*').eq('invite_code', code)

    if(data){
        await supabase.from('battle').insert({player2: player2_address}).eq('invite_code', code)
        console.log('Invite code checked successfully:', data)
        return data
    }
}
