import { Editor, type Monaco, type EditorProps } from '@monaco-editor/react'
import { type editor } from 'monaco-editor'

export const FUNCTION_JSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft/2020-12/schema',
  definitions: {
    objectWithProperties: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'array',
            'boolean',
            'integer',
            'null',
            'number',
            'object',
            'string'
          ]
        },
        name: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        parameters: {
          type: 'object',
          required: ['type', 'required', 'properties'],
          properties: {
            type: {
              type: 'string',
              enum: ['object']
            },
            required: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            properties: {
              $ref: '#/definitions/propertiesObject'
            }
          },
          additionalProperties: false
        },
        enum: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        items: {
          oneOf: [
            {
              $ref: '#/definitions/objectWithProperties'
            },
            {
              type: 'string'
            }
          ]
        },
        required: {
          type: 'array',
          items: {
            type: 'string'
          }
        },
        properties: {
          $ref: '#/definitions/propertiesObject'
        },
        $ref: {
          type: 'string'
        }
      },
      additionalProperties: false
    },
    propertiesObject: {
      type: 'object',
      patternProperties: {
        '.*': {
          $ref: '#/definitions/objectWithProperties'
        }
      },
      additionalProperties: false
    }
  },
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['object']
    },
    required: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    properties: {
      $ref: '#/definitions/propertiesObject'
    }
  },
  required: ['type', 'properties'],
  additionalProperties: false
}

const init = (monaco: Monaco) => {
  monaco.editor.defineTheme('prompter', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1a1b1e'
    }
  })
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: 'http://myserver/foo-schema.json',
        fileMatch: ['*'],
        schema: FUNCTION_JSON_SCHEMA
      }
    ]
  })
}

const FunctionEditor: React.FC<EditorProps> = ({ className, options, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    const handleSizeChange = () => {
      const height = Math.min(1000, editor.getContentHeight())
      editor.layout({
        width: containerRef.current!.clientWidth,
        height
      })
    }

    editor.onDidContentSizeChange(handleSizeChange)

    handleSizeChange()
  }

  return (
    <div ref={containerRef} className={className}>
      <Editor
        height='auto'
        theme="prompter"
        language='json'
        beforeMount={init}
        options={Object.assign({
          tabSize: 2,
          fontSize: 14,
          // remove minimap
          minimap: {
            enabled: false
          },
          // remove hightlight select line
          renderLineHighlight: 'none',
          // remove line module
          lineNumbers: 'off',
          // remove fold module
          folding: false,
          glyphMargin: false,
          // remove overview module
          overviewRulerLanes: 0,
          // lineDecorationsWidth: 0,
          // prevent auto layout, manual control it
          automaticLayout: false,
          scrollBeyondLastLine: false,
          // remove scrollbar
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            handleMouseWheel: false
          },
          // word will wrap at the viewport width
          wordWrap: 'on',
          wrappingStrategy: 'advanced'
        }, options)}
        onMount={handleEditorDidMount}
        {...props}
      />
    </div>
  )
}

export default FunctionEditor
