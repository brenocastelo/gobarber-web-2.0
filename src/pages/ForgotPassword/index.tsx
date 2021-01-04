import React, { useCallback, useRef, useState } from 'react'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import {FiLogIn, FiMail} from 'react-icons/fi'
import * as Yup from 'yup';

import { useToast } from '../../context/ToastContext';
import { getValidationErrors } from '../../utils/getValidationErrors';

import logo from '../../assets/logo.svg'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { AnimationContainer, Background, Container, Content } from './styles'
import api from '../../services/api';
import { Link } from 'react-router-dom';

interface ForgotPasswordFormData {
  email:string
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { addToast } = useToast()

  const handleSubmit = useCallback(
    async ({ email }: ForgotPasswordFormData) => {
      try {
        setIsLoading(true)

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail é obrigatório")
            .email('Digite um e-mail válido')
        })

        await schema.validate({ email }, { abortEarly: false })

        await api.post('/password/recovery', {
          email
        });

        addToast({
          type: 'success',
          title: 'Email de recuperação de senha enviado',
          description: `Enviamos um email para sua recuperação de senha. Cheque sua caixa de entrada.`
        })
      } catch (error) {
        if(error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro ao recuperar senha',
          description: 'Por favor, verifique o email e tente novamente.'
        })
      } finally {
        setIsLoading(false)
      }
    },
    [addToast]
  )

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber"/>

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              icon={FiMail}
              name="email"
              placeholder="E-mail"
            />

            <Button isLoading={isLoading} type="submit">Recuperar</Button>
          </Form>

          <Link to="/">
            <FiLogIn/>
            Voltar para o login
          </Link>
        </AnimationContainer>
      </Content>

      <Background/>
    </Container>
  )
}

export default ForgotPassword;
