import express from "express"
import fs from "fs"

const app = express();
const ROOT_FOLDER = './approutes/';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/*", async(req, res) => {
  const fileUrl  = (ROOT_FOLDER + req.url).replace("//", "/");
  console.log(fileUrl);
  const isFile = fs.existsSync(fileUrl + '.js')
  if (!isFile){
    res.status(404).send("File not found");
    return;
  }


});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
})

