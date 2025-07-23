const Joi = require('joi');

// Common definitions
const helpCategories = [
  'JavaScript',
  'HTML-CSS',
  'Python',
  'Backend Development',
  'C-Sharp',
  'English',
  'Odin',
  'Euler',
  'Rosetta'
];

const blockLayouts = [
  'challenge-list',
  'challenge-grid',
  'dialogue-grid',
  'link',
  'project-list',
  'legacy-challenge-list',
  'legacy-link',
  'legacy-challenge-grid'
];

const blockTypes = [
  'lecture',
  'workshop',
  'lab',
  'review',
  'quiz',
  'exam'
];

const challengeOrderSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.base': '"id" should be a type of string',
    'any.required': '"id" is required in challengeOrder'
  }),
  title: Joi.string().required().messages({
    'string.base': '"title" should be a type of string',
    'any.required': '"title" is required in challengeOrder'
  })
});

const blockSchema = Joi.object({
  desc: Joi.array().min(1).required().messages({
    'array.base': '"desc" should be an array',
    'array.min': '"desc" must contain at least one item',
    'any.required': '"desc" is required'
  }),
  challenges: Joi.object({
    name: Joi.string().required(),
    isUpcomingChange: Joi.bool().required(),
    usesMultifileEditor: Joi.bool().optional(),
    hasEditableBoundaries: Joi.bool().optional(),
    dashedName: Joi.string().required(),
    helpCategory: Joi.string().valid(...helpCategories).required(),
    order: Joi.number().when('superBlock', {
      is: 'full-stack-developer',
      then: Joi.forbidden(),
      otherwise: Joi.required()
    }),
    template: Joi.string().allow(''),
    required: Joi.array().items(Joi.string()).optional(),
    superBlock: Joi.string().required(),
    blockLayout: Joi.string().valid(...blockLayouts).required(),
    blockType: Joi.string().valid(...blockTypes).when('superBlock', {
      is: 'full-stack-developer',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    challengeOrder: Joi.array().items(challengeOrderSchema),
    disableLoopProtectTests: Joi.bool(),
    disableLoopProtectPreview: Joi.bool(),
    superOrder: Joi.number().optional()
  }).required()
});

const subSchema = Joi.object({
  intro: Joi.array().items(Joi.string()).optional(),
  blocks: Joi.object().pattern(
    Joi.string(),
    blockSchema
  )
});

const schema = Joi.object().pattern(
  Joi.string(),
  subSchema
);

const availableSuperBlocksSchema = Joi.object({
  superblocks: Joi.array().items(
    Joi.object({
      dashedName: Joi.string().required(),
      title: Joi.string().required(),
      public: Joi.bool().required()
    })
  )
});

exports.superblockSchemaValidator = () => superblock =>
  schema.validate(superblock, { abortEarly: false });

exports.availableSuperBlocksValidator = () => data =>
  availableSuperBlocksSchema.validate(data, { abortEarly: false });
