import React, { useEffect, useState } from 'react';
import { Box, Center, Container, HStack, Image, Stack, Text, Heading, VStack, Input, Button } from 'native-base';
import { Logo, TickIcon } from '../../assets/svg';
import { useDispatch, useSelector } from 'react-redux';
import { signin, setAuth, setConfirm } from '../../store/state/authSlice';
import { Formik } from 'formik';
import * as yup from 'yup'
import DismissKeyboard from '../../components/DismissKeyboard';
import { api } from '../../store/servies/api';
import { BackHandler, Keyboard } from 'react-native';
import useSound from 'react-native-use-sound';

const SignInScreen = ({ navigation }) => {
  const [play, pause, stop] = useSound('back.wav');
  // const [emailPlase, setEmailPlase] = useState("John@provider.com");
  // const [passwordPlase, setPasswordPlase] = useState("**************");
  const { user, loading, message, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      // .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const submit = async (values) => {
    const { email, password } = values;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    dispatch(signin(formData));
    Keyboard.dismiss();
    play();
  }

  useEffect(() => {

    dispatch(setConfirm(false))
  }, [])

  useEffect(() => {
    if (message && message.includes('Successful login')) {
      dispatch(setAuth(true));
      navigation.navigate('Home');
    }
  }, [message]);

  return (
    <DismissKeyboard>
      <Container maxW="100%" h="100%" alignItems="center" justifyContent="flex-start" bg="#ffffff">
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
              Sign In
            </Heading>
            <Text fontSize="sm">
              Sign in to view and complete work orders.
            </Text>
          </Box>
        </HStack>
        <VStack >
          <Formik
            validationSchema={loginValidationSchema}
            initialValues={{ email: '', password: '' }}
            onSubmit={submit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, }) => (
              <>
                <Box bg="#EFF1F2" width="340px" py={2} borderRadius="10" mb={2}>
                  <Text px={3} fontSize="xs" color="#024580">Email Address</Text>
                  <Input py={0} px={3} name="email" type="email" onChangeText={handleChange('email')} onBlur={handleBlur('email')} value={values.email} autoCapitalize='none' size="md" variant="unstyled" placeholderTextColor="#000" />
                </Box>
                {(errors.email && touched.email) &&
                  <Text mt={-2} mb={2} pl={3} fontSize="12" color="red.500">{errors.email}</Text>
                }
                <Box bg="#EFF1F2" width="340px" py={2} borderRadius="10" mb={2}>
                  <Text px={3} fontSize="xs" color="#024580">Password</Text>
                  <Input py={0} px={3} name="password" type="password" onChangeText={handleChange('password')} onBlur={handleBlur('password')} value={values.password} autoCapitalize='none' size="md" variant="unstyled" placeholderTextColor="#000" />
                </Box>
                {(errors.password && touched.password) &&
                  <Text mt={-2} mb={2} pl={3} fontSize="12" color="red.500">{errors.password}</Text>
                }
                <Button isLoading={loading} size="sm" mt={6} variant="unstyled" borderWidth="2" onPress={handleSubmit} borderRadius={10} borderColor="#024580" _text={{
                  color: "#024580",
                  fontWeight: "500",
                }}>
                  SIGN IN
                </Button>
              </>
            )}
          </Formik>
          {message && <Box my={10}>
            {message.includes('pending') && <Button mb={2} size="sm" variant="unstyled" disabled={false} bg="#FAE18D" borderRadius={10} borderWidth={1} borderColor="#D3A21F" _text={{
              color: "#D3A21F"
            }}>
              Your account is under review, please try again later!
            </Button>}
            <Box >
              {message.includes('suspended') &&
                <Button mb={2} size="sm" variant="unstyled" disabled={false} bg="#F2675B" borderRadius={10} borderWidth={1} borderColor="#D84949" _text={{
                  color: "#fff"
                }}>
                  Your account has been suspended!
                </Button>
              }
              {message.includes('suspended') &&
                <Button Button mb={2} size="sm" variant="unstyled" disabled={false} bg="#F2675B" borderRadius={10} borderWidth={1} borderColor="#D84949" _text={{
                  color: "#fff"
                }}>
                  As per your request, this account will be deleted!
                </Button>
              }
              {message.includes('Login failed') &&
                <Button mb={2} size="sm" variant="unstyled" disabled={false} bg="#F2675B" borderRadius={10} borderWidth={1} borderColor="#D84949" _text={{
                  color: "#fff"
                }}>
                  The credentials provided were invalid!
                </Button>
              }
            </Box>
          </Box>}
        </VStack>
      </Container>
    </DismissKeyboard>
  )
}

export default SignInScreen

