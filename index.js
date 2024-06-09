import express from "express"
import fs from "fs"

const app = express();
const ROOT_FOLDER = './approutes/';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function handleRegularRoutes(fileUrl, req ,res){
  try {
   const module = await import(fileUrl) 
   
  } catch (error) {
   console.log(error) 
   res.statusCode = 404;
  }
}

app.all("/*", async(req, res) => {
  let fileUrl  = (ROOT_FOLDER + req.url).replace("//", "/");
  console.log(fileUrl);
  let isFile = fs.existsSync(fileUrl + '.js')

  if (!isFile){
    fileUrl += "/index.js"
  }else{
    fileUrl += ".js"
  }

  console.log(fileUrl)

  let result = await handleRegularRoutes(fileUrl, req,res);

  if(res === false){
    return res.send("Route not found")
  }else{
    return res.send(result)
  }

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

