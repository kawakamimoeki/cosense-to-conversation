# Cosense to Conversation

![v](https://badgen.net/npm/v/cosense-to-conversation)
![license](https://badgen.net/github/license/kawakamimoeki/cosense-to-conversation)
![download](https://badgen.net/npm/dw/cosense-to-conversation)

A command-line tool and TypeScript library for parsing Cosense(Scrapbox) formatted text into conversation JSON format.

## Setup

Install cosense-to-conversation using `yarn`:

```
yarn add --dev cosense-to-conversation
```

Or `npm`:

```
npm install --save-dev cosense-to-conversation
```

## Usage

### Running from command line

```bash
npx cosense-to-conversation "こんちは[user1.icon]\n    ようこそ！"
```

### Running from Typescript/Javascript

```ts
import { convert } from "cosense-to-conversation";

const input = "こんちは[user1.icon]\n    ようこそ！";
const output = convert(input);
console.log(output);
```

### Output example

```txt
こんにちは[user1.icon]
  はい、こんにちは
どうも
  お元気ですか？[user2.icon]
こんばんは
  おやすみなさい
```

```js
[
  {
    id: 1,
    author: "user1",
    content: "こんにちは",
    parent: null,
    order: 1,
  },
  {
    id: 2,
    author: "user1",
    content: "はい、こんにちは",
    parent: 1,
    order: 1,
  },
  {
    id: 3,
    author: "user1",
    content: "どうも",
    parent: null,
    order: 2,
  },
  {
    id: 4,
    author: "user2",
    content: "お元気ですか？",
    parent: 3,
    order: 1,
  },
  {
    id: 5,
    author: "user1",
    content: "こんばんは",
    parent: null,
    order: 3,
  },
  {
    id: 6,
    author: "user1",
    content: "おやすみなさい",
    parent: 5,
    order: 1,
  },
];
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/kawakamimoeki/consense-to-conversation. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/kawakamimoeki/cosense-to-conversation/blob/main/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Cosense To Conversation project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/kawakamimoeki/cosense-to-conversation/blob/main/CODE_OF_CONDUCT.md).
