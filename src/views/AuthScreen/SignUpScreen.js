import { Box, Center, Container, HStack, Image, Stack, Text, Heading, VStack, Input, Button, ScrollView } from 'native-base';
import { Logo, TickIcon } from '../../assets/svg';
import React, { useEffect, useState } from 'react'
import { ConfirmScreen } from '../../components/ImgScreen';
import { InputText } from '../../components/InputText';
import { Formik, Field } from 'formik';
import DismissKeyboard from '../../components/DismissKeyboard';
import { setConfirm, signup } from '../../store/state/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup'
import useSound from 'react-native-use-sound';

const SignUpScreen = ({ navigation, route }) => {
  const [play, pause, stop] = useSound('back.wav');
  const [form, setForm] = useState({ firstName: "John", lastName: "Doe", email: "John@provider.com", password: "***************", confirmPassword: "***************" })
  // const [confirm, setConfirm] = useState(false);
  const { user, loading, message, confirm } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const submit = (values) => {
    const { firstName, lastName, email, password } = values;
    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("password", password);
    // console.log('values', formData)
    dispatch(signup(formData))
    // setConfirm(true);
    play();
  }

  // useEffect(() => { 
  //   console.log('confirm success');
  //   setConfirm(false);
  // },[])

  useEffect(() => {
    if (message && message.includes("successfully registered")) {
      dispatch(setConfirm(true))
      // setTimeout(() => {
      //   confirm ? navigation.navigate('Home') : '';
      // }, 1000);
    }
  }, [confirm, message]);


  const signUpValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required'),
    lastName: yup
      .string()
      .required('Last name is required'),
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email is required'),
    password: yup
      .string()
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  })

  return (
    <DismissKeyboard>
      <Container maxW="100%" h="100%" alignItems="center" justifyContent="flex-start" bg="#ffffff" >
        {!confirm ?
          <ScrollView>
            <Box>
              <HStack
                space={6}
                my={10}
                alignItems="center"
              >
                <Center bg="#FAFAFA" width="55px" height="55px" borderRadius={50} >
                  <Logo color="#206280" width="22" height="22" />
                </Center>
                <Box>
                  <Heading size="xl" fontWeight={400} color="#024580">
                    Sign Up
                  </Heading>
                  <Text fontSize="sm">
                    Join our growing network of field reps.
                  </Text>
                </Box>
              </HStack>
              <VStack>
                <Formik
                  validationSchema={signUpValidationSchema}
                  initialValues={{ firstName: '', lastName: "", email: '', password: '', confirmPassword: '' }}
                  onSubmit={submit}
                >
                  {({ handleSubmit, errors, isValid, touched, }) => (
                    <>
                      <HStack space={2} width="362px" mb={2}>
                        <Box width="49%" >
                          <Box bg="#EFF1F2" width="100%" py={2} borderRadius="10">
                            <Text px={3} fontSize="xs" color="#024580">First Name</Text>
                            <Field component={InputText}
                              name="firstName"
                              py={0} px={3} size="md" variant="unstyled" placeholderTextColor="#000" autoCapitalize='none' />
                            {/* <Input py={0} px={3} size="md" variant="unstyled" placeholder="John" placeholderTextColor="#000" /> */}
                          </Box>
                          {(errors.firstName && touched.firstName) &&
                            <Text mt={0} mb={2} pl={3} fontSize="12" color="red.500">{errors.firstName}</Text>
                          }
                        </Box>
                        <Box width="49%">
                          <Box bg="#EFF1F2" width="100%" py={2} borderRadius="10">
                            <Text px={3} fontSize="xs" color="#024580">Last Name</Text>
                            <Field component={InputText} name="lastName" py={0} px={3} size="md" variant="unstyled" placeholderTextColor="#000" autoCapitalize='none' />
                            {/* <Input py={0} px={3} size="md" variant="unstyled" placeholder="Doe" placeholderTextColor="#000" /> */}
                          </Box>
                          {(errors.lastName && touched.lastName) &&
                            <Text mb={2} pl={3} fontSize="12" color="red.500">{errors.lastName}</Text>
                          }
                        </Box>
                      </HStack>
                      <Box bg="#EFF1F2" width="362px" py={2} borderRadius="10" mb={2}>
                        <Text px={3} fontSize="xs" color="#024580">Email Address</Text>
                        <Field component={InputText} name="email" type="email" py={0} px={3} size="md" variant="unstyled" placeholderTextColor="#000" autoCapitalize='none' />
                        {/* <Input py={0} px={3} size="md" variant="unstyled" placeholder="John@provider.com" placeholderTextColor="#000" /> */}
                      </Box>
                      {(errors.email && touched.email) &&
                        <Text mt={-2} mb={2} pl={3} fontSize="12" color="red.500">{errors.email}</Text>
                      }
                      <Box bg="#EFF1F2" width="362px" py={2} borderRadius="10" mb={2}>
                        <Text px={3} fontSize="xs" color="#024580">Password</Text>
                        <Field component={InputText} name="password" type="password" py={0} px={3} size="md" variant="unstyled" placeholderTextColor="#000" autoCapitalize='none' />
                        {/* <Input py={0} px={3} size="md" variant="unstyled" placeholder="**************" placeholderTextColor="#000" /> */}
                      </Box>
                      {(errors.password && touched.password) &&
                        <Text mt={-2} mb={2} pl={3} fontSize="12" color="red.500">{errors.password}</Text>
                      }
                      <Box bg="#EFF1F2" width="362px" py={2} borderRadius="10" mb={2}>
                        <Text px={3} fontSize="xs" color="#024580">Confirm Password</Text>
                        <Field component={InputText} name="confirmPassword" type="password" py={0} px={3} size="md" variant="unstyled" placeholderTextColor="#000" autoCapitalize='none' />
                        {/* <Input py={0} px={3} size="md" variant="unstyled" placeholder="**************" placeholderTextColor="#000" /> */}
                      </Box>
                      {(errors.confirmPassword && touched.confirmPassword) &&
                        <Text mt={-2} mb={2} pl={3} fontSize="12" color="red.500">{errors.confirmPassword}</Text>
                      }
                      {/* <Box width="340px" mb={2} alignItems="flex-start">
                      <Text fontSize="xs" color="red.500">Your passwords do not match</Text>
                    </Box> */}
                      <Button isLoading={loading} mt={4} size="sm" variant="unstyled" disabled={!isValid} borderWidth="2" borderRadius={10} borderColor="#024580" _text={{
                        color: "#024580",
                        fontWeight: "500"
                      }}
                        onPress={handleSubmit}
                      >
                        CREATE ACCOUNT
                      </Button>
                    </>
                  )}
                </Formik>
              </VStack>
            </Box>
          </ScrollView>
          :
          <Box h="100%" alignItems="center" justifyContent="center">
            <ConfirmScreen />
          </Box>
        }
      </Container>
    </DismissKeyboard>

  )
}

export default SignUpScreen
