import React from 'react';
import Styles from './CheckBox.module.scss';
/**
 * @typedef{ import('react').HTMLProps<HTMLInputElement>} inputProps
 */

/**
 * @param {{
 * label:string,
 * } & inputProps} props
 */

function CheckBox({ label, ...props }) {
  const id = label + Math.random();
  return (
    <div className={Styles.container}>
      <input
        id={id}
        type='checkbox'
        {...props}
        className={Styles.inputCheckBox}
      />
      <label htmlFor={id} className={Styles.checkBox}>
        {label}
      </label>
    </div>
  );
}

export default CheckBox;
