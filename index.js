const http = require('http')
const url = require("url");
const path = require("path");
const StringDecoder = require("string_decoder").StringDecoder;
const port = process.env.PORT || 3000;

const server = http.createServer((req,res)=>{
    const parsedURL = url.parse(req.url,true)
    const path = parsedURL.pathname;
    const method = req.method;
    const trimmedPath1 = path.replace(/^\/+|\/+$/g, "");
    const trimmedPath= trimmedPath1.replace(/%0A/,"")
    const headers = req.headers;
    const decoder = new StringDecoder("utf-8");
    let buffer = "";

    req.on("data",(data)=>{
        buffer=buffer+decoder.write(data)
    })

    req.on("end",()=>{
        buffer=buffer+decoder.end()
        const chosen= trimmedPath === "test" && method=="POST" ? router.test :
        router.notfound

        const data={
            trimmedPath,
            method,
            headers,
            payload: parseJSONToObject(buffer)
        }


        chosen(data).then(({statusCode,payload,contentType})=>{
            let payloadString=''
            statusCode = typeof statusCode === "number" ? statusCode : 200;
            if (contentType == "json") {
                res.setHeader("Content-Type", "application/json");
                payload = typeof payload === "object" || "string" ? payload : {};
                payloadString = JSON.stringify(payload);
              }


      res.writeHead(statusCode);
      res.end(payloadString);
        })

    })
})


server.listen(port, () => {
    console.log("running");
  });
  



parseJSONToObject = function (str) {
    try {
      var obj = JSON.parse(str);
      return obj;
    } catch (e) {
      return {};
    }
  };


let route={

}


route.notfound = (data) => {
    return new Promise((resolve, reject) => {
        resolve({
            statusCode: 400,
            payload: {
                error:"not found"
            },
            contentType: "json",
          });
    });
  };
  

route.test=(data)=>{
    return new Promise((resolve,reject)=>{
            const result = testFunction(data.payload)

            if(result.error){
        
                resolve({
                    statusCode: 400,
                    payload: {result,
                        response:'key not string_to_cut'
                    },
                    contentType: "json",
                  });
            }

            else{
                const info ={
                    return_string:result.final
                }

                resolve({
                    statusCode: 200,
                    payload: info,
                    contentType: "json",
                  });

            }
    })
}

  const router={
      test:route.test,
      notfound:route.notfound
  }

  const testFunction = (test)=>{
      if(!test.string_to_cut){
          return {
              error:true
          }
      }
     
          
        const final= findThirdLetter(test.string_to_cut)
        return{
            error:false,
            final
        }
      
  }

  const findThirdLetter = (data)=>{
      let temp=""
       if(data.length<3){
      temp="text lower than 3 characters"
                return temp

      }
      for(let i=2;i<data.length;i=i+3){
          temp=temp+data.charAt(i)
      }
      return temp
  }