import classnames from 'classnames';
import { isNil } from 'lodash';
import ReactDOM from 'react-dom';
import { IClassName } from '~/types/ClassName';
import { IReactHTMLElement } from '~/types/ReactHTMLElement';

const DEFAULT_PORTAL_MOUNT = '__next';

interface IPortalProps extends IReactHTMLElement<HTMLDivElement> {
  children: React.ReactNode;
  /** @prop domElement - [Element | htmlId | null | undefined] */
  mountTarget?: Element | string;
  className?: IClassName;
}
export const Portal: React.FC<IPortalProps> = ({ children, mountTarget, className, ...attrs }) => {
  const element = getDomElement(mountTarget);

  return ReactDOM.createPortal(
    <div {...attrs} className={`${classnames(className)} portal-mount z-20`}>
      {children}
    </div>,
    element
  );
};

const getDomElement = (el: Element | string | null = DEFAULT_PORTAL_MOUNT): Element => {
  if (typeof el === 'string') {
    el = document.getElementById(el);
  }

  if (isNil(el) || !document.body.contains(el)) {
    throw new Error(`domElement not found: ${el}`);
  } else {
    return el;
  }
};
