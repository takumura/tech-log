---
created: 2015-07-12
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/dokuwiki
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> DokuWikiの環境設定を行います。セキュリティ課題の対応も併せて実施します。

## 🧩 手順

管理者ユーザでlogin後、`管理`から環境設定を実施。

### access control管理

defaultで用意されているplaygroundとwikiの二つの名前空間に対して、`@All`のアクセス権を`無し`に設定。

### サイト設定

1. `表示` > `トレース（パンくず）表示数（breadcrumbs）`を`0:非表示`に変更。
2. `表示` > `現在位置の表示（youarehere）`を`ON`に変更。
3. `表示` > `最終編集者の情報として表示する内容（showuseras）`を`ユーザのフルネーム`に変更。
4. `認証` > `DokuWikiの動作を無効にする（disableactions）`に以下を設定。
	- ユーザ登録。
	- 新しいパスワードをセット。
	- ソース閲覧/生データ出力。
5. `高度な設定` > `URLの書き換え（userwrite）`を`1:.htaccess`に変更。
6. `高度な設定` > `URL上の名前空間の区切りにスラッシュを使用（useslash）`を`ON`に変更。

### URLの書き換え

URLの書き換えは、Web.configによるrewrite設定で行います。

```xml frame="code" title="web.config" 
<?xml version="1.0" ?>
<configuration>
    <configSections>
        <sectionGroup name="system.webServer">
            <sectionGroup name="rewrite">
                <section name="rewriteMaps" overrideModeDefault="Allow" />
                <section name="rules" overrideModeDefault="Allow" />
            </sectionGroup>
        </sectionGroup>
    </configSections>
    <system.webServer>
        <security>
            <!-- # This section should be uncommented after -->
            <!-- # installation to secure the installation. -->
            <requestFiltering>
                <denyUrlSequences>
                    <add sequence="README" />
                    <add sequence="VERSION" />
                    <add sequence="COPYING" />
                    <!--<add sequence="conf" />
                    <add sequence="data" />-->
                </denyUrlSequences>
                <fileExtensions>
                    <add fileExtension=".txt" allowed="false" />
                </fileExtensions>
            </requestFiltering>
        </security>
        <directoryBrowse enabled="false" />
        <rewrite>
            <rules>
                <!--# Uncomment these rules if you want to have nice URLs using-->
                <!--# $conf['userewrite'] = 1 - not needed for rewrite mode 2-->
                <rule name="imported rule 01" stopProcessing="true">
                    <match url="^_media/(.*)" ignoreCase="false" />
                    <action type="Rewrite" url="lib/exe/fetch.php?media={R:1}"
                            appendQueryString="true" />
                </rule>
                <rule name="imported rule 02" stopProcessing="true">
                    <match url="^_detail/(.*)" ignoreCase="false" />
                    <action type="Rewrite" url="lib/exe/detail.php?media={R:1}"
                            appendQueryString="true" />
                </rule>
                <rule name="imported rule 03" stopProcessing="true">
                    <match url="^_export/([^/]+)/(.*)" ignoreCase="false" />
                    <action type="Rewrite"
                            url="doku.php?do=export_{R:1}&amp;id={R:2}"
                            appendQueryString="true" />
                </rule>
                <rule name="imported rule 04" stopProcessing="true">
                    <match url="^$" ignoreCase="false" />
                    <action type="Redirect" url="doku.php" />
                </rule>
                <rule name="imported rule 05" stopProcessing="true">
                    <match url="^data/(.*)" ignoreCase="false" />
                    <action type="Redirect" url="doku.php" />
                </rule>
                <rule name="imported rule 06" stopProcessing="true">
                    <match url="^conf/(.*)" ignoreCase="false" />
                    <action type="Redirect" url="doku.php" />
                </rule>
                <rule name="imported rule 07" stopProcessing="true">
                    <match url="(.*)" ignoreCase="false" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsFile"
                             ignoreCase="false" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory"
                             ignoreCase="false" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="doku.php?id={R:1}"
                            appendQueryString="true" />
                </rule>
                <rule name="imported rule 08">
                    <match url="^/index.php$" ignoreCase="false" />
                    <action type="Rewrite" url="doku.php" />
                </rule>
                <rule name="imported rule 09" stopProcessing="true">
                    <match url="^/lib/exe/xmlrpc.php$" ignoreCase="false" />
                    <conditions>
                        <!--# Not all installations will require the following line.  If you do,-->
                        <!--# change "/dokuwiki" to the path to your dokuwiki directory relative-->
                        <!--# to your document root.-->
                        <!--# If you enable DokuWikis XML-RPC interface, you should consider to-->
                        <!--# restrict access to it over HTTPS only! Uncomment the following two-->
                        <!--# rules if your server setup allows HTTPS.-->
                        <add input="{HTTPS}" pattern="^on$" ignoreCase="false"
                             negate="true" />
                    </conditions>
                    <action type="Redirect" redirectType="Permanent"
                            url="https://{SERVER_NAME}{URL}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```
