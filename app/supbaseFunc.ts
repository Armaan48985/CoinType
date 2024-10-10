import supabase from "./supabase"

export const sendCode = async ({code, address, amount }:{code: string, address: string, amount: string}) => {
    const {data, error} = await supabase.from('battle').insert({
            invite_code: code,
            eth_amount: amount,
            player1: address,
            started_by: address
        })

    if(data){
        console.log('Invite code sent successfully:', data)
    }
}

export const checkInviteCode = async (code: string) => {
    const {data, error} = await supabase.from('battle').select('*').eq('invite_code', code)

    if(data){
        console.log('Invite code checked successfully:', data)
        return data
    }
}