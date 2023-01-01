<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@bitmachina/highlighter](./highlighter.md) &gt; [IRenderOptions](./highlighter.irenderoptions.md)

## IRenderOptions interface

Options to modify the syntax tree of the hast code block.

<b>Signature:</b>

```typescript
export interface IRenderOptions 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [code](./highlighter.irenderoptions.code.md) | <code>readonly</code> | (props: ICodeRenderProps) =&gt; HResult | Override function for <code>code</code> tags. |
|  [line](./highlighter.irenderoptions.line.md) | <code>readonly</code> | (props: ILineRenderProps) =&gt; HResult | Override function for code block lines. |
|  [pre](./highlighter.irenderoptions.pre.md) | <code>readonly</code> | (props: IPreRenderProps) =&gt; HResult | Override function for <code>pre</code> tags. |
|  [token](./highlighter.irenderoptions.token.md) | <code>readonly</code> | (props: ITokenRenderProps) =&gt; HResult | Override function for code block tokens. |
