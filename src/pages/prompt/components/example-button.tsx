import { Button } from '@/components/ui/button'
import Example from '@/assets/icons/example.svg?react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePromptStoreInstance } from '@/store/prompt'
import { type Prompt } from '@/entities/prompt'
import { createBatchConfigId, createCompletionFunctionId, createVaribleId } from '@/lib/prompt'
import { useMessage } from '@/components/message/provider'

const DEFAULT_PARAMETERS = {
  model: 'gpt-3.5-turbo-1106',
  temperature: 1,
  topP: 1,
  n: 1,
  maxTokens: 0,
  frequencyPenalty: 0,
  presencePenalty: 0
}

const examples: Array<{
  name: string
  config: Partial<Prompt>
}> = [
  {
    name: 'Tweet classifier',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You will be provided with a tweet, and your task is to classify its sentiment as positive, neutral, or negative.'
        },
        {
          role: 'user',
          content: 'I loved the new Batman movie!'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: []
    }
  }, {
    name: 'Keywords extractor',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You will be provided with a block of text, and your task is to extract a list of keywords from it.'
        },
        {
          role: 'user',
          content: 'Black-on-black ware is a 20th- and 21st-century pottery tradition developed by the Puebloan Native American ceramic artists in Northern New Mexico. Traditional reduction-fired blackware has been made for centuries by pueblo artists. Black-on-black ware of the past century is produced with a smooth surface, with the designs applied through selective burnishing or the application of refractory slip. Another style involves carving or incising designs and selectively polishing the raised areas. For generations several families from Kha\'po Owingeh and P\'ohwhóge Owingeh pueblos have been making black-on-black ware with the techniques passed down from matriarch potters. Artists from other pueblos have also produced black-on-black ware. Several contemporary artists have created works honoring the pottery of their ancestors.'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: []
    }
  }, {
    name: 'Get weather (with function)',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You are a weather forecaster.'
        },
        {
          role: 'user',
          content: 'What\'s the weather in San Jose tomorrow?'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [
        {
          id: createCompletionFunctionId(),
          name: 'get_weather',
          description: 'Determine weather in my location.',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: [
                  'c',
                  'f'
                ]
              }
            },
            required: [
              'location'
            ]
          },
          mock: '{"temperature":"22","unit":"celsius","description":"Sunny"}'
        }
      ],
      batchConfigs: []
    }
  }, {
    name: 'Get stock price (with function)',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant in stock market matters.'
        },
        {
          role: 'user',
          content: 'Please provide the current stock price of Tesla.'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [
        {
          id: createCompletionFunctionId(),
          name: 'get_stock_price',
          description: 'Get the current stock price',
          parameters: {
            type: 'object',
            properties: {
              symbol: {
                type: 'string',
                description: 'The stock symbol'
              }
            },
            required: [
              'symbol'
            ]
          },
          mock: '{"price":"245.7","currency":"USD"}'
        }
      ],
      batchConfigs: []
    }
  }, {
    name: 'Art appreciation guide (with variables)',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You are an art appreciation guide, helping users explore and understand various forms of art, including painting, sculpture, photography, and more. Discuss the history, techniques, and significance of different art movements and individual works. Encourage users to develop their critical thinking and appreciation for artistic expression.'
        },
        {
          role: 'user',
          content: '{{artwork}} by {{artist}}'
        }
      ],
      variables: [
        {
          id: createVaribleId(),
          key: 'artwork',
          value: 'The Starry Night'
        }, {
          id: createVaribleId(),
          key: 'artist',
          value: 'Vincent van Gogh'
        }
      ],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: []
    }
  }, {
    name: 'English translator (in batch mode)',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You are an English translator tasked with converting user input into fluent, native-level English, regardless of the original language. Please ensure the translations are both concise and accurate.'
        },
        {
          role: 'user',
          content: 'こんにちは'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: [
        {
          id: createBatchConfigId(),
          messages: {
            1: {
              role: 'user',
              content: 'こんにちは'
            }
          }
        }, {
          id: createBatchConfigId(),
          messages: {
            1: {
              role: 'user',
              content: 'Bonne soirée'
            }
          }
        }, {
          id: createBatchConfigId(),
          messages: {
            1: {
              role: 'user',
              content: 'Buon pomeriggio'
            }
          }
        }
      ]
    }
  }, {
    name: 'Morning briefing (parallel function calling)',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: 'Provide a morning briefing including weather in {{city}}, news, and personal schedule.'
        }
      ],
      variables: [
        {
          id: createVaribleId(),
          key: 'city',
          value: 'San Jose'
        }
      ],
      toolChoice: 'auto',
      functions: [
        {
          id: createCompletionFunctionId(),
          name: 'get_current_weather',
          description: 'Get the current weather in a given city.',
          parameters: {
            type: 'object',
            required: [
              'city'
            ],
            properties: {
              city: {
                type: 'string',
                description: 'The city e.g. San Francisco'
              }
            }
          },
          mock: '{"temperature":"22","unit":"celsius","description":"Sunny"}'
        }, {
          id: createCompletionFunctionId(),
          name: 'get_top_news',
          description: 'Fetch today\'s top news headlines from a specified news source.',
          parameters: {
            type: 'object',
            required: [
              'source'
            ],
            properties: {
              source: {
                type: 'string',
                description: 'News source e.g. BBC, CNN'
              }
            }
          },
          mock: '{"headlines":["Global Markets Rally as New Trade Agreements Announced","Breakthrough in Renewable Energy Tech Sparks Investor Interest","Major Advances in AI: New Horizons in Medicine"],"source":"BBC"}'
        }, {
          id: createCompletionFunctionId(),
          name: 'get_calendar_schedule',
          description: 'Retrieve today\'s personal calendar schedule.',
          parameters: {
            type: 'object',
            required: [
              'user_id'
            ],
            properties: {
              user_id: {
                type: 'string',
                description: 'Unique identifier for the user'
              }
            }
          },
          mock: '{"events":[{"time":"09:00 AM","title":"Team Meeting on Zoom","description":"Weekly team synchronization call"},{"time":"12:30 PM","title":"Lunch with Sarah","description":"Meeting Sarah for lunch at The Green Cafe"},{"time":"03:00 PM","title":"Dentist Appointment","description":"Routine dental check-up at Pearl Dental Clinic"}],"user_id":"12345"}'
        }
      ],
      batchConfigs: []
    }
  }, {
    name: 'Parse unstructured data to JSON format',
    config: {
      parameters: {
        ...DEFAULT_PARAMETERS,
        responseFormat: 'json_object'
      },
      messages: [
        {
          role: 'system',
          content: 'You will be provided with unstructured data, and your task is to parse it into JSON format.'
        },
        {
          role: 'user',
          content: 'There are many fruits that were found on the recently discovered planet Goocrux. There are neoskizzles that grow there, which are purple and taste like candy. There are also loheckles, which are a grayish blue fruit and are very tart, a little bit like a lemon. Pounits are a bright green color and are more savory than sweet. There are also plenty of loopnovas which are a neon pink flavor and taste like cotton candy. Finally, there are fruits called glowls, which have a very sour and bitter taste which is acidic and caustic, and a pale orange tinge to them.'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: []
    }
  }, {
    name: 'Math tutor - Chain of Thought (with seed)',
    config: {
      parameters: {
        ...DEFAULT_PARAMETERS,
        seed: 12345678
      },
      messages: [
        {
          role: 'system',
          content: 'You are a math tutor who helps students of all levels understand and solve mathematical problems. Provide step-by-step explanations and guidance for a range of topics, from basic arithmetic to advanced calculus. Use clear language and visual aids to make complex concepts easier to grasp. Please think step by step.'
        },
        {
          role: 'user',
          content: 'calculate 99x99'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: []
    }
  }, {
    name: 'Amazing grammar corrector (with few-shot)',
    config: {
      parameters: DEFAULT_PARAMETERS,
      messages: [
        {
          role: 'system',
          content: `You’re a GPT that takes a very, very badly typed text as an input and writes it in a proper way. The input text is very bad because the user is trying to type as fast  as he cans with 200-300 words per minute.
You never comment anything. You don’t chat. You just repeat the inputted text corrected.
Also you are multilingual. You detect the language and correct it.

===
Example 1:
User input: this is a test that ai em makign sogt aht ai can test this out. i just want to see if this is sometihnf that will work.
Assistant output: This is a test that i am making so that I can test this out. I just want to see if this is something that will work.

Example 2:
User input: wow ts id smaing! ai cant believe this actualy work!
Assistant output: Wow, this is amazing! I can't believe this actually works!
===`
        },
        {
          role: 'user',
          content: 'wat u men bi tis? it totly nosens.'
        }
      ],
      variables: [],
      toolChoice: 'auto',
      functions: [],
      batchConfigs: []
    }
  }
]

const ExampleButton = () => {
  const promptStore = usePromptStoreInstance()
  const message = useMessage()

  const onCoverPrompt = (config: Partial<Prompt>) => {
    message.open({
      title: 'Warning',
      content: 'Loading this example will overwrite all existing configurations, including parameters, messages, variables, and functions. Are you sure you want to proceed?',
      onConfirm: () => {
        promptStore.setState(old => ({
          prompt: {
            ...old.prompt,
            ...config
          }
        }))
        const messageButtonEl = document.querySelector('#configuration-tabs__prompt')
        if (!messageButtonEl) return
        messageButtonEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='h-[30px]' size='sm'>
          <Example className='mr-1 h-4 w-4' />
          Examples
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {examples.map(example => (
          <DropdownMenuItem key={example.name} onClick={() => { onCoverPrompt(example.config) }}>{example.name}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExampleButton
