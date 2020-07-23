import React from 'react';
import Styles from './NavLink.module.scss';
/**
 * @typedef{ import('react').HTMLProps<HTMLLiElement>} liProps
 */

/**
 * @param {{
 * text:string,
 * } & liProps} props
 */

function NavLink({ text, children, ...props }) {
  if (children) {
    return (
      <li className={Styles.navLink} {...props}>
        <a href='/#' className={[Styles.link, Styles.downArrow].join(' ')}>
          {text}
        </a>
        {children}
      </li>
    );
  } else {
    return (
      <li className={Styles.navLink}>
        <a href='/#' className={Styles.link}>
          {text}
        </a>
      </li>
    );
  }
}

function SubMenuContiainer({ children }) {
  return <ul className={Styles.subMenuContainer}>{children}</ul>;
}

/**
 * @param {{
 * text:string,
 * } & liProps} props
 */

function SubNavLink({ text, ...props }) {
  return (
    <li className={Styles.subNavLink} {...props}>
      <a href='/#' className={Styles.subLink}>
        {text}
      </a>
    </li>
  );
}

export { NavLink, SubMenuContiainer, SubNavLink };
