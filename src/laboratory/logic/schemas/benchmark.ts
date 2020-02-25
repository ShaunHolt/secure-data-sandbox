// Schema generated with
//   typescript-json-schema tsconfig.json IBenchmark --required
export const benchmarkSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    ICandidateStage: {
      type: 'object',
    },
    IContainerStage: {
      properties: {
        image: {
          type: 'string',
        },
      },
      required: ['image'],
      type: 'object',
    },
    IPipeline: {
      properties: {
        mode: {
          type: 'string',
        },
        stages: {
          items: {
            anyOf: [
              {
                $ref: '#/definitions/ICandidateStage',
              },
              {
                $ref: '#/definitions/IContainerStage',
              },
            ],
          },
          type: 'array',
        },
      },
      required: ['mode', 'stages'],
      type: 'object',
    },
  },
  properties: {
    author: {
      type: 'string',
    },
    createdAt: {
      description: 'Enables basic storage and retrieval of dates and times.',
      format: 'date-time',
      type: 'object',
    },
    name: {
      type: 'string',
    },
    pipelines: {
      items: {
        $ref: '#/definitions/IPipeline',
      },
      type: 'array',
    },
    updatedAt: {
      description: 'Enables basic storage and retrieval of dates and times.',
      format: 'date-time',
      type: 'object',
    },
    version: {
      type: 'string',
    },
  },
  required: ['author', 'name', 'pipelines', 'version'],
  type: 'object',
};