import React from 'react'
import { Input } from 'native-base'

export const InputText = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;
  // const hasError = errors[name] && touched[name]
  return (
    <>
      <Input value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
        }}
        {...inputProps} />
    </>
  )
}