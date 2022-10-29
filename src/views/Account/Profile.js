import { View } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Box, Button, Container, HStack, Icon, IconButton, ScrollView, Text, DatePicker } from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field } from 'formik';
import { InputText } from '../../components/InputText';
import DismissKeyboard from '../../components/DismissKeyboard';
import { getProfile, profileEdit } from '../../store/state/authSlice';
import useSound from 'react-native-use-sound';
import { useEffect } from 'react';
import InputDate from '../../components/InputDate';
import axios from 'axios';
import { format } from 'date-fns';

const Profile = ({ navigation }) => {
  const [fileType, setFileType] = useState('select');
  const [play, pause, stop] = useSound(fileType === 'select' ? 'select.wav' : 'back.wav');
  const [edit, setEdit] = useState(false)
  const { profile, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      headerLeft:
        () => (
          <Icon textAlign="center" left={-10} as={<Feather name="chevron-left" />} color="#ffffff" size="4xl" onPress={() => { navigation.goBack(); selected('back') }} />
        ),
      headerRight: () => (
        <IconButton bg="#fff" borderWidth='0' variant="outline" size="xs" h={7} onPress={() => { setEdit(!edit) }} icon={<Icon size="sm" as={<Feather name="edit" />} color="#024580" />} _pressed={{
          bg: "none"
        }} />
      ),
    })
  }, [navigation, setEdit, edit, selected])

  useEffect(() => {
    setEdit(false)
  }, [profile])

  const selected = (type) => {
    setFileType(type)
    play();
  }
  const submit = async (values) => {

    const { first_name, last_name, email, phone, address, dob } = values;
   
    const formData = new FormData();
    formData.append("user_id", profile.id);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("phone_number", phone);
    formData.append("address", address);
    formData.append("dob", format(new Date(dob).getTime(), "yyyy-MM-dd"));
    // const data = {
    //   user_id: profile.id,
    //   first_name: first_name,
    //   last_name: last_name,
    //   email: email,
    //   phone_number: phone,
    //   dob: dob
    // }
    // const formData = `&user_id=${data.user_id}&first_name=${data.first_name}&last_name=${data.last_name}&email=${data.email}&phone_number=${data.phone_number}&dob=${data.dob}`;

    dispatch(profileEdit(formData));
    // dispatch(getProfile(profile.id));
    selected('select');
    // setEdit(!edit)
  }

  return (
    <DismissKeyboard>

      <Formik
        initialValues={{ first_name: profile?.first_name, last_name: profile?.last_name, email: profile?.email, phone: profile?.phone, address: profile?.address, dob: profile?.dob }}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, }) => (
          <Container maxW="100%" h="100%" alignItems="center" bg="#ffffff">
            {/* <Box w="100%" h="10%" justifyContent="flex-end" bg="#024580" >
              <HStack justifyContent="space-between" alignItems="center" px={4} >
                <Icon as={<Feather name="chevron-left" />} color="#ffffff" size="4xl" onPress={() => { navigation.goBack(); selected('back') }} />
                <Text color="#fff" fontSize={16} fontWeight="500" textAlign="center">Profile</Text>
                <IconButton bg="#fff" borderWidth='0' variant="outline" size="xs" h={7} onPress={() => { setEdit(!edit) }} icon={<Icon size="sm" as={<Feather name="edit" />} color="#024580" />} _pressed={{
                  bg: "none"
                }} />
              </HStack>
            </Box> */}
            <ScrollView w="100%">
              <Box alignItems="center" >
                <Box my={10} >
                  <Avatar bg="amber.500" source={{
                    uri: "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                  }} size="2xl">
                  </Avatar>
                  {edit && <Box position="absolute" right={0} bottom={2} bg="muted.200" width="10" height="10" justifyContent="center" alignItems="center" borderRadius={50} borderWidth="1" borderColor="#fff"><FontAwesome name="camera" size={18} color="#000" /></Box>}
                </Box>

                <Box w="100%">

                  {profile?.first_name && profile?.last_name &&
                    <Box borderBottomWidth="1" borderColor="muted.200">
                      <HStack justifyContent="space-between" p={4} borderY="1" >
                        {edit ?
                          <Box width="100%" flexDir="row">
                            <Field component={InputText} width="48%" name="first_name" value={values.first_name} placeholder="First Name" placeholderTextColor="#000" />
                            <Field component={InputText} width="48%" name="last_name" value={values.last_name} ml={4} placeholder="Last Name" placeholderTextColor="#000" />
                          </Box>
                          :
                          <Text>{profile?.first_name} {profile?.last_name}</Text>}
                      </HStack>
                    </Box>
                  }
                  {profile?.dob &&
                    <Box borderBottomWidth="1" borderColor="muted.200">
                      <HStack justifyContent="space-between" p={4} borderY="1">
                        {edit ?
                          <Box width="100%" flexDir="row">

                            <Field component={InputDate} width="48%" name="dob" value={format(new Date(values.dob).getTime(), 'MM/dd/yyyy')} placeholder="DOB" placeholderTextColor="#000" />
                            {/* <Field component={InputText} width="48%" name="dob" value={values.dob} placeholder="DOB" placeholderTextColor="#000" /> */}
                            {/* <Field component={InputText} width="48%" name="last_name" value={values.last_name} ml={4} /> */}
                          </Box>
                          :
                          <Text>{
                            format(new Date(profile?.dob).getTime(), 'MM/dd/yyyy')
                          } </Text>}
                      </HStack>
                    </Box>
                  }
                  {profile?.phone &&
                    <Box borderBottomWidth="1" borderColor="muted.200">
                      <HStack justifyContent="space-between" p={4} borderY="1">
                        {edit ?
                          <Field component={InputText} width="100%" name="phone" value={values.phone} placeholder="Phone Number" placeholderTextColor="#000" />
                          :
                          <Text>+{profile?.phone}</Text>
                        }
                      </HStack>
                    </Box>
                  }
                  {profile?.email &&
                    <Box borderBottomWidth="1" borderColor="muted.200">
                      <HStack justifyContent="space-between" p={4} borderY="1">
                        {edit ?
                          <Field component={InputText} width="100%" name="email" value={values.email} placeholder="Email" placeholderTextColor="#000" />
                          :
                          <Text>{profile?.email}</Text>
                        }
                      </HStack>
                    </Box>
                  }
                  {profile?.address &&
                    <Box borderBottomWidth="1" borderColor="muted.200">
                      <HStack justifyContent="space-between" p={4} borderY="1">
                        {edit ?
                          <Field component={InputText} width="100%" name="address" value={values.address} placeholder="Home address" placeholderTextColor="#000" />
                          :
                          <Text>{profile?.address}</Text>
                        }
                      </HStack>
                    </Box>
                  }
                  <Box mx={4} mb={12}>
                    {edit && <Button isLoading={loading} mt={4} size="sm" variant="unstyled" disabled={!isValid} borderWidth="2" borderRadius={10} borderColor="#024580" _text={{
                      color: "#024580",
                      fontWeight: "500"
                    }}
                      onPress={handleSubmit}
                    >
                      SAVE CHANGES
                    </Button>}
                  </Box>

                </Box>
              </Box>
            </ScrollView>
          </Container>
        )}
      </Formik>
    </DismissKeyboard>
  )
}

export default Profile