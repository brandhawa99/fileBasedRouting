import express from "express"
import fs from "fs"

const app = express();
const ROOT_FOLDER = './approutes/';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function handleRegularRoutes(fileUrl, req ,res){
  try {
    const module = await import(fileUrl);
    let data = null;
    const httpVerb = req.method.toLowerCase()
    if(module[httpVerb]){
      data = module[httpVerb](req,res);
    }else{
      data = module.handler(req,res);
    }
    return data
  } catch (error) {
    console.log(error) 
    res.statusCode = 404;
    return false;
  }
}

async function handleDynamicRoutes(folder){
  try {
    const files = await fs.promises.readdir(folder);
    const dynamicFileName = await files.find( fname => {
      return fname.match(/\[[a-zA-Z0-9\._]+\]/)
    })
    return {
      file : dynamicFileName,
      param : dynamicFileName.replace("[","").replace("].js","")
    }
  } catch (error) {
    console.log(error)
    return null
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



  let result = await handleRegularRoutes(fileUrl, req, res);

  if(result === false){
    const pathArray  = (ROOT_FOLDER + req.url).replace('//','/').split('/');
    console.log(pathArray)
    const lastElement = pathArray.pop();
    const folderToCheck = pathArray.join("/")   
    const dynamicHandler = await handleDynamicRoutes(folderToCheck)


    // return res.send("Route not found")
    if(!dynamicHandler){
      return res.send("Route not found")
    }

    req.params = {...req.params, [dynamicHandler.param]: lastElement}
    console.log([folderToCheck,dynamicHandler.file].join('/'));
    console.log(req.params)
    result = await handleRegularRoutes([folderToCheck,dynamicHandler.file].join("/"),req,res);
    console.log(result)
    res.send(result)
  }else{
    return res.send(result)
  }

});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

