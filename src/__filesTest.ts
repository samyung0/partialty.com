/** @satisfies {import('@webcontainer/api').FileSystemTree} */

export default {
  a: {
    directory: {
      b: {
        directory: {
          'testb.js': {
            file: {
              contents: `const fs = require("fs")`,
            },
          },
        },
      },
      'test.js': {
        file: {
          contents: `const fs = require("fs")`,
        },
      },
    },
  },
  'index.js': {
    file: {
      contents: `const express = require('express'); 
const app = express();
const port = 3111;
        
app.use(express.static("public"))
                
app.get('/', (req, res) => {
  console.log("The app received a request")
  res.send('Welcome to a WebContainers app! 🥳');
});

app.get('/user', (req, res) => {
  console.log("The app (user route) received a request")
  res.send('User response');
});
                
app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});`,
    },
  },
  'package.json': {
    file: {
      contents: `{
  "name": "example-app",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon --watch './' index.js"
  }
}`,
    },
  },
};
