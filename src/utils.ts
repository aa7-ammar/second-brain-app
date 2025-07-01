export const random = (len : number)=>{
    const options:string = "abcdefghijklmnopqrstuvwxyz1234567890";
    const length : number = options.length;
    let ans : string = "";
    for(let i=0 ; i<len ; i++){
        ans += options[Math.floor(Math.random()*length)];
    }

    return ans;
}