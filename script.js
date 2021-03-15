require("chromedriver");

//const { fstat } = require("node:fs");
let fs = require('fs');
const wd = require("selenium-webdriver");
const browser = new wd.Builder().forBrowser("chrome").build();

async function main(){
    let urls = [];
    let finalData = [];

    await browser.get("https://github.com/topics");
    let tags = await browser.findElements(wd.By.css(".topic-box.position-relative.hover-grow.height-full.text-center.border.color-border-secondary.rounded.color-bg-primary.p-5"))
    for(let i=0;i<tags.length;i++){
        let tag = tags[i];
        let url = await tag.findElement(wd.By.css("a")).getAttribute("href")
        urls.push(url);
        finalData.push({topicURL: url});
        
    }
    
    for(let j=0;j<finalData.length;j++){
        
        await browser.get(finalData[j].topicURL);
         let tags = await browser.findElements(wd.By.css(".text-bold"))
         finalData[j]["Projects"] = [];
        for(let i=1;i<tags.length;i++){
            if(i>=9){
                break;
            }
            let link =  await tags[i].getAttribute("href");
            finalData[j].Projects.push({"projectURL": link});
        }
            //console.log(finalData);
            for(let u=0;u<finalData[j].Projects.length;u++){
            await browser.get(finalData[j].Projects[u].projectURL+"/issues");
            let issues = await browser.findElements(wd.By.css(".Link--primary.v-align-middle.no-underline.h4.js-navigation-open"))
                console.log(issues.length);
            finalData[j].Projects[u]["issues"] = []
            
            let currURL = await browser.getCurrentUrl();
            if(currURL==finalData[j].Projects[u].projectURL+"/issues"){
            for(let is =0;is<issues.length;is++){
                if(is==2){
                    break;
                }
                let heading = await issues[is].getAttribute("innerText");
                let headingURL = await issues[is].getAttribute("href");
                
                console.log(heading)
                finalData[j].Projects[u].issues.push({"heading":heading},{"headingURL":headingURL});
                
                
            }
        }
    }
console.log(j)}


        
        
        fs.writeFileSync("finaldata.json",JSON.stringify(finalData));
        await browser.close() 
    }
    
    // let url = tags[0].findElements(wd.By.css("a")).grtAttribute("href");
    // console.log(url);

    


main();