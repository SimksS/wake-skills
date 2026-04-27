# Wake Scriban - Language Reference

This reference summarizes Scriban syntax for Wake Storefront SSR templates. For everyday Wake work, start with `SKILL.md`; use this file when exact language behavior matters.

Source: `https://scriban.github.io/docs/language/`

## Blocks

Templates mix three block types:

- Code blocks: `{{ ... }}` are evaluated by Scriban.
- Text blocks: anything outside code blocks is output as-is.
- Escape blocks: `{%{ ... }%}` output Scriban syntax literally.

Code blocks can contain a single expression, multiline statements, or semicolon-separated statements:

```scriban
{{ name }}

{{
  if !name
    name = "default"
  end
  name
}}

{{ if !name; name = "default"; end; name }}
```

Non-assignment expressions print their result:

```scriban
{{
  x = 5
  x
  x + 1
}}
```

Output: `56`.

Escape blocks render code literally:

```scriban
{%{Hello {{ name }}}%}
```

Output: `Hello {{ name }}`. Increase the number of `%` characters to nest escape blocks: `{%%{ ... }%%}`.

## Whitespace Control

By default, whitespace around code and escape blocks is preserved.

| Mode | Syntax | Effect |
| --- | --- | --- |
| Greedy | `{{-` or `-}}` | Removes all whitespace and newlines on that side |
| Non-greedy | `{{~` or `~}}` | Removes nearby whitespace while preserving surrounding lines more carefully |

Use non-greedy mode for control-only lines in HTML:

```scriban
<ul>
  {{~ for product in products ~}}
    <li>{{ product.name }}</li>
  {{~ end ~}}
</ul>
```

Scriban also auto-indents multiline output when a code block is preceded only by spaces on the same line and the block does not use left-strip (`{{-` or `{{~`).

## Comments

Use `#` for single-line comments and `## ... ##` for multiline comments inside code blocks:

```scriban
{{ name # single line comment }}

{{ ## This
   is a multiline
   comment ## }}
```

Both comment forms can also be closed by the code block end tag `}}`.

## Literals

Strings:

| Type | Syntax | Notes |
| --- | --- | --- |
| Regular | `"..."` or `'...'` | Supports escapes such as `\n`, `\t`, `\\`, `\uXXXX`, `\xFF` |
| Verbatim | `` `...` `` | No escape sequences; useful for regex |
| Interpolated | `$"...{expr}..."` or `$'...{expr}...'` | Embeds expressions inline |

```scriban
{{ "line1\nline2" }}
{{ `\s+` }}
{{ $"Sum is {1 + 2}" }}
```

Numbers:

```scriban
100
1e3
0x1ef
100.0
1.0e-3
100.0f
100.0d
100.0m
```

Booleans and null:

```scriban
{{ true }}
{{ false }}
{{ null }}
```

When rendered as a string, `null` outputs an empty string.

## Variables

Scriban supports global/property variables and local variables.

- Global/property variables: `name`, `_var`, `var9`.
- Local variables: `$name`, scoped to the current function or include page.
- `$`: array of positional arguments passed to a function or include.
- `$0`, `$1`, `$2`: shorthand for `$[0]`, `$[1]`, `$[2]`.
- `$[-1]`: last argument.
- `$.named` or `$["named"]`: named argument.

`this` refers to the current scope object:

```scriban
{{
  a = 5
  this.a = 6
  this["a"] = 7
}}
```

`empty` represents an empty object, mostly for Liquid compatibility:

```scriban
{{ a = {}; a == empty }}
```

## Objects

Create objects with `{}`:

```scriban
{{ obj = {} }}
{{ obj = { member1: "yes", member2: "no" } }}
{{ obj = { "member1": "yes", "member2": "no" } }}
```

Access members with dot or bracket notation:

```scriban
{{ obj.member1 }}
{{ obj["member1"] }}
```

Use optional chaining for nullable nested members:

```scriban
{{ obj.member1?.submember1?.submember2 ?? "nothing" }}
```

Pure Scriban objects can receive new members:

```scriban
{{ obj.new_prop = "hello" }}
```

Objects support `.empty?`:

```scriban
{{ {}.empty? }}
```

By default, properties and methods of .NET objects are exposed as lowercase `underscore_case` names. For example, `MyMethodIsNice` becomes `my_method_is_nice`.

## Arrays

Create arrays with `[]`:

```scriban
{{ arr = [] }}
{{ arr = [1, 2, 3] }}
{{ arr[0] }}
{{ arr.size }}
```

Pure Scriban arrays can be expanded by assignment:

```scriban
{{
  arr = []
  arr[0] = 1
  arr[1] = 2
}}
```

Arrays can have attached properties:

```scriban
{{ arr = [5, 6]; arr.label = "nums"; arr.label + arr[0] }}
```

Whitespace disambiguates array literals from indexers:

```scriban
{{ myfunction [1] }}
{{ myvariable[1] }}
```

The first line passes `[1]` as an argument. The second accesses index `1`.

## Functions

Simple function:

```scriban
{{ func sub
   ret $0 - $1
end }}

{{ sub 5 1 }}
{{ 5 | sub 1 }}
```

With a pipe, the left value is passed as the first argument.

Anonymous function:

```scriban
{{ sub = do; ret $0 - $1; end }}
{{ 1 | sub 3 }}
```

Parametric function:

```scriban
{{ func greet(name, greeting = "Hello")
   ret greeting + ", " + name + "!"
end }}

{{ greet "John Doe" }}
{{ greet "John Doe" "Oi" }}
```

Variadic parameter:

```scriban
{{ func sub_variable(x, y...)
   ret x - (y[0] ?? 0) - (y[1] ?? 0)
end }}
```

Inline function:

```scriban
{{ double(x) = x * 2 }}
{{ double 5 }}
```

Function pointer:

```scriban
{{ obj.fn = @inc }}
{{ 1 | obj.fn }}
```

Use `@` to reference a function without calling it.

## Expressions

Variable paths:

```scriban
{{ name }}
{{ myarray[1] }}
{{ myobject.member1.myarray[2] }}
```

Assignments must be top-level expression statements:

```scriban
{{ name = "foo" }}
{{ myobject.member1.myarray[0] = "foo" }}
```

Nested expressions use parentheses:

```scriban
{{ name = ("foo" + "bar") }}
```

Arithmetic operators:

| Operator | Description |
| --- | --- |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `//` | Integer division |
| `%` | Modulo |

String operators:

| Operator | Description |
| --- | --- |
| `"a" + "b"` | Concatenation |
| `"a" * 3` | Repetition |

If one side is a string, the other side is converted to string. `null` becomes `""`.

Comparison and logical operators:

```scriban
==  !=  >  >=  <  <=
&&  ||
cond ? left : right
```

Unlike JavaScript, `&&` and `||` always return booleans.

Unary operators:

| Operator | Effect |
| --- | --- |
| `!expr` | Boolean negation |
| `+expr` | Arithmetic positive |
| `-expr` | Arithmetic negation |
| `^expr` | Expands an array into function arguments |
| `@expr` | Aliases a function/expression instead of evaluating it as a call |
| `++var` / `var++` | Pre/post increment |
| `--var` / `var--` | Pre/post decrement |

Range expressions:

```scriban
1..5
1..<5
```

`1..5` includes `5`; `1..<5` excludes `5`.

Null-coalescing:

```scriban
{{ value ?? "default" }}
{{ value ?! "fallback" }}
```

`??` returns the right side when the left side is `null`. `?!` returns the right side when the left side is not `null`.

Function calls use whitespace-separated arguments:

```scriban
{{ myfunction arg1 "arg2" (1 + 5) }}
{{ date.parse '2016/01/05' | date.to_string '%g' }}
```

Pipes can be chained across lines:

```scriban
{{-
"text"                    |
  string.append "END"     |
  string.prepend "START"
-}}
```

Named arguments:

```scriban
{{ my_processor "Hello" "World" count: 15 options: "optimized" }}
{{ "Hello" | my_processor "World" count: 15 options: "optimized" }}
```

Once arguments are named, following arguments must also be named.

Inside custom `func`, named arguments are available on `$`:

```scriban
{{ $.count }}
{{ $["options"] }}
```

## Statements

Each statement ends at `}}`, an end-of-line inside a code block, or a semicolon.

### Single Expression

```scriban
{{ value + 1 }}
```

The result is printed.

### Compound Assignment

```scriban
x += 5
x -= 2
x *= 3
x /= 4
x //= 2
x %= 3
```

The left-hand side must be a variable, property, or indexer.

### If / Else

```scriban
{{ if condition }}
  ...
{{ else if other_condition }}
  ...
{{ else }}
  ...
{{ end }}
```

Only `null` and `false` are falsy. `0`, `""`, empty arrays, and non-null objects are truthy.

### Case / When

```scriban
{{
  case x
    when 1, 2, 3
      "one, two or three"
    when 5 || 6
      "five or six"
    else
      "other"
  end
}}
```

### For

```scriban
{{ for item in collection }}
  {{ item }}
{{ end }}

{{ for i in 1..5 offset:1 limit:3 reversed }}
  {{ i }}
{{ end }}
```

Supported loop parameters: `offset`, `limit`, `reversed`.

Special `for` variables:

| Variable | Description |
| --- | --- |
| `for.index` | Current zero-based index |
| `for.rindex` | Index from the end |
| `for.first` | Whether this is the first iteration |
| `for.last` | Whether this is the last iteration |
| `for.even` | Whether the index is even |
| `for.odd` | Whether the index is odd |
| `for.changed` | Whether the current value changed from the previous iteration |

### While

```scriban
{{ while condition }}
  ...
{{ end }}
```

Special `while` variables: `while.index`, `while.first`, `while.even`, `while.odd`.

### Tablerow

`tablerow` generates HTML table rows and supports `offset`, `limit`, `reversed`, and `cols`.

```scriban
<table>
  {{~ tablerow p in products cols: 2 -}}
    {{ p.title -}}
  {{ end ~}}
</table>
```

This is mainly useful for Liquid compatibility.

### Break And Continue

```scriban
{{ for i in 1..5
  if i == 3; continue; end
  if i == 5; break; end
  i
end }}
```

### Capture

Capture rendered output into a variable:

```scriban
{{ capture result }}
  Hello {{ name }}!
{{ end }}

{{ result }}
```

### Readonly

Prevent future assignment:

```scriban
{{ x = 1 }}
{{ readonly x }}
```

Reassigning `x` later raises a runtime error.

### Import

Import all members of an object into the current scope:

```scriban
{{
  obj = { member1: "yes" }
  import obj
  member1
}}
```

Readonly variables are not overridden.

### With

Open a scope where assignments become properties of the given object:

```scriban
{{
  obj = {}
  with obj
    name = "John Doe"
    age = 28
  end
}}
```

Inside `with`, `this` refers to the object passed to `with`.

### Wrap

Pass a block to a function through `$$`:

```scriban
{{
  func repeated
    for i in 1..<$0
      $$
    end
  end

  wrap repeated 3
    "Item " + i + "\n"
  end
}}
```

### Include And Include Join

`include` parses and renders another template through the configured Scriban template loader:

```scriban
{{ include 'myinclude.html' }}
{{ x = include 'myinclude.html' }}
{{ x + " modified" }}
```

`include_join` renders multiple templates with a separator and optional begin/end delimiters:

```scriban
{{ include_join ['one.html', 'two.html'] '<br/>' 'tpl:begin.html' 'tpl:end.html' }}
{{ include_join ['one.html', 'two.html'] 'tpl:separator.html' '<div>' '</div>' }}
```

Prefix a separator or delimiter with `tpl:` when it should be rendered as a template name. If the separated template output is empty, prefix and suffix are not output.

In Wake projects, confirm how includes are resolved by the Storefront runtime before introducing new include paths.

### Ret

Return early from a top-level template, include page, or function:

```scriban
{{ if done; ret; end }}
{{ ret computed_value }}
```

After `ret`, later template content is not rendered.

## Wake-Specific Notes

- Wake templates are HTML files that embed Scriban. Keep the output valid as HTML.
- `data` usually comes from `Queries/*.graphql`; validate its shape before using nested fields.
- `block_data` comes from block schema settings; each accessed field should exist in `settings`.
- `store` contains built-in Storefront variables and should use `underscore_case` paths.
- Use optional chaining and explicit string-empty checks for optional CMS/query values.
- Prefer small, readable template logic. Push data shaping into GraphQL, backend code, or JavaScript when the template becomes hard to reason about.
