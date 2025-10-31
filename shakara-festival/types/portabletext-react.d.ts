declare module '@portabletext/react' {
  import type { ReactNode, ComponentType } from 'react'

  export interface PortableTextMarkComponentProps<T = Record<string, unknown>> {
    children?: ReactNode
    value?: T
  }

  export interface PortableTextTypeComponentProps<T = Record<string, unknown>> {
    value: T
  }

  export type PortableTextBlockComponent<T = Record<string, unknown>> = ComponentType<{ children?: ReactNode } & T>

  export type PortableTextListComponent = ComponentType<{ children?: ReactNode }>

  export type PortableTextListItemComponent = ComponentType<{ children?: ReactNode }>

  export type PortableTextComponents = {
    types?: Record<string, ComponentType<PortableTextTypeComponentProps<any>>>;
    block?: Record<string, PortableTextBlockComponent<any>>;
    marks?: Record<string, ComponentType<PortableTextMarkComponentProps<any>>>;
    list?: Record<string, PortableTextListComponent>;
    listItem?: Record<string, PortableTextListItemComponent>;
  }

  export function PortableText(props: { value: unknown; components?: PortableTextComponents }): JSX.Element
}

