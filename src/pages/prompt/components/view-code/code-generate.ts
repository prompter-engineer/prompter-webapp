import { type OpenAIChatCompletionRequest } from '@/entities/openai'

const stringifyWithIndent = (input: any, indent = 0) => {
  const space = ' '.repeat(indent)
  if (typeof input === 'object') {
    return JSON.stringify(input, null, 2)
      .split('\n')
      .map((str, i) => {
        if (i === 0) return str
        return `${space}${str}`
      })
      .join('\n')
  } else if (typeof input === 'string') {
    return `"${input}"`
  }
  return input
}

export const generatecURLCode = (request: OpenAIChatCompletionRequest) => {
  let code = '## This is for Zsh/Bash on Unix-like shells. For Windows CMD, adjust the format accordingly.\n'
  code += 'curl -X "POST" https://api.openai.com/v1/chat/completions \\\n'
  code += '  -H "Content-Type: application/json" \\\n'
  code += '  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n'
  code += `  -d '${stringifyWithIndent(request).replace(/(')/g, '\'\\\'\'')}'`
  return code
}

export const generateJSONCode = (request: OpenAIChatCompletionRequest) => {
  return stringifyWithIndent(request)
}

export const generateNodeCode = (request: OpenAIChatCompletionRequest) => {
  let code = '// Install the Node OpenAI library:\n'
  code += '// `npm install --save openai` or `yarn add openai`\n\n'
  code += 'import OpenAI from "openai";\n\n'
  code += 'const openai = new OpenAI({\n'
  code += '  apiKey: process.env.OPENAI_API_KEY,\n'
  code += '});\n\n'
  code += `const response = await openai.chat.completions.create(${stringifyWithIndent(request)});`
  return code
}

export const generatePythonCode = (request: OpenAIChatCompletionRequest) => {
  let code = '# Install the Python OpenAI library:\n'
  code += '# `pip install openai`\n\n'
  code += 'from openai import OpenAI\n\n'
  code += 'client = OpenAI()\n\n'
  code += 'response = client.chat.completions.create(\n'
  const keys = Object.keys(request) as Array<keyof OpenAIChatCompletionRequest>
  keys.forEach((key, index) => {
    const value = request[key]
    code += `  ${key}=${stringifyWithIndent(value, 2)}`
    if (index < keys.length - 1) {
      code += ','
    }
    code += '\n'
  })
  code += ')'

  return code
}
