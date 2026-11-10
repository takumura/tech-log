---
created: 2026-11-04
updated: 2026-11-04
type: evergreen
category: article
tags:
  - reference
  - tech/ai/llm
  - tech/ai/strata
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Strata terminalのセットアップとパラメータ設定を確認します。

## 🧩 詳細

### Strata terminalのインストール

windows terminalから以下のスクリプトを実行。

```sh frame="none"
irm https://github.com/Niko1221/Strata/releases/latest/download/install.ps1 | iex
```

### Strata terminalの起動とモデルのダウンロード

windows terminalから起動用の`strata`コマンドを実行。

```sh frame="none"
strata launch
```

セットアップするモデルとして`Gyro-M`や`Qwen3.8FN IQ3_XXS`も試してみたものの、私の環境ではパフォーマンス不足でした。最適な`Qwen3.8FN IQ2_XS`を選択します。

- model: `Qwen3.8FN IQ2_XS`
- model file location: `%LOCALAPPDATA%\Strata\Strata-data`（初期値）
- context: `128K`
- picture: YesとNoの2つのプロファイルを作成します。
- drafting: `Auto (DFlash2)`
- parallel: `1`
- Tuning: 状況次第で`skip`または`Thorough`を選択
- Advance: 後で手動で調整するので初回は初期値のままで良い
- Access
	- `This computer only`
	- `port:1234`
	- `API key:off （My local networkに設定する際は要設定）`

設定が完了してstrataを起動するとmodelのダウンロードが始まります。

### パラメーターjsonの設定

jsonファイルを修正し、RTX5060 8GB、SYS RAM 48GBに最適なパラメータを設定します。

- %appdata%\Strata\launch-presets\iq2_xs-128k.json

```diff title="iq2_xs-128k.json"
{
  "access": "local",
  "api_key": null,
  "context": 131072,
  "created": "2026-11-04 16:47:01.599362",
  "data_dir": null,
  "drafting": null,
  "dsv41_package": null,
  "extra": {
+    "--adapt-async": "1",
+    "--control-vector-layer-range": "4 44",
+    "--control-vector-scaled": "C:\\Users\\picas\\AppData\\Local\\Strata\\terminal\\current\\data\\experimental-speed-projection\\Qwen3.8-Flash-Next-experimental-speed-projection.gguf:1.0",
+    "--conversation-cache-mib": "4096",
+    "--conversation-cache-slots": "2",
+    "--cvec-dir": "per-layer",
+    "--cvec-mode": "project",
+    "--draft": "dflash2",
+    "--kv": "k8v4",
+    "--kv-resident": "16384",
+    "--mtp": "off",
+    "--pool-workers": "6",
+    "--prefill": "8192",
+    "--short-read": "0",
+    "--spec-min-p": "0.70",
+    "--vram-reserve-mib": "300",
+    "STRATA_PIN_BY_NEED": "on",
+    "STRATA_ROUTE_PRIOR": "0",
+    "STRATA_ROUTE_TAIL_SKIP": "0",
+    "STRATA_SPLIT_OWN": "1"
  },
  "family": "qwen",
  "gpu_roles": null,
  "gpus": null,
  "kv": null,
  "last_used": "2026-11-04 23:27:58.038675",
  "model": "IQ2_XS",
  "model_path": null,
  "mtp": null,
  "name": "IQ2_XS-128K",
  "no_key": false,
  "parallel": null,
  "port": 1234,
  "schema": "strata.launch/1",
  "speed": null,
  "split_engine": null,
  "tune": "skip",
  "tune_allow_small": false,
  "tuned_at": null,
  "tuned_preset": null,
  "vision": "off"
}
```

設定後に`strata launch`コマンドでstrataを起動すると以下の2ファイルが生成されます。
- `%localappdata%\Strata\install\strata-iq2_xs.json`
- `%localappdata%\Strata\launch\iq2_xs-128k.json`

sampling値はargに設定しても効果が無いため、生成された上記2ファイルに追記を行います。

```diff title="strata-iq2_xs.json"
...中略
 "gpus_asked": true,
+ "sampling": {
+  "temperature": 0.6,
+  "top_p": 0.95,
+  "top_k": 20,
+  "min_p": 0.05
+ },
 "args_written": [
 ],
...
```

### パフォーマンス検証

windows terminalからベンチマーク用の`strata`コマンドを実行。

```sh frame="none"
strata bench run --profile iq2_xs_128K
```

結果ファイルはユーザフォルダの`bench-results`に作成されます。

## 🔗 参考資料

- [Strata - Github](https://github.com/Niko1221/Strata)

