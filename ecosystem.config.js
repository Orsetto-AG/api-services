module.exports = {
    apps : [
        {
          name: "orsetto",
          script: "dist/src/app.js",
          instances: "max",
          exec_mode: "cluster",
          env: {
              "PORT": 8000,
              "NODE_ENV": "production"
          }
        }
    ]
  }
  