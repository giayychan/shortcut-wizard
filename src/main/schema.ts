import Ajv, { type JSONSchemaType } from 'ajv';
import type { SoftwareShortcut } from '../../@types';

const ajv = new Ajv();
ajv.addFormat('software-key', /^[a-zA-Z0-9_]+$/);

const schema: JSONSchemaType<{
  [key: string]: SoftwareShortcut;
}> = {
  propertyNames: {
    format: 'software-key',
  },
  required: [],
  type: 'object',
  additionalProperties: {
    type: 'object',
    properties: {
      software: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          icon: {
            type: 'object',
            properties: {
              filename: { type: 'string' },
              isCustom: { type: 'boolean' },
              dataUri: { type: 'string', nullable: true },
            },
            required: ['filename', 'isCustom'],
            additionalProperties: false,
          },
        },
        required: ['key', 'icon'],
        additionalProperties: false,
      },
      shortcuts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            isFavorite: { type: 'boolean' },
            hotkeys: {
              type: 'array',
              items: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
          required: ['id', 'description', 'hotkeys', 'isFavorite'],
          additionalProperties: false,
        },
      },
      createdDate: {
        type: 'string',
      },
    },
    required: ['software', 'shortcuts', 'createdDate'],
    additionalProperties: false,
  },
};

const validate = ajv.compile(schema);

const shortcutValidation = (softwareShortcut: SoftwareShortcut) => {
  return new Promise<void>((resolve, reject) => {
    const parentSchema = {
      [softwareShortcut.software.key]: softwareShortcut,
    };
    const result = validate(parentSchema);
    if (result) {
      resolve();
    } else {
      reject(validate.errors);
    }
  });
};

export default shortcutValidation;

// @ts-ignore
// const store = new Store<SoftwareShortcut[]>({ schema });

// export default store;
