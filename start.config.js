module.exports = {
  apps : [
      {
        name: "whendidiwork",
        script: "./bin/www",
        watch: true,
        env: {
            "NODE_ENV": "production"
        }
      }
  ]
}