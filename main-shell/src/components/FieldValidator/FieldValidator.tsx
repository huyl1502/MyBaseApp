import React, {
  type ReactElement,
  type CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ValidatorContext,
  type ValidatorRef,
} from "./ValidatorContext";

export interface ValidationRule {
  required?: boolean;
  message?: string;

  validator?: (
    value: unknown
  ) => Promise<string | null | undefined> | string | null | undefined;
}

const validateValue = async (
  t: (text?: string) => string,
  value: unknown,
  rules: ValidationRule[] = []
): Promise<string | null> => {
  for (const rule of rules) {
    if (
      rule.required &&
      (value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) &&
          value.length === 0))
    ) {
      return t(rule.message) || t("Required");
    }

    if (rule.validator) {
      const result = await rule.validator(value);

      if (result !== null && result !== undefined && result !== "") {
        return t(result as string);
      }
    }
  }

  return null;
};

interface ChildProps {
  value?: unknown;
  status?: string;
}

interface FieldValidatorProps {
  t: (text?: string) => string;

  children: ReactElement<ChildProps>;

  rules?: ValidationRule[];

  group?: string;

  label?: string;

  useLabel?: boolean;

  checkValue?: unknown;

  styleLabel?: CSSProperties;
}

const FieldValidator = ({
  t,
  children,
  rules = [],
  group,
  label,
  useLabel = true,
  checkValue,
  styleLabel,
}: FieldValidatorProps) => {
  const [error, setError] =
    useState<string | null>(null);

  const value =
    checkValue ?? children.props.value;

  const { register, unregister } =
    useContext(ValidatorContext);

  const ref =
    useRef<ValidatorRef | null>(null);

  const didMount = useRef(false);

  const isRequired = rules.some(
    (rule) => rule.required
  );

  const validate = useCallback(async () => {
    const err = await validateValue(
      t,
      value,
      rules
    );

    setError(err);

    return !err;
  }, [t, value, rules]);

  useEffect(() => {
    if (didMount.current) {
      validate();
    } else {
      didMount.current = true;
    }
  }, [value, validate]);

  useImperativeHandle(
    ref,
    () => ({
      validate,
    }),
    [validate]
  );

  useEffect(() => {
    register(ref, group);

    return () => unregister(ref);
  }, [group, register, unregister]);

  const childWithStatus =
    React.cloneElement(children, {
      status: error
        ? "error"
        : children.props.status,
    });

  return (
    <div style={{ width: "100%" }}>
      {useLabel && (
        <label
          style={
            styleLabel ?? {
              width: "100%",
              margin: 0,
              paddingBottom: 8,
            }
          }
        >
          {isRequired && (
            <span
              style={{
                marginRight: 5,
                color: "#ff4d4f",
              }}
            >
              *
            </span>
          )}

          {label ? t(label) : null}
        </label>
      )}

      {childWithStatus}

      {error && (
        <div
          style={{
            color: "#ff4d4f",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default FieldValidator;