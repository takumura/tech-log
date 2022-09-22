---
title: "AngularプロジェクトへのFluent UI導入検討"
date: "2022-01-07"
category: "csharp"
tag: ["fluent ui","angular"]
---

これまでずっとデザインシステムに[Angular Material](https://material.angular.io/)を使ってきたのですが、今回は新しいものということで、最近MS OfficeやTeamsで見かける[Fluent UIのAngularでも使えるWeb Component](https://docs.microsoft.com/en-us/fluent-ui/web-components/integrations/angular)の導入を検討しました。

結論としては、まだまだ未成熟で私の力では実践投入できなそうだったので導入を断念しました。開発の進捗状況を見つつ、仕上がってきたら導入を再検討したいです。

### 検討時に行った作業

元々UI Fabricと呼ばれていたころはReact向けライブラリがメインだった感があり、今も一番充実しているのはFluent UI Reactのようです。[公式Github](https://github.com/microsoft/fluentui)によると、Office系で使われている`Fluent UI React`、Teamsで使われている`Fluent UI React Northstar`、Edgeで使われている`Fluent UI Web Component`の3種類があるようです。このうちAngularで利用できるのは`Fluent UI Web Component`です。

|   | React | React Northstar | Web Components |
|---| ----- | --------------- | -------------- |
| **Overview**    | Mature, refreshing with new concepts from react-northstar. | Newer, has concepts we're iterating on. | Web Component implementation of Fluent UI. |
| **Used By**     | Office| Teams | Edge |

説明に従い、3つのモジュール(`@fluentui/web-components`、`@microsoft/fast-element`、`lodash-es`)をインストールします。

``` powershell
> yarn add @fluentui/web-components @microsoft/fast-element lodash-es
yarn add v1.22.15
[1/4] Resolving packages...
[2/4] Fetching packages...
...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Saved lockfile.
success Saved 8 new dependencies.
info Direct dependencies
├─ @fluentui/web-components@2.2.0
├─ @microsoft/fast-element@1.6.2
└─ lodash-es@4.17.21
info All dependencies
├─ @fluentui/web-components@2.2.0
├─ @microsoft/fast-colors@5.1.4
├─ @microsoft/fast-element@1.6.2
├─ @microsoft/fast-foundation@2.29.0
├─ @microsoft/fast-web-utilities@5.0.2
├─ exenv-es6@1.0.0
├─ lodash-es@4.17.21
└─ tabbable@5.2.1
Done in 40.64s.
```

その後も説明に従いmain.tsに以下の一行を追加したところ、build errorが発生するようになってしまいました。
`provideFluentDesignSystem().register(fluentDesignSystemProvider());`

[FAST designのissue](https://github.com/microsoft/fast/issues/5198)によると、typescriptのversionが4.3.5以上だとこのエラーが発生するとのこと。暫定の回避手段は`skipLibCheck: true`を`tsconfig.json`に追加することでした。

``` diff
/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2017",
    "module": "es2020",
    "lib": ["es2020", "dom"],
+    "skipLibCheck": true
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

これでdebugが実行できるようになり、Fluent UIのスタイルが適用されるようになります。ただし背景色やテキスト色は自身で設定する必要があるようです。

``` css
body {
  background: var(--fill-color);
  color: var(--neutral-foreground-rest);
}
```

## 関連項目

- [Use Fluent UI Web Components with Angular](https://docs.microsoft.com/en-us/fluent-ui/web-components/integrations/angular)
- [FAST color explorer](https://color.fast.design/)
- [Using FAST to Rebrand an Existing Website](https://github.com/microsoft/fast/tree/master/examples/site-rebrand-tutorial)
