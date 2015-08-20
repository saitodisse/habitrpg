/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */
// Adds the systems that shape your system
systems({
  habitrpg: {
    depends: ['mongo'],
    image: {"dockerfile": "Azkfile.Dockerfile"},
    provision: [
      "npm install",
      "npm install nodemon",
      "node_modules/.bin/bower install --allow-root",
      "node_modules/.bin/grunt build:prod",
    ],
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "node_modules/.bin/grunt nodemon",
    wait: { retry: 30, timeout: 1000 },
    mounts: {
      '/azk/#{manifest.dir}': sync("."),
      '/azk/#{manifest.dir}/node_modules': persistent("#{system.name}/node_modules"),
      '/azk/#{manifest.dir}/bower_components': persistent("#{system.name}/bower_components"),
      '/azk/#{manifest.dir}/website/build': persistent("#{system.name}/website/build"),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      // exports global variables
      http: "3000/tcp",
    },
    envs: {
      // Make sure that the PORT value is the same as the one
      // in ports/http below, and that it's also the same
      // if you're setting it in a .env file
      NODE_ENV: "dev",
      PORT: "3000",
      HOST: "0.0.0.0",
    },
  },

  mongo: {
    image : { docker: "azukiapp/mongodb" },
    scalable: false,
    wait: { retry: 60, timeout: 1000 },
    // Mounts folders to assigned paths
    mounts: {
      // equivalent persistent_folders
      '/data/db': persistent('mongodb-#{manifest.dir}'),
    },
    ports: {
      http: "28017/tcp",
      data: "27017:27017/tcp",
    },
    http      : {
      // mongodb.azk.dev
      domains: [ "#{system.name}.#{azk.default_domain}" ],
    },
    export_envs        : {
      NODE_DB_URI: "mongodb://#{net.host}:#{net.port[27017]}/#{manifest.dir}_development",
      // LCB_DATABASE_URI: "mongodb://mongo/letschat",
      LCB_DATABASE_URI: "mongodb://#{net.host}:#{net.port[27017]}/#{manifest.dir}_development",
    },
  },

  deploy: {
    image: {"docker": "azukiapp/deploy-digitalocean"},
    mounts: {

      // your files on remote machine
      // will be on /home/git folder
      "/azk/deploy/src":  path("."),

      // will use your public key on server
      // that way you can connect with:
      // $ ssh git@REMOTE.IP
      // $ bash
      "/azk/deploy/.ssh": path("#{process.env.HOME}/.ssh")
    },

    // this is not a server
    // just call with azk shell deploy
    scalable: {"default": 0, "limit": 0},

    envs: {
      GIT_CHECKOUT_COMMIT_BRANCH_TAG: 'azkfile',
      AZK_RESTART_COMMAND: 'azk restart -Rvv',
      RUN_SETUP: 'true',
      RUN_CONFIGURE: 'true',
      RUN_DEPLOY: 'true',
    }
  },
  "fast-deploy": {
    extends: 'deploy',
    envs: {
      GIT_CHECKOUT_COMMIT_BRANCH_TAG: 'azkfile',
      AZK_RESTART_COMMAND: 'azk restart -Rvv',
      RUN_SETUP: 'false',
      RUN_CONFIGURE: 'false',
      RUN_DEPLOY: 'true',
    }
  },
});
