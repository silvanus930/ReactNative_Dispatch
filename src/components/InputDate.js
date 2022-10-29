import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Input, Pressable } from 'native-base';
import { format } from 'date-fns';

const InputDate = (props) => {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;

  return (
    <>
      <Pressable w="50%" onPress={() => setShow(true)}>
      <Input w="100%" value={value}
        isReadOnly={true}
        onFocus={() => { setShow(true) }}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
          setShow(false)
        }}
        {...inputProps} />
      </Pressable>
      {show && <DateTimePicker
        testID="dateTimePicker"
        mode='date'
        value={new Date(value)}
        onChange={(text, selectedDate) => { setShow(false); onChange(name)(format(selectedDate, "MM/dd/yyyy")) }}
      />}
    </>
  )
}

export default InputDate