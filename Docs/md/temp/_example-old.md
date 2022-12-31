---
title: 'Old Markdown Example'
date: '2019-04-13'
category: 'Markdown'
tag:
- template
- test
---

## How to use Markdown for writing Docs

Picked up sample markdown syntax document from [How to use Markdown for writing Docs - Microsoft Docs](https://docs.microsoft.com/en-us/contribute/how-to-write-use-markdown#ops-custom-markdown-extensions)

## Markdown basics

### Headings

To create a heading, you use a hash mark (#), as follows:

```markdown
# This is heading 1
## This is heading 2
### This is heading 3
#### This is heading 4
```

Headings should be done using atx-style, that is, use 1-6 hash characters (#) at the start of the line to indicate a heading, corresponding to HTML headings levels H1 through H6. Examples of first- through fourth-level headers are used above.

There **must** be only one first-level heading (H1) in your topic, which will be displayed as the on-page title.

If your heading finishes with a `#` character, you need to add an extra `#` character in the end in order for the title to render correctly. For example, `# Async Programming in F# #`.

Second-level headings will generate the on-page TOC that appears in the "In this article" section underneath the on-page title.

### Bold and italic text

To format text as **bold**, you enclose it in two asterisks:

```markdown
This text is **bold**.
```

To format text as _italic_, you enclose it in a single asterisk:

```markdown
This text is *italic*.
```

To format text as both **_bold and italic_**, you enclose it in three asterisks:

```markdown
This is text is both ***bold and italic***.
```

### Blockquotes

Blockquotes are created using the `>` character:

```markdown
> The drought had lasted now for ten million years, and the reign of the terrible lizards had long since ended. Here on the Equator, in the continent which would one day be known as Africa, the battle for existence had reached a new climax of ferocity, and the victor was not yet in sight. In this barren and desiccated land, only the small or the swift or the fierce could flourish, or even hope to survive.
```

The preceding example renders as follows:

> The drought had lasted now for ten million years, and the reign of the terrible lizards had long since ended. Here on the Equator, in the continent which would one day be known as Africa, the battle for existence had reached a new climax of ferocity, and the victor was not yet in sight. In this barren and desiccated land, only the small or the swift or the fierce could flourish, or even hope to survive.

### Lists

#### Unordered list

To format an unordered/bulleted list, you can use either asterisks or dashes. For example, the following Markdown:

```markdown
- List item 1
- List item 2
- List item 3
```

will be rendered as:

-   List item 1
-   List item 2
-   List item 3

To nest a list within another list, indent the child list items. For example, the following Markdown:

```markdown
- List item 1
  - List item A
  - List item B
- List item 2
```

will be rendered as:

-   List item 1
    -   List item A
    -   List item B
-   List item 2

#### Ordered list

To format an ordered/stepwise list, you use corresponding numbers. For example, the following Markdown:

```markdown
1. First instruction
1. Second instruction
1. Third instruction
```

will be rendered as:

1.  First instruction
2.  Second instruction
3.  Third instruction

To nest a list within another list, indent the child list items. For example, the following Markdown:

```markdown
1. First instruction
   1. Sub-instruction
   1. Sub-instruction
1. Second instruction
```

will be rendered as:

1.  First instruction
    1.  Sub-instruction
    2.  Sub-instruction
2.  Second instruction

Note that we use '1.' for all entries. It makes diffs easier to review when later updates include new steps or remove existing steps.

### Tables

Tables are not part of the core Markdown specification, but GFM supports them. You can create tables by using the pipe (|) and hyphen (-) characters. Hyphens create each column's header, while pipes separate each column. Include a blank line before your table so it's rendered correctly.

For example, the following Markdown:

```markdown
| Fun                  | With                 | Tables          |
| :------------------- | -------------------: |:---------------:|
| left-aligned column  | right-aligned column | centered column |
| $100                 | $100                 | $100            |
| $10                  | $10                  | $10             |
| $1                   | $1                   | $1              |
```

will be rendered as:

| Fun                 |                 With |      Tables     |
| :------------------ | -------------------: | :-------------: |
| left-aligned column | right-aligned column | centered column |
| $100                |                 $100 |       $100      |
| $10                 |                  $10 |       $10       |
| $1                  |                   $1 |        $1       |

For more information on creating tables, see:

-   GitHub's [Organizing information with tables](https://help.github.com/articles/organizing-information-with-tables/).
-   The [Markdown Tables Generator](https://www.tablesgenerator.com/markdown_tables) web app.
-   [Adam Pritchard's Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#wiki-tables).
-   [Michel Fortin's Markdown Extra](https://michelf.ca/projects/php-markdown/extra/#table).
-   [Convert HTML tables to Markdown](https://jmalarcon.github.io/markdowntables/).

### Links

The Markdown syntax for an inline link consists of the `[link text]` portion, which is the text that will be hyperlinked, followed by the `(file-name.md)` portion, which is the URL or file name that's being linked to:

 `[link text](file-name.md)`

For more information on linking, see:

-   The [Markdown syntax guide](https://daringfireball.net/projects/markdown/syntax#link) for details on Markdown's base linking support.
-   The [Links](how-to-write-links.md) section of this guide for details on the additional linking syntax that Markdig provides.

### Internal Links

For anguler's limitation, we need to introduce another syntax to show internal link(link within the site).

 `[link text](link_path)<!--rehype:class=internal-link-->`

 `internal-link` is the css class to show internal link as a different style compare to external links.

  Following link: [Move to Example](doc/example)<!--rehype:class=internal-link--> will move to initial home screen of this site

  another example for own link [Move to Old Example(own screen)](doc/example-old)<!--rehype:class=internal-link-->

### Code snippets

Markdown supports the placement of code snippets both inline in a sentence and as a separate "fenced" block between sentences. For details, see:

-   [Markdown's native support for code blocks](https://daringfireball.net/projects/markdown/syntax#precode)
-   [GFM support for code fencing and syntax highlighting](https://help.github.com/articles/creating-and-highlighting-code-blocks/)

Fenced code blocks are an easy way to enable syntax highlighting for your code snippets. The general format for fenced code blocks is:

    ```alias
    ...
    your code goes in here
    ...
    ```

The alias after the initial three backtick (\`) characters defines the syntax highlighting to be used. The following is a list of commonly used programming languages in Docs content and the matching label:

These languages have friendly name support and most have language highlighting.

| Name                                | Markdown Label     |
| ----------------------------------- | ------------------ |
| .NET Console                        | dotnetcli          |
| ASP.NET (C#)                        | aspx-csharp        |
| ASP.NET (VB)                        | aspx-vb            |
| AzCopy                              | azcopy             |
| Azure CLI                           | azurecli           |
| Azure PowerShell                    | azurepowershell    |
| Bash                                | bash               |
| C++                                 | cpp                |
| C++/CX                              | cppcx              |
| C++/WinRT                           | cppwinrt           |
| C#                                  | csharp             |
| C# in browser                       | csharp-interactive |
| Console                             | console            |
| CSHTML                              | cshtml             |
| DAX                                 | dax                |
| Docker                              | dockerfile         |
| F#                                  | fsharp             |
| Go                                  | go                 |
| HTML                                | html               |
| HTTP                                | http               |
| Java                                | java               |
| JavaScript                          | javascript         |
| JSON                                | json               |
| Kusto Query Language                | kusto              |
| Markdown                            | md                 |
| Objective-C                         | objc               |
| OData                               | odata              |
| PHP                                 | php                |
| PowerApps (dot decimal separator)   | powerapps-dot      |
| PowerApps (comma decimal separator) | powerapps-comma    |
| PowerShell                          | powershell         |
| Python                              | python             |
| Q#                                  | qsharp             |
| R                                   | r                  |
| Ruby                                | ruby               |
| SQL                                 | sql                |
| Swift                               | swift              |
| TypeScript                          | typescript         |
| VB                                  | vb                 |
| XAML                                | xaml               |
| XML                                 | xml                |

The `csharp-interactive` name specifies the C# language, and the ability to run the samples from the browser. These snippets are compiled and executed in a Docker container, and the results of that program execution are displayed in the user's browser window.

#### Example: C\\

**Markdown**

    ```csharp
    // Hello1.cs
    public class Hello1
    {
        public static void Main()
        {
            System.Console.WriteLine("Hello, World!");
        }
    }
    ```

**Render**

```csharp
// Hello1.cs
public class Hello1
{
    public static void Main()
    {
        System.Console.WriteLine("Hello, World!");
    }
}
```

#### Example: SQL

**Markdown**

    ```sql
    CREATE TABLE T1 (
      c1 int PRIMARY KEY,
      c2 varchar(50) SPARSE NULL
    );
    ```

**Render**

```sql
CREATE TABLE T1 (
  c1 int PRIMARY KEY,
  c2 varchar(50) SPARSE NULL
);
```

### Alt text

Alt text that contains underscores won't be rendered properly. For example, instead of using this:

```markdown
![ADextension_2FA_Configure_Step4](./media/bogusfilename/ADextension_2FA_Configure_Step4.PNG)
```

Escape the underscores like this:

```markdown
![ADextension\_2FA\_Configure\_Step4](./media/bogusfilename/ADextension_2FA_Configure_Step4.PNG)
```

### Apostrophes and quotation marks

If you copy from Word into a Markdown editor, the text might contain "smart" (curly) apostrophes or quotation marks. These need to be encoded or changed to basic apostrophes or quotation marks. Otherwise, you end up with things like this when the file is published: Itâ€™s

Here are the encodings for the "smart" versions of these punctuation marks:

-   Left (opening) quotation mark: `&#8220;`
-   Right (closing) quotation mark: `&#8221;`
-   Right (closing) single quotation mark or apostrophe: `&#8217;`
-   Left (opening) single quotation mark (rarely used): `&#8216;`

### Angle brackets

It is common to use angle brackets to denote a placeholder. When you do this in text (not code), you must encode the angle brackets. Otherwise, Markdown thinks that they're intended to be an HTML tag.

For example, encode `<script name>` as `&lt;script name&gt;`

## Markdown flavor

The docs.microsoft.com site backend uses Open Publishing Services (OPS) which supports [CommonMark](https://commonmark.org/) compliant markdown parsed through the [Markdig](https://github.com/lunet-io/markdig) parsing engine. This markdown flavor is mostly compatible with [GitHub Flavored Markdown (GFM)](https://help.github.com/categories/writing-on-github/), as most docs are stored in GitHub and can be edited there. Additional functionality is added through Markdown extensions.

## See also:

### Markdown resources

-   [Introduction to Markdown](https://daringfireball.net/projects/markdown/syntax)
-   [Docs Markdown cheat sheet](./media/documents/markdown-cheatsheet.pdf?raw=true)
-   [GitHub's Markdown Basics](https://help.github.com/articles/markdown-basics/)
-   [The Markdown Guide](https://www.markdownguide.org/)
