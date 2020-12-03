import { MongoDBQueryGenerator } from '@query-generator/helpers/persistence/dbms-query-generator/document-based/mongodb/QueryGenerator';

describe('MongoDBQueryGenerator', () => {
  let mongoQueryGenerator: MongoDBQueryGenerator;
  const document = {
    _id: 1,
    name: 'Johnny Content Creator',
    posts: [
      {
        _id: 2,
        value: 'one',
        mentions: [

        ],
      },
      {
        _id: 3,
        value: 'two',
        mentions: [
          {
            _id: 5,
            text: 'apple',
          },
          {
            _id: 6,
            text: 'orange',
          },
        ],
      },
      {
        _id: 4,
        value: 'three',
        mentions: [

        ],
      },
    ],
  };

  const testCases = [
    {
      mutation: { posts: [{ _id: 2, value: 'too' }] },
      kind: '$update',
      expectation: { $update: { 'posts.0.value': 'too' } },
    },
    {
      mutation: { posts: [{ _id: 3, mentions: [{ _id: 5, text: 'pear' }] }] },
      kind: '$update',
      expectation: { $update: { 'posts.1.mentions.0.text': 'pear' } },
    },
    {
      mutation: { posts: [{ value: 'four' }] },
      kind: '$add',
      expectation: { $add: { posts: [{ value: 'four' }] } },
    },
    {
      mutation: { posts: [{ _id: 3, mentions: [{ text: 'banana' }] }] },
      kind: '$add',
      expectation: { $add: { 'posts.1.mentions': [{ text: 'banana' }] } },
    },
    {
      mutation: { posts: [{ _id: 2, _delete: true }] },
      kind: '$remove',
      expectation: { $remove: { 'posts.0': true } },
    },
    {
      mutation: { posts: [{ _id: 3, mentions: [{ _id: 6, _delete: true }] }] },
      kind: '$remove',
      expectation: { $remove: { 'posts.1.mentions.1': true } },
    },
    {
      mutation: {
        posts: [
          { _id: 2, value: 'too' },
          { value: 'four' },
          { _id: 4, _delete: true },
        ],
      },
      kind: 'mixed',
      expectation: {
        $update: { 'posts.0.value': 'too' },
        $add: { posts: [{ value: 'four' }] },
        $remove: { 'posts.2': true },
      },
    },
  ];

  beforeEach(() => {
    mongoQueryGenerator = new MongoDBQueryGenerator();
  });

  describe('#generateUpdateStatement()', () => {
    testCases.forEach((testCase) => {
      it(`*${testCase.kind} case* should return ${JSON.stringify(testCase.expectation)}
       when the value ${JSON.stringify(testCase.mutation)} is provided`, () => {
        expect(mongoQueryGenerator.generateUpdateStatement(document, testCase.mutation)).toEqual(testCase.expectation);
      });
    });
  });
});
