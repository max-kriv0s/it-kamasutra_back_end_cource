const http = require('http')
const fs = require('fs')

const delay = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

const readFile = (path) => {
    
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err) reject(err)
            else resolve(data) 
        })          
    })
}

const server = http.createServer(async (request, response) => {
    switch (request.url) {
        case '/home': { 
            try {
                const data = await readFile('pages/home1.html')
                response.write(data)
                response.end()        
            } catch {
                response.write('something wrong, 500')
                response.end()        
            }
            break;
        }
        case '/about': {
            await (10000)
            response.write('ABOUT COURSE')
            response.end()
            break;
        }

        default:
            response.write('404 not fount')
            response.end()
    }   
})

server.listen(3003)