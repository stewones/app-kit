# slush-appkit
Generator for Javascript web applications based on Slush.js

Still in early stages of development

# Install
```sh
npm install -g slush-appkit
```

# Basic structure of application

```
├── README.md
├──.client.build                                <- client deploy
├──.server.build                                <- server deploy
├── gulpfile.ts                                 <- configuration of the gulp tasks
├── karma.conf.js                               <- configuration of the test runner
├── package.json                                <- dependencies of the project
├── protractor.conf.js                          <- e2e tests configuration
├── bin                                         <- deploy and build executables
├── server                                      <- source code of backend application
├── client                                      <- source code of frontend application
│   └── src
│       ├── app
│       │   └── core                            <- appkit core modules
│       │   │   ├── errors
│       │   │   ├── login
│       │   │   ├── page
│       │   │   ├── user
│       │   │   ├── utils
│       │   └── modules                          <- third-party modules
│       │   │   ├── home
│       │   │   │   ├── home.config.js
│       │   │   │   ├── home.component.js
│       │   │   │   ├── home.spec.js
│       │   │   │   ├── home.html
│       │   │   │   ├── home.css
│       │   └── themes         
│       │   │   ├── default
│       │   │   │   ├── theme.html
│       │   ├── index.less
│       │   ├── index.module.js                  <- main module
│       │   ├── vendor.less
│       ├── assets
│       └── index.html                           <- main template
└── .gitignore                                   <- ignored files


<img src="https://app-kit-assets.s3.amazonaws.com/mean-stack.png" width="450">

