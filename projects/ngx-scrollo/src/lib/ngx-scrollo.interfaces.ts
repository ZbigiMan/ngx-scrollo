export interface CssProps {
    [key: string]: string
}
// TODO make more datailed css props interface

export interface ElementOffset {
    top: number,
    left: number,
    height: number,
    width: number
}

export interface AnchorOffset {
    top: number,
}

export interface Browser {
    edge: boolean,
    firefox: boolean
}