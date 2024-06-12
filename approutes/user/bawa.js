export const handler = (req,res) =>{
  if (req.method === "GET"){
    console.log("It was GET")
  }
  
  if (req.method === "POST"){
    console.log("It was POST")
  }
  return "user bawa file"
}