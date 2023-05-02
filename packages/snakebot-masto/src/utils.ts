import { convert } from 'html-to-text'

export function htmlToPlaintext(html: string): string {
    return convert(html, { wordwrap: false })
}
