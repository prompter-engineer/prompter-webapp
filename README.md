# Prompter

## Introduction
Prompter is an open-sourced application, which is designed to optimize prompts efficiently as the alternative to [the OpenAI Playground](https://platform.openai.com/playground). 

This is the sourcecode of frontend, while you can find the backend sourcecode [here](https://github.com/prompter-engineer/prompter-server).

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Run [the server app](https://github.com/prompter-engineer/prompter-server) in advance.

### Installing
A step-by-step series of examples that tell you how to get a development environment running.

1. Clone the repo:
   ```bash
   git clone git@github.com:prompter-engineer/prompter-webapp.git
   ```

2. Navigate to the project directory:
   ```bash
   cd prompter-webapp
   ```

3. Rename `.env.example` to `.env` (`.env.prod.example` to `.env.prod` for production) and fill in the configuration accordingly:
   ```bash
   mv .env.example .env
   vi .env
   ```

4. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

5. Local running:
   ```bash
   npm dev
   ```
   or
   ```bash
   yarn dev
   ```

6. The server should now be running at http://localhost:[port].

## License
This project is licensed under the MIT License.

