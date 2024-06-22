export const handler = (req,res) =>{
  const {city} = req.params
  return `Cit y Name is ${city}`
}