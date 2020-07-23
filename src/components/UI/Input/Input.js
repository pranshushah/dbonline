import React from 'react';
import Styles from './Input.module.scss';

/**
 * @typedef{ import('react').HTMLProps<HTMLInputElement>} inputProps
 * @typedef{import('react').Ref<HTMLInputElement>}  inputRefType
 * @typedef{import('react').Ref<HTMLLabelElement>} labelRefType
 */

/**
 * @typedef {object} refsObj
 * @property {labelRefType} labelRef
 * @property {inputRefType} inputRef
 */

/**
 *
 * @param {{
 * label:string,
 * secondary:boolean,
 * primary:boolean,
 * dimension:("small"|"medium"|"large"|"huge"),
 * error:boolean,
 * errorMessage:string
 * } & inputProps} props
 * @param {refsObj} ref
 */

function Input(
  {
    label,
    secondary,
    primary,
    dimension = 'medium',
    error,
    errorMessage,
    ...props
  },
  ref,
) {
  let containerClassName;
  let errorClassName;
  if (error) {
    switch (dimension) {
      case 'huge': {
        containerClassName = Styles.inputContainerHugeError;
        errorClassName = Styles.errorMessageHuge;
        break;
      }
      case 'large': {
        containerClassName = Styles.inputContainerLargeError;
        errorClassName = Styles.errorMessageLarge;
        break;
      }
      case 'medium': {
        containerClassName = Styles.inputContainerMediumError;
        errorClassName = Styles.errorMessageMedium;
        break;
      }
      default: {
        containerClassName = Styles.inputContainerSmallError;
        errorClassName = Styles.errorMessageSmall;
        break;
      }
    }
  } else if (secondary) {
    switch (dimension) {
      case 'huge': {
        containerClassName = Styles.inputContainerHugeSecondary;
        break;
      }
      case 'large': {
        containerClassName = Styles.inputContainerLargeSecondary;
        break;
      }
      case 'medium': {
        containerClassName = Styles.inputContainerMediumSecondary;
        break;
      }
      default: {
        containerClassName = Styles.inputContainerSmallSecondary;
        break;
      }
    }
  } else {
    switch (dimension) {
      case 'huge': {
        containerClassName = Styles.inputContainerHugePrimary;
        break;
      }
      case 'large': {
        containerClassName = Styles.inputContainerLargePrimary;
        break;
      }
      case 'medium': {
        containerClassName = Styles.inputContainerMediumPrimary;
        break;
      }
      default: {
        containerClassName = Styles.inputContainerSmallPrimary;
        break;
      }
    }
  }
  return (
    <>
      <div className={containerClassName}>
        <input
          className={Styles.inputField}
          placeholder='x'
          {...props}
          ref={ref?.inputRef}
        />
        <label className={Styles.inputLabelContainer}>
          <span className={Styles.inputLabelContent}>{label}</span>
        </label>
      </div>
      {error && errorMessage && (
        <p className={errorClassName}>{errorMessage}</p>
      )}
    </>
  );
}
export default React.forwardRef(Input);