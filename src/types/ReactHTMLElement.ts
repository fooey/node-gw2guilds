import type { IClassName } from './ClassName';

export interface IReactHTMLElement<T = HTMLElement>
  extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, 'className'> {
  className?: IClassName;
}
